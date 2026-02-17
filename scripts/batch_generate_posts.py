
import os
import sys
from dotenv import load_dotenv
import re

# Load env vars
load_dotenv()
load_dotenv('.env.local')

# Add scripts dir to path
sys.path.append(os.path.join(os.getcwd(), 'scripts'))

from topic_research import get_knowledge_base_context, generate_blog_post_with_gemini

# List of missing posts
POSTS_TO_GENERATE = [
    {
        "title": "Systematic Anamnesis for Sore Throat, Chronic Fatigue & Infectious Symptoms",
        "date": "2026-01-18",
        "slug": "anamnese-sore-throat-fatigue",
        "description": "Learn how to conduct a thorough anamnesis for common ENT complaints like tonsillitis, general infectious symptoms, and chronic fatigue."
    },
    {
        "title": "B-Symptoms Explained: Your Guide to Weight Loss, Fever & Night Sweats",
        "date": "2026-01-17",
        "slug": "b-symptoms-explained",
        "description": "Delve into the specifics of B-symptoms (weight loss, fever, night sweats) and their importance in oncological anamnesis."
    },
    {
        "title": "Traumatology Anamnesis Checklist: Key Questions for Knee and Ankle Injuries",
        "date": "2026-01-16",
        "slug": "traumatology-knee-ankle-checklist",
        "description": "A practical guide for medical students on taking a history after traumatic injury, focusing on knee and ankle trauma."
    },
    {
        "title": "Navigating Neurological Anamnesis: Essential Questions for Migraine, Vertigo & Tinnitus",
        "date": "2026-01-15",
        "slug": "neurological-anamnesis-migraine-vertigo",
        "description": "A step-by-step approach to taking a comprehensive history for common neurological complaints like migraine and dizziness."
    },
    {
        "title": "Spotting Critical Red Flags in Anamnesis: A Survival Guide",
        "date": "2026-01-14",
        "slug": "anamnesis-red-flags-guide",
        "description": "A crucial overview of 'red flags' explicitly mentioned across various medical conditions, explaining their significance."
    },
    {
        "title": "The Ultimate Guide to Pain Anamnesis: Mastering Medical History Taking",
        "date": "2026-01-13",
        "slug": "pain-anamnesis-guide",
        "description": "Learn a structured approach to eliciting a detailed pain history for diverse complaints, including thoracic and abdominal pain."
    },
    {
        "title": "Mastering Oncological Anamnesis: Key Questions for Medical Exams",
        "date": "2026-01-12",
        "slug": "oncological-anamnesis-mastery",
        "description": "A practical guide for medical students on how to systematically take a patient history for oncological cases."
    }
]

def generate_and_save_posts():
    print("🚀 Starting batch generation of missing posts...")
    
    # 1. Fetch Context (once for efficiency)
    print("📚 Fetching Knowledge Base context...")
    kb_context = get_knowledge_base_context()
    if not kb_context:
        print("⚠️ Warning: No Knowledge Base context found!")
        kb_context = "Focus on German medical terminology and standard anamnesis protocols."

    for post in POSTS_TO_GENERATE:
        print(f"\n--------------------------------------------------")
        print(f"✍️ Generating: {post['title']}")
        
        prompt_topic = f"{post['title']} - {post['description']}"
        
        # We need to construct a specific prompt for Gemini to ensure formatting
        # calling generate_blog_post_with_gemini directly might use a default prompt
        # so we will use the logic from regenerate_post.py here
        
        prompt = f"""You are an expert medical writer for FaMED-Vorbereitung.com.
        
        TASK: Write a comprehensive blog post titled "{post['title']}".
        
        CONTEXT FROM KNOWLEDGE BASE (Use as Ground Truth):
        {kb_context[:50000]}  # Limit context size to avoid token issues
        
        SPECIFIC FOCUS:
        {post['description']}
        
        STRUCTURE:
        - Title: {post['title']}
        - Introduction
        - Main Content (Structured with headings)
        - Conclusion
        - Resources Section
        
        REQUIREMENTS:
        - Write in German (High C1 Medical Level)
        - Be strictly factual based on Knowledge Base
        - Format in Markdown
        - **IMPORTANT:** In the YAML frontmatter, the 'date' must be QUOTED strings (e.g., date: "{post['date']}").
        - **IMPORTANT:** Set 'status' to "published" in frontmatter.
        - Approx 1000-1500 words
        - **CRITICAL:** You MUST include a "Resources" or "Call to Action" section at the end with these EXACT links:
            - FaMED Protokoll Book: https://famedtestprep.com/famedprotokolle
            - FaMED App & Simulation: https://famedtestprep.com
            - Telegram Group: https://t.me/+vgtsHuqtwfk4MTJh
        
        Generate the Full Blog Post Now:"""
        
        try:
            import google.generativeai as genai
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)
            content = response.text
            
            # Simple check/fix for frontmatter if Gemini misses it (it happens)
            if 'date: ' in content and '"' not in content.split('date: ')[1].split('\n')[0]:
                 content = content.replace(f'date: {post["date"]}', f'date: "{post["date"]}"')
            
            # Ensure status is published
            if 'status: "draft"' in content:
                content = content.replace('status: "draft"', 'status: "published"')
            
            # Ensure slug matches
            # The prompt doesn't explicitly ask for slug in frontmatter, so we might need to add it or rename file
            filename = f"blog/posts/{post['slug']}.md"
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
                
            print(f"✅ Saved to {filename}")
            
        except Exception as e:
            print(f"❌ Error generating {post['title']}: {e}")

if __name__ == "__main__":
    generate_and_save_posts()
