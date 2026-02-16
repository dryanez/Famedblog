
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
    
    # Debug: Check KB context
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

    print("✍️ Generating new content with Local Llama...")
    # Using Llama instead of Gemini due to quota
    new_content = generate_blog_post_with_local_llama(TOPIC, book_context)

    if new_content:
        print(f"Saving to {FILENAME}...")
        with open(FILENAME, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Done! Blog post updated with Knowledge Base insights.")
    else:
        print("❌ Failed to generate content.")

if __name__ == "__main__":
    regenerate_post()
