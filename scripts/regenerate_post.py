
import os
import sys
from dotenv import load_dotenv

# Load env vars
env_path = os.path.join(os.getcwd(), '.env')
env_local_path = os.path.join(os.getcwd(), '.env.local')
env_blog_local_path = os.path.join(os.getcwd(), 'blog_website/.env.local')

load_dotenv(env_path)
load_dotenv(env_local_path)
load_dotenv(env_blog_local_path)

# Add scripts dir to path to import topic_research
sys.path.append(os.path.join(os.getcwd(), 'scripts'))

from topic_research import generate_blog_post_with_local_llama, get_knowledge_base_context

TOPIC = "Top 10 FaMED Mistakes Foreign Doctors Make"
FILENAME = "blog/posts/top-10-famed-mistakes.md"

def regenerate_post():
    print(f"🧠 Regenerating blog post: {TOPIC}")
    print("Fetching Knowledge Base context...")
    
    # Use function imported at top level
    kb_context = get_knowledge_base_context()
    if kb_context:
        print(f"✅ Found Knowledge Base context ({len(kb_context)} chars)")
    else:
        print("⚠️ Warning: No Knowledge Base context found!")

    book_context = """
    The FaMED Protokoll Book covers:
    - Communication skills and Anamnese techniques
    - Differential diagnosis strategies
    - Physical examination procedures
    - Common exam scenarios and role-plays
    """

    print("✍️ Generating new content...")
    
    # Try Gemini first for quality
    try:
        from topic_research import generate_blog_post_with_gemini
        new_content = generate_blog_post_with_gemini(TOPIC, book_context)
    except Exception:
        new_content = None

    # Fallback to Llama with better prompt
    if not new_content:
        print("⚠️ Gemini failed/quota. Using Local Llama via Ollama...")
        import requests
        
        # We already have kb_context from earlier
        
        prompt = f"""You are an expert medical writer for FaMED-Vorbereitung.com.
        
        TASK: Write a comprehensive blog post titled "{TOPIC}".
        
        CONTEXT FROM KNOWLEDGE BASE (Use as Ground Truth):
        {kb_context}
        
        STRUCTURE:
        - Title: {TOPIC}
        - Introduction: Why candidates fail
        - 10 distinct mistakes with detailed explanations and solutions (referencing specific FaMED facts from context)
        - Conclusion: Encouragement
        
        REQUIREMENTS:
        - Write in German (High C1 Medical Level)
        - Be strictly factual based on Knowledge Base
        - Format in Markdown
        - Approx 1500 words
        - **CRITICAL:** You MUST include a "Resources" or "Call to Action" section at the end with these EXACT links:
            - FaMED Protokoll Book: https://famed-vorbereitung.com
            - FaMED App: https://app.famed-test.de
            - Simulation / Übungsexamen: https://famed-vorbereitung.com/exam
            - Telegram Group: https://t.me/FamedTest
            - WhatsApp Group: https://chat.whatsapp.com/FamedTest
        
        Generate the Full Blog Post Now:"""
        
        payload = {
            "model": "llama3:latest",
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=600)
            if response.status_code == 200:
                new_content = response.json().get('response')
        except Exception as e:
            print(f"❌ Llama failed: {e}")

    if new_content:
        print(f"Saving to {FILENAME}...")
        with open(FILENAME, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Done! Blog post updated with Knowledge Base insights.")
    else:
        print("❌ Failed to generate content.")

if __name__ == "__main__":
    regenerate_post()
