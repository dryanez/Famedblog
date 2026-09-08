import os
import time
import re
import requests
import glob
import subprocess
import json
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
load_dotenv('./blog_website/.env.local')  # Load web app env vars (Supabase/Resend)

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"
BLOG_WEBSITE_DIR = "./blog_website/blog/posts"
DRAFTS_DIR = "./blog/posts"

# Replace this with your actual Google Sheet URL
SHEET_URL = "https://docs.google.com/spreadsheets/d/13KUXraZf5Plnufqxnoe0cY4jk57hEeC-/edit"

# Preview system
PREVIEW_STORAGE = "./blog_website/preview_drafts.json"
WEBSITE_URL = "https://famed-vorbereitung.com"

# Bot state management
edit_mode = {}  # {chat_id: {'post_slug': '...', 'preview_id': '...'}}

# Initialize Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use the best available model
    gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print("✅ Gemini AI enabled for smart editing")
else:
    gemini_model = None
    print("⚠️ No Gemini API key, using basic editing")

def load_preview_storage():
    """Load preview storage from JSON file"""
    if os.path.exists(PREVIEW_STORAGE):
        with open(PREVIEW_STORAGE, 'r') as f:
            return json.load(f)
    return {}

def save_preview_storage(storage):
    """Save preview storage to JSON file"""
    with open(PREVIEW_STORAGE, 'w') as f:
        json.dump(storage, f, indent=2)

def create_preview(post_slug):
    """Create a preview for a draft post"""
    # Find the draft file
    draft_path = f"{DRAFTS_DIR}/{post_slug}.md"
    if not os.path.exists(draft_path):
        return None, "Draft not found"
    
    # Read the content
    with open(draft_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate unique preview ID
    preview_id = str(uuid.uuid4())
    
    # Store preview
    storage = load_preview_storage()
    storage[preview_id] = {
        'post_slug': post_slug,
        'content': content,
        'created_at': datetime.now().isoformat(),
        'expires_at': (datetime.now() + timedelta(hours=24)).isoformat()
    }
    save_preview_storage(storage)
    
    preview_url = f"{WEBSITE_URL}/preview/{preview_id}"
    return preview_url, None

def update_draft_with_ai(post_slug, instruction, chat_id):
    """Update a draft using Gemini AI"""
    draft_path = f"{DRAFTS_DIR}/{post_slug}.md"
    
    with open(draft_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    try:
        prompt = f"""You are a blog post editor. Given the following blog post content and an instruction, return ONLY the updated blog post content. Do not add explanations or comments.

INSTRUCTION: {instruction}

BLOG POST CONTENT:
{content}

UPDATED BLOG POST (return ONLY the markdown content, nothing else):"""
        
        response = gemini_model.generate_content(prompt)
        updated_content = response.text
        
        # Save updated draft
        with open(draft_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        return updated_content, None
        
    except Exception as e:
        # Check if quota exceeded
        error_msg = str(e)
        if 'quota' in error_msg.lower() or 'rate limit' in error_msg.lower():
            send_message(chat_id, "⚠️ **GEMINI API QUOTA EXCEEDED**\n\nYour API credits have run out. Please check your Google AI Studio account.")
            return None, "API quota exceeded"
        return None, f"AI error: {error_msg[:100]}"

def update_draft(post_slug, instruction, chat_id=None):
    """Update a draft based on instruction (AI or fallback to basic)"""
    # Try AI first if available
    if gemini_model and chat_id:
        return update_draft_with_ai(post_slug, instruction, chat_id)
    
    # Fallback to basic pattern matching
    draft_path = f"{DRAFTS_DIR}/{post_slug}.md"
    
    with open(draft_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Basic editing patterns
    patterns = [
        (r'change\s+(?:the\s+)?(?:price|cost)\s+to\s+([€$]?\d+(?:\.\d{2})?)', lambda m: replace_price(content, m.group(1))),
        (r'replace\s+["\'](.+?)["\']\s+with\s+["\'](.+?)["\']', lambda m: content.replace(m.group(1), m.group(2))),
        (r'remove\s+(?:the\s+)?(.+?)\s+section', lambda m: remove_section(content, m.group(1))),
    ]
    
    for pattern, handler in patterns:
        match = re.search(pattern, instruction.lower())
        if match:
            content = handler(match)
            break
    else:
        return None, f"I don't understand '{instruction}'. (AI disabled: no API key)"
    
    # Save updated draft
    with open(draft_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return content, None

def replace_price(content, new_price):
    """Replace prices in content"""
    # Replace common price patterns
    content = re.sub(r'€\d+(?:\.\d{2})?', new_price if '€' in new_price else f'€{new_price}', content)
    content = re.sub(r'\$\d+(?:\.\d{2})?', new_price if '$' in new_price else f'${new_price}', content)
    return content

def remove_section(content, section_name):
    """Remove a section from the content"""
    # Simple approach: remove heading and content until next heading
    pattern = rf'##\s+.*?{re.escape(section_name)}.*?\n(.*?)(?=\n##|$)'
    return re.sub(pattern, '', content, flags=re.IGNORECASE | re.DOTALL) 

def is_valid_email(email):
    """Check if text is a valid email address"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email.strip()) is not None

def save_lead_to_supabase(email, first_name="Doctor"):
    """Save lead to Supabase database"""
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not service_key:
        print("Warning: Supabase credentials missing. Creating lead skipped.")
        return False
        
    url = f"{supabase_url}/rest/v1/leads"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = {
        "email": email,
        "first_name": first_name,
        "source": "telegram_bot"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code in [200, 201]:
            return True
        elif response.status_code == 409: # Conflict/Duplicate
            print("Email already exists in leads.")
            return True
        print(f"Supabase error: {response.text}")
        return False
    except Exception as e:
        print(f"Supabase exception: {e}")
        return False

def send_lead_magnet_email(email, first_name="Doctor"):
    """Send the lead magnet email via Resend"""
    resend_key = os.getenv('RESEND_API_KEY')
    if not resend_key:
        print("Error: Resend API key missing")
        return False
        
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your FaMED Study Plan</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #333333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #2563eb;">
                <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED-Vorbereitung" style="height: 50px; width: auto; max-width: 100%;">
            </td>
        </tr>

        <!-- Main Content -->
        <tr>
            <td style="padding: 40px;">
                <h2 style="color: #1f2937; margin-top: 0;">Hi {{first_name}}!</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Here is the <strong>8-Week FaMED Study Plan</strong> you requested via Telegram. This roadmap has helped hundreds of doctors pass their exam, and we're excited for it to help you too!
                </p>
                
                <!-- Primary Action: Download Button -->
                <div style="margin: 30px 0; text-align: center;">
                    <a href="https://famed-vorbereitung.com/FAMED_8WEEK_CORRECTED_STUDY_PLAN.pdf" 
                       style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                       Download Study Plan (PDF) →
                    </a>
                    <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">(Right click and 'Save As' if the link opens in browser)</p>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <!-- Community Section -->
                <h3 style="color: #1f2937; margin-bottom: 15px;">🚀 Join the Community</h3>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Don't study alone! Join our private Telegram group with 500+ other doctors preparing for the FaMED exam. Share cases, ask questions, and get support.
                </p>
                <div style="margin-top: 20px; text-align: left;">
                    <a href="https://t.me/+vgtsHuqtwfk4MTJh" 
                       style="color: #0891b2; text-decoration: none; font-weight: bold; font-size: 16px;">
                       Join Telegram Group →
                    </a>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                <!-- Upsell Section: The Book -->
                <div style="background-color: #f0f9ff; border-radius: 8px; padding: 25px; border: 1px solid #bae6fd;">
                    <h3 style="color: #0369a1; margin-top: 0;">Want the Complete Package?</h3>
                    <p style="font-size: 15px; line-height: 1.5; color: #334155;">
                        The Study Plan tells you <em>when</em> to study. The <strong>FaMED Protokoll Book</strong> tells you <em>what</em> to study.
                    </p>
                    <ul style="padding-left: 20px; color: #475569; font-size: 14px;">
                        <li style="margin-bottom: 5px;">All 76 Official Cases covered</li>
                        <li style="margin-bottom: 5px;">Perfect Communication Scripts</li>
                        <li style="margin-bottom: 5px;">Examination Frameworks</li>
                    </ul>
                    <div style="margin-top: 20px;">
                        <a href="https://famed-vorbereitung.com/book" 
                           style="background-color: #0284c7; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block;">
                           Get the Book (€49.99) →
                        </a>
                    </div>
                </div>

                <p style="margin-top: 30px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                    Viel Erfolg,<br>
                    <strong>The FaMED-Vorbereitung Team</strong>
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f3f4f6; font-size: 12px; color: #6b7280;">
                <p style="margin: 0;">&copy; {datetime.now().year} FaMED-Vorbereitung. All rights reserved.</p>
                <p style="margin: 5px 0;">You received this email because you signed up for our study resources.</p>
            </td>
        </tr>
    </table>
</body>
</html>
    """
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {resend_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "from": "FaMED-Vorbereitung <team@famed-vorbereitung.com>",
        "to": email,
        "subject": "Your 8-Week FaMED Study Plan 📚",
        "html": html_content.format(first_name=first_name)
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            return True
        print(f"Resend error: {response.text}")
        return False
    except Exception as e:
        print(f"Resend exception: {e}")
        return False

def handle_email(email, chat_id):
    """Handle email submission flow"""
    print(f"Processing email: {email}")
    send_message(chat_id, f"📥 Received email: {email}\nProcessing...")
    
    # 1. Save to Supabase (optional, but good for tracking)
    save_lead_to_supabase(email)
    
    # 2. Send Email
    success = send_lead_magnet_email(email)
    
    if success:
        send_message(chat_id, "✅ **Success!** The lead magnet has been sent to your email! Check your inbox (and spam just in case).")
    else:
        send_message(chat_id, "❌ **Error:** Could not send the email. Please try again later.") 

def get_last_post():
    """Find the most recently published post"""
    files = glob.glob(f"{BLOG_WEBSITE_DIR}/*.md")
    if not files:
        return "No posts published yet."
    
    latest_date = ""
    latest_post = None
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            # Only count published posts
            if 'status: "published"' in content or "status: 'published'" in content:
                match_date = re.search(r'date: "(\d{4}-\d{2}-\d{2})"', content)
                match_title = re.search(r'title: "(.*?)"', content)
                
                if match_date and match_title:
                    date = match_date.group(1)
                    if date > latest_date:
                        latest_date = date
                        latest_post = {
                            'title': match_title.group(1),
                            'date': date,
                            'slug': os.path.basename(f).replace('.md', '')
                        }
    
    if latest_post:
        return (f"📰 **Last Post:**\n"
                f"{latest_post['title']}\n"
                f"📅 {latest_post['date']}\n"
                f"🔗 Web: https://famed-vorbereitung.com/blog/{latest_post['slug']}\n"
                f"📱 FB: https://facebook.com/962537100266469")
    else:
        return "Could not determine last post."

def get_recent_posts(limit=5):
    """Get the most recent posts (both published and draft)"""
    posts = []
    
    # Check both published and draft locations
    for directory in [BLOG_WEBSITE_DIR, DRAFTS_DIR]:
        files = glob.glob(f"{directory}/*.md")
        
        for f in files:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
                match_date = re.search(r'date: "(\d{4}-\d{2}-\d{2})"', content)
                match_title = re.search(r'title: "(.*?)"', content)
                match_status = re.search(r'status: "(.*?)"', content)
                
                if match_date and match_title:
                    posts.append({
                        'title': match_title.group(1),
                        'date': match_date.group(1),
                        'slug': os.path.basename(f).replace('.md', ''),
                        'status': match_status.group(1) if match_status else 'unknown',
                        'path': f
                    })
    
    # Sort by date and return latest
    posts.sort(key=lambda x: x['date'], reverse=True)
    return posts[:limit]

def send_message_with_buttons(chat_id, text, buttons):
    """Send message with inline keyboard buttons"""
    url = f"{BASE_URL}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
        "reply_markup": {
            "inline_keyboard": buttons
        }
    }
    requests.post(url, json=payload)

def answer_callback(callback_id, text=""):
    """Answer a callback query"""
    url = f"{BASE_URL}/answerCallbackQuery"
    requests.post(url, json={"callback_query_id": callback_id, "text": text})

def get_next_drafts(chat_id):
    """Show list of next 5 drafts as buttons"""
    files = glob.glob(f"{DRAFTS_DIR}/*.md")
    drafts = []
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            # Check if draft
            if 'status: "draft"' in content or "status: 'draft'" in content:
                match_date = re.search(r'date: "(\d{4}-\d{2}-\d{2})"', content)
                match_title = re.search(r'title: "(.*?)"', content)
                
                if match_date and match_title:
                    drafts.append({
                        'title': match_title.group(1),
                        'date': match_date.group(1),
                        'slug': os.path.basename(f).replace('.md', '')
                    })
    
    if not drafts:
        send_message(chat_id, "📭 No drafts found.")
        return
    
    # Sort by date (oldest first)
    drafts.sort(key=lambda x: x['date'])
    
    # Create buttons
    buttons = []
    for i, draft in enumerate(drafts[:5]):
        label = "Next" if i == 0 else f"{i+1}."
        button_text = f"{label} {draft['title'][:30]}..."
        buttons.append([{
            "text": button_text,
            "callback_data": f"draft:{draft['slug']}"
        }])
        
    buttons.append([{"text": "« Back to Queue", "callback_data": "menu"}])
    
    text = "🔜 **Next Drafts Queue**\n\nSelect a draft to view details:"
    send_message_with_buttons(chat_id, text, buttons)

def handle_draft_detail(chat_id, slug):
    """Show details for a specific draft"""
    # Simply reuse handle_post_action logic but customized for drafts
    preview_url, error = create_preview(slug)
    
    if error:
        send_message(chat_id, f"❌ {error}")
        return
        
    buttons = [
        [{"text": "🚀 Publish Now", "callback_data": f"publish:{slug}"}],
        [{"text": "🔄 Regenerate Topic", "callback_data": f"regenerate:{slug}"}],
        [{"text": "📝 Edit Content", "callback_data": f"edit:{slug}"}],
        [{"text": "📖 Preview Browser", "url": preview_url}],
        [{"text": "« Back to Queue", "callback_data": "cmd:next"}]
    ]
    
    text = (f"📄 **Draft Details**\n\n"
            f"**Slug:** `{slug}`\n"
            f"**Preview:** {preview_url}\n\n"
            f"What would you like to do?")
            
    send_message_with_buttons(chat_id, text, buttons)

def get_status():
    """System stats"""
    # Count strictly published in website folder
    pub_files = glob.glob(f"{BLOG_WEBSITE_DIR}/*.md")
    published_count = 0
    for f in pub_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            if 'status: "published"' in content or "status: 'published'" in content:
                published_count += 1
                
    # Count waitlist drafts in drafts folder
    draft_files = glob.glob(f"{DRAFTS_DIR}/*.md")
    draft_count = 0
    for f in draft_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            if 'status: "draft"' in content or "status: 'draft'" in content:
                draft_count += 1
                
    return (f"📊 **Blog Status:**\n"
            f"✅ Live Posts: {published_count}\n"
            f"📝 Waiting Drafts: {draft_count}\n"
            f"🤖 Bot: Online")

def show_main_menu(chat_id):
    """Show the main menu with all commands as buttons"""
    buttons = [
        [{"text": "📰 Last Post", "callback_data": "cmd:last"}],
        [{"text": "🔜 Next Draft", "callback_data": "cmd:next"}],
        [{"text": "📚 Manage Posts", "callback_data": "cmd:posts"}],
        [{"text": "🚀 Publish Next", "callback_data": "cmd:publish"}],
        [{"text": "📊 Status", "callback_data": "cmd:status"}, {"text": "📋 Sheet", "callback_data": "cmd:sheet"}],
    ]
    
    text = ("👋 **FaMED Blog Assistant**\n\n"
            "Choose a command:")
    
    send_message_with_buttons(chat_id, text, buttons)

def handle_command(command, chat_id):
    print(f"Received command: {command}")
    
    if command == '/start' or command == '/menu':
        show_main_menu(chat_id)
        return
        response = ("👋 **Hi Felipe!** I am your FaMED Blog Assistant.\n\n"
                    "**Commands:**\n"
                    "/last - Show last published post\n"
                    "/next - Show next scheduled post\n"
                    "/posts - Manage recent posts\n"
                    "/publish - Force publish next draft\n"
                    "/review [slug] - Preview and edit a draft\n"
                    "/done - Exit edit mode\n"
                    "/status - Show blog statistics\n"
                    "/sheet - Link to Content Calendar")
    elif command == '/help':
        show_main_menu(chat_id)
        return
    elif command.startswith('/last'):
        response = get_last_post()
        buttons = [[ {"text": "« Back to Menu", "callback_data": "menu"} ]]
        send_message_with_buttons(chat_id, response, buttons)
        return
    elif command.startswith('/next'):
        get_next_drafts(chat_id)
        return
    elif command.startswith('/status'):
        response = get_status()
        buttons = [[ {"text": "« Back to Menu", "callback_data": "menu"} ]]
        send_message_with_buttons(chat_id, response, buttons)
        return
    elif command.startswith('/sheet'):
        buttons = [
            [{"text": "📊 Open Sheet", "url": SHEET_URL}],
            [{"text": "« Back to Menu", "callback_data": "menu"}]
        ]
        send_message_with_buttons(chat_id, "📊 **Content Calendar**\n\nClick below to open:", buttons)
        return
    elif command.startswith('/publish') or command.startswith('/release'):
        handle_publish(chat_id)
        return # handle_publish sends its own messages
    elif command.startswith('/review'):
        handle_review_command(command, chat_id)
        return
    elif command == '/done':
        handle_done_command(chat_id)
        return
    elif command.startswith('/posts') or command.startswith('/list'):
        handle_posts_command(chat_id)
        return
    else:
        response = "Unknown command. Try /last, /next, /status, or /sheet."
        
    send_message(chat_id, response)

def send_message(chat_id, text):
    url = f"{BASE_URL}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    requests.post(url, json=payload)

def handle_publish(chat_id):
    """Trigger the manual publishing of the next blog post"""
    send_message(chat_id, "🚀 **Starting Publishing Process...**\nChecking for drafts to force-publish. This might take a minute.")
    
    try:
        # Run the automation agent with --force flag
        result = subprocess.run(
            ['python3', 'blog_automation_agent.py', '--force'],
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        output = result.stdout
        
        if result.returncode == 0:
            # Check output for success message
            response_msg = ""
            
            if "Successfully published" in output:
                response_msg += "✅ **Published Successfully!**\n\nThe post is live and posted to connected platforms.\n"
                
                # Check for specific integrations
                if "Newsletter sent successfully" in output:
                    response_msg += "📧 **Newsletter:** Sent to all leads ✅\n"
                else:
                    response_msg += "📧 **Newsletter:** Not sent (Check logs) ⚠️\n"
                    
                if "FB: Posted" in output or "status to: Published" in output: # Approximate check
                    response_msg += "📘 **Facebook:** Posted ✅\n"
                
                if "Queue managed" in output:
                    response_msg += "📋 **Queue:** Auto-updated & filled ✅"
                
                send_message(chat_id, response_msg)
            elif "No posts scheduled" in output:
                send_message(chat_id, "ℹ️  **No Drafts Found.**\nThere were no drafts available to publish.")
            else:
                # Send last few lines of output
                tail = "\n".join(output.splitlines()[-5:])
                send_message(chat_id, f"✅ **Ran Automation**\n(Check if it worked):\n```{tail}```")
        else:
            send_message(chat_id, f"❌ **Error Running Script:**\n```{result.stderr}```")
            
    except subprocess.TimeoutExpired:
        send_message(chat_id, "⚠️ **Timeout:** The script took too long to run. It might still be working in the background.")
    except Exception as e:
        send_message(chat_id, f"❌ **Exception:** {str(e)}")

def handle_review_command(command, chat_id):
    """Handle /review [slug] command"""
    parts = command.split(maxsplit=1)
    
    if len(parts) < 2:
        send_message(chat_id, "❌ Please specify a post slug: `/review post-slug-name`")
        return
    
    post_slug = parts[1].strip()
    
    # Create preview
    preview_url, error = create_preview(post_slug)
    
    if error:
        send_message(chat_id, f"❌ {error}")
        return
    
    # Enter edit mode
    preview_id = preview_url.split('/')[-1]
    edit_mode[chat_id] = {
        'post_slug': post_slug,
        'preview_id': preview_id
    }
    
    response = (f"🔗 **Preview Ready!**\n\n"
                f"{preview_url}\n\n"
                f"📝 **Edit Mode Active**\n"
                f"Send me instructions like:\n"
                f"• \"Change price to €49.99\"\n"
                f"• \"Remove bundle section\"\n"
                f"• \"Replace 'X' with 'Y'\"\n\n"
                f"Use `/done` to exit or `/publish` to publish immediately.")
    
    send_message(chat_id, response)

def handle_done_command(chat_id):
    """Exit edit mode"""
    if chat_id in edit_mode:
        post_slug = edit_mode[chat_id]['post_slug']
        del edit_mode[chat_id]
        send_message(chat_id, f"✅ Edit mode closed for `{post_slug}`. Draft saved but not published.")
    else:
        send_message(chat_id, "ℹ️ You're not in edit mode. Use `/review [slug]` first.")

def handle_edit_instruction(text, chat_id):
    """Handle editing instructions when in edit mode"""
    mode = edit_mode.get(chat_id)
    if not mode:
        return False  # Not in edit mode
    
    post_slug = mode['post_slug']
    
    # Update the draft (with AI if available)
    updated_content, error = update_draft(post_slug, text, chat_id)
    
    if error:
        send_message(chat_id, error)
        return True
    
    # Create new preview with updated content
    preview_url, error = create_preview(post_slug)
    
    if error:
        send_message(chat_id, f"✅ Updated, but preview failed: {error}")
        return True
    
    # Update stored preview ID
    mode['preview_id'] = preview_url.split('/')[-1]
    
    send_message(chat_id, f"✅ **Updated!**\n\n🔗 New preview:\n{preview_url}")
    return True

def handle_posts_command(chat_id):
    """Show recent posts with action buttons"""
    posts = get_recent_posts(5)
    
    if not posts:
        send_message(chat_id, "📭 No posts found.")
        return
    
    # Create buttons for each post
    buttons = []
    for post in posts:
        status_emoji = "✅" if post['status'] == 'published' else "📝"
        button_text = f"{status_emoji} {post['title'][:40]}..."
        buttons.append([{
            "text": button_text,
            "callback_data": f"post:{post['slug']}"
        }])
    
    text = "📚 **Recent Posts**\n\nSelect a post to manage:"
    send_message_with_buttons(chat_id, text, buttons)

def handle_post_action(chat_id, slug, action):
    """Handle actions on a specific post"""
    if action == 'view':
        url = f"https://famed-vorbereitung.com/blog/{slug}"
        send_message(chat_id, f"🔗 **View Online:**\n{url}")
    
    elif action == 'edit':
        # Enter review mode
        preview_url, error = create_preview(slug)
        if error:
            send_message(chat_id, f"❌ {error}")
            return
        
        preview_id = preview_url.split('/')[-1]
        edit_mode[chat_id] = {
            'post_slug': slug,
            'preview_id': preview_id
        }
        
        response = (f"📝 **Edit Mode Active**\n\n"
                    f"🔗 Preview: {preview_url}\n\n"
                    f"Send editing instructions or use `/done` to exit.")
        send_message(chat_id, response)
    
    elif action == 'delete':
        # Check if published or draft
        is_published = False
        target_file = None
        
        # Check website folder first (Published)
        if os.path.exists(f"{BLOG_WEBSITE_DIR}/{slug}.md"):
            target_file = f"{BLOG_WEBSITE_DIR}/{slug}.md"
            is_published = True
        elif os.path.exists(f"{DRAFTS_DIR}/{slug}.md"):
            target_file = f"{DRAFTS_DIR}/{slug}.md"
            
        if target_file:
            if is_published:
                # Revert to Draft
                try:
                    with open(target_file, 'r') as f:
                        content = f.read()
                    
                    # Update frontmatter status
                    content = content.replace('status: "published"', 'status: "draft"')
                    content = content.replace("status: 'published'", "status: 'draft'")
                    
                    with open(target_file, 'w') as f:
                        f.write(content)
                        
                    send_message(chat_id, f"↩️ **Reverted:** `{slug}`\n\nPost is back in Draft status.")
                except Exception as e:
                    send_message(chat_id, f"❌ Error reverting: {e}")
            else:
                # Delete completely (It's a draft)
                # Or user might want to regenerate. For now "Delete" means delete.
                os.remove(target_file)
                
                # Auto-Refill Queue
                from blog_automation_agent import BlogAutomationAgent
                agent = BlogAutomationAgent()
                success = agent.fill_queue_with_new_topic()
                
                if success:
                    agent.manage_queue()
                    send_message(chat_id, f"🗑️ **Deleted Draft:** `{slug}`\n🔄 **Auto-Refill:** Added new topic to queue.")
                else:
                    send_message(chat_id, f"🗑️ **Deleted Draft:** `{slug}`\n⚠️ Queue not refilled (Check logs).")
        else:
            send_message(chat_id, f"❌ Post not found: `{slug}`")

def handle_regenerate_draft(chat_id, slug):
    """Delete draft and generate a completely new topic"""
    send_message(chat_id, "🔄 **Regenerating...** \n1. Removing old draft\n2. Researching new hot topic\n3. Writing new content\n\nThis takes about 30 seconds.")
    
    try:
        # 1. Delete old draft
        file_path = f"{DRAFTS_DIR}/{slug}.md"
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # 2. Call automation agent to fill queue
        # We need to import the class here to use it
        from blog_automation_agent import BlogAutomationAgent
        agent = BlogAutomationAgent()
        
        # Fill queue (will find 1 missing spot and fill it)
        success = agent.fill_queue_with_new_topic()
        
        if success:
            # Re-manage queue to update labels
            agent.manage_queue()
            send_message(chat_id, "✅ **Success!**\nNew trending topic created and added to queue.\nCheck `/next` to see it.")
        else:
            send_message(chat_id, "⚠️ **Could not generate new topic.**\nCheck logs or quota.")
            
    except Exception as e:
        send_message(chat_id, f"❌ Error regenerating: {e}")

def handle_callback_query(callback_id, chat_id, data):
    """Handle callback button presses"""
    answer_callback(callback_id)
    
    # Main menu navigation
    if data == 'menu':
        show_main_menu(chat_id)
        return
    
    # Command shortcuts
    if data.startswith('cmd:'):
        cmd = data.split(':', 1)[1]
        
        if cmd == 'last':
            response = get_last_post()
            buttons = [[ {"text": "« Back to Menu", "callback_data": "menu"} ]]
            send_message_with_buttons(chat_id, response, buttons)
        
        elif cmd == 'next':
            get_next_drafts(chat_id)
        
        elif cmd == 'status':
            response = get_status()
            buttons = [[ {"text": "« Back to Menu", "callback_data": "menu"} ]]
            send_message_with_buttons(chat_id, response, buttons)
        
        elif cmd == 'sheet':
            buttons = [
                [{"text": "📊 Open Sheet", "url": SHEET_URL}],
                [{"text": "« Back to Menu", "callback_data": "menu"}]
            ]
            send_message_with_buttons(chat_id, "📊 **Content Calendar**\n\nClick below to open:", buttons)
        
        elif cmd == 'posts':
            handle_posts_command(chat_id)
        
        elif cmd == 'publish':
            handle_publish(chat_id)
        
        return
    
    # Draft Queue Management
    if data.startswith('draft:'):
        slug = data.split(':', 1)[1]
        handle_draft_detail(chat_id, slug)
        return
    
    if data.startswith('publish:'):
        slug = data.split(':', 1)[1]
        # Run publish for specific slug (requires updating automation agent to accept slug or just force next)
        # For now, we'll assume publish means "publish next" but checking if it matches might be complex separately.
        # However, usually users just want to publish the "Next" one.
        # If they pick 2nd, the logic should ideally handle it, but automation agent currently does "Next".
        # Let's clarify:
        handle_publish(chat_id) 
        return
    
    if data.startswith('regenerate:'):
        slug = data.split(':', 1)[1]
        handle_regenerate_draft(chat_id, slug)
        return

    # Post management
    if data.startswith('post:'):
        # Show action buttons for this post
        slug = data.split(':', 1)[1]
        
        buttons = [
            [{"text": "🌐 View Online", "callback_data": f"view:{slug}"}],
            [{"text": "✏️ Edit", "callback_data": f"edit:{slug}"}],
            [{"text": "🗑️ Delete", "callback_data": f"delete:{slug}"}],
            [{"text": "« Back", "callback_data": "back:posts"}]
        ]
        
        send_message_with_buttons(chat_id, f"**Post:** `{slug}`\n\nChoose an action:", buttons)
    
    elif data.startswith('view:'):
        slug = data.split(':', 1)[1]
        handle_post_action(chat_id, slug, 'view')
    
    elif data.startswith('edit:'):
        slug = data.split(':', 1)[1]
        handle_post_action(chat_id, slug, 'edit')
    
    elif data.startswith('delete:'):
        slug = data.split(':', 1)[1]
        # Add confirmation
        buttons = [
            [{"text": "⚠️ Yes, Delete", "callback_data": f"confirm_delete:{slug}"}],
            [{"text": "« Cancel", "callback_data": f"post:{slug}"}]
        ]
        send_message_with_buttons(chat_id, f"⚠️ **Confirm Deletion**\n\n`{slug}`\n\nAre you sure?", buttons)
    
    elif data.startswith('confirm_delete:'):
        slug = data.split(':', 1)[1]
        handle_post_action(chat_id, slug, 'delete')
        # Show menu after delete
        buttons = [[ {"text": "« Back to Menu", "callback_data": "menu"} ]]
        send_message_with_buttons(chat_id, "✅ Post deleted", buttons)
    
    elif data == 'back:posts':
        handle_posts_command(chat_id)

def main():
    print("🤖 Blog Bot Started... (Press Ctrl+C to stop)")
    offset = 0
    
    while True:
        try:
            # Poll for updates
            url = f"{BASE_URL}/getUpdates?offset={offset + 1}&timeout=30"
            resp = requests.get(url, timeout=45)
            data = resp.json()
            
            if data.get('ok') and data.get('result'):
                for update in data['result']:
                    update_id = update['update_id']
                    offset = max(offset, update_id)
                    
                    if 'message' in update and 'text' in update['message']:
                        text = update['message']['text'].strip()
                        chat_id = update['message']['chat']['id']
                        
                        if text.startswith('/'):
                            handle_command(text, chat_id)
                        elif is_valid_email(text):
                            handle_email(text, chat_id)
                        elif not handle_edit_instruction(text, chat_id):
                            # Not in edit mode and not an email, ignore
                            pass
                    
                    # Handle callback queries (button presses)
                    elif 'callback_query' in update:
                        callback_id = update['callback_query']['id']
                        chat_id = update['callback_query']['message']['chat']['id']
                        data = update['callback_query']['data']
                        handle_callback_query(callback_id, chat_id, data)
            time.sleep(1)
            
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
