"""
Smart Topic Research System
- Finds trending topics using Google Trends
- Uses keyword research for FaMED test
- Generates content using book + Knowledge Base (The Brain) as sources
"""
import os
import requests
from pytrends.request import TrendReq
from datetime import datetime, timedelta
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv
from supabase import create_client
import json

load_dotenv()
load_dotenv('../.env.local')  # Try to load from parenet if needed

# Initialize Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-flash-latest')

# Initialize Supabase
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
supabase = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Knowledge Base (Supabase)")
    except Exception as e:
        print(f"⚠️ Failed to connect to Supabase: {e}")

def get_knowledge_base_context():
    """Fetch all knowledge entries from Supabase to use as context"""
    if not supabase:
        return ""
    
    try:
        response = supabase.table('knowledge_base').select('title, content, category').execute()
        entries = response.data
        
        if not entries:
            return ""
            
        context_str = "\n--- KNOWLEDGE BASE (THE BRAIN) ---\n"
        for entry in entries:
            context_str += f"Title: {entry['title']} ({entry['category']})\n"
            context_str += f"Content: {entry['content']}\n\n"
            
        print(f"🧠 Loaded {len(entries)} knowledge entries for context")
        return context_str
        
    except Exception as e:
        print(f"⚠️ Error fetching knowledge base: {e}")
        return ""

def get_trending_famed_topics():
    """Find trending topics related to FaMED using Google Trends"""
    try:
        pytrends = TrendReq(hl='de-DE', tz=60)
        
        # Keywords to track
        keywords = ['FaMED', 'FaMED Test', 'FaMED Prüfung', 'Anamnese FaMED']
        
        # Get interest over time
        pytrends.build_payload(keywords, timeframe='today 3-m', geo='DE')
        interest_df = pytrends.interest_over_time()
        
        # Get related queries
        related_queries = pytrends.related_queries()
        
        hot_topics = []
        
        for keyword in keywords:
            if keyword in related_queries:
                rising = related_queries[keyword]['rising']
                if rising is not None and not rising.empty:
                    for _, row in rising.head(5).iterrows():
                        hot_topics.append({
                            'query': row['query'],
                            'value': row['value'],
                            'source': 'Google Trends'
                        })
        
        print(f"✅ Found {len(hot_topics)} trending topics")
        return hot_topics
        
    except Exception as e:
        print(f"⚠️ Google Trends error: {e}")
        return []

def research_famed_website():
    """Scrape key topics from FaMED official website"""
    try:
        # Common FaMED resources URLs
        urls = [
            'https://www.aerztekammer-bw.de/10aerzte/30laekbw/20fortbildung/famed/',
        ]
        
        topics = []
        for url in urls:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    # Extract key phrases (simplified)
                    content = response.text.lower()
                    
                    key_terms = [
                        'anamnese', 'kommunikation', 'arzt-patient',
                        'körperliche untersuchung', 'differentialdiagnose',
                        'therapie', 'prüfung', 'vorbereitung'
                    ]
                    
                    for term in key_terms:
                        if term in content:
                            topics.append({
                                'query': f'FaMED {term}',
                                'value': 100,
                                'source': 'FaMED Website'
                            })
            except:
                continue
        
        print(f"✅ Found {len(topics)} topics from FaMED website")
        return topics
        
    except Exception as e:
        print(f"⚠️ Website research error: {e}")
        return []

OLLAMA_URL = "http://localhost:11434/api"

def generate_blog_post_with_local_llama(topic, book_context=""):
    """Generate blog post using Local Llama via Ollama"""
    print(f"🦙 Attempting generation with Local Llama...")
    
    # Fetch Knowledge Base Context
    kb_context = get_knowledge_base_context()
    
    prompt = f"""You are writing a blog post for FaMED-Vorbereitung.com, a German medical licensing exam prep site.

TOPIC: {topic}

IMPORTANT SOURCES TO REFERENCE:
1. FaMED Protokoll Book (the user's study guide book)
2. Official FaMED exam guidelines
3. Knowledge Base (attached below)

CONTEXT FROM BOOK:
{book_context if book_context else 'Use general FaMED exam knowledge'}

CONTEXT FROM KNOWLEDGE BASE (high priority):
{kb_context}

REQUIREMENTS:
- Write in German
- Reference the "FaMED Protokoll Book"
- Include practical tips
- Mention communication skills
- Keep it under 1500 words
- Use markdown format
- Include frontmatter with title, date, excerpt, tags, status: "draft"

Generate the complete blog post now:"""

    payload = {
        "model": "llama3:latest",
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(f"{OLLAMA_URL}/generate", json=payload, timeout=300) # 5 min timeout
        if response.status_code == 200:
            return response.json().get('response')
        else:
            print(f"⚠️ Ollama error: {response.text}")
            return None
    except Exception as e:
        print(f"⚠️ Local Llama unavailable: {e}")
        return None

def generate_blog_post_with_gemini(topic, book_context=""):
    """Generate blog post using Gemini with book content as reference"""
    
    # Fetch Knowledge Base Context
    kb_context = get_knowledge_base_context()
    
    prompt = f"""You are writing a blog post for FaMED-Vorbereitung.com, a German medical licensing exam prep site.

TOPIC: {topic}

IMPORTANT SOURCES TO REFERENCE:
1. FaMED Protokoll Book (the user's study guide book)
2. Official FaMED exam guidelines
3. Knowledge Base provided below (Use this as GROUND TRUTH)

CONTEXT FROM BOOK:
{book_context if book_context else 'Use general FaMED exam knowledge'}

CONTEXT FROM KNOWLEDGE BASE (Use this information to ensure accuracy):
{kb_context}

REQUIREMENTS:
- Write in German
- Reference the "FaMED Protokoll Book" when giving advice
- Include practical tips for exam preparation
- Mention communication skills (Anamnese)
- Add a section about the FaMED App
- Keep it under 1500 words
- Use markdown format
- Include frontmatter with:
  * title
  * date
  * excerpt
  * tags
  * status: "draft"

Generate the complete blog post:"""
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return None

def find_and_create_hot_topic():
    """Main function: Find hot topic and create draft blog post"""
    print("🔍 Researching trending FaMED topics...")
    
    # Get topics from multiple sources
    trends = []
    try:
        trends = get_trending_famed_topics()
    except Exception as e:
        print(f"⚠️ Trends API error: {e}")

    website_topics = research_famed_website()
    
    all_topics = trends + website_topics
    
    
    # Ensure we always have something
    if not all_topics:
        print("⚠️ No trends found. Using Evergreen Topics.")
        evergreen_topics = [
            'FaMED Anamnese Struktur', 'FaMED Körperliche Untersuchung Tipps',
            'FaMED Arzt-Patient-Gespräch', 'FaMED Fachbegriffe Liste',
            'FaMED Prüfungsablauf Detail', 'Approbation vs FaMED',
            'FaMED vs FSP Vergleich', 'Häufige FaMED Fälle',
            'FaMED Dokumentation Beispiele', 'FaMED Prüfungsangst',
            'FaMED Vorbereitung Zeitplan', 'FaMED Lernressourcen',
            'FaMED Online Kurs Vorteile', 'FaMED Buch Empfehlung',
            'Deutsche Medizinische Fachsprache', 'FaMED Simulation',
            'FaMED Prüfer Fragen', 'FaMED Bestehensquote',
            'FaMED Anmeldung Schritte', 'FaMED Zeugnis Anerkennung'
        ]
        
        # Pick a random one (pseudo-random based on day of year to vary it)
        import random
        random.seed(datetime.now().day) # Resets daily so it's consistent for debugging, or remove seed for true random
        topic = random.choice(evergreen_topics)
        
        all_topics.append({
            'query': topic,
            'value': 50,
            'source': 'Evergreen Fallback'
        })
    
    # Sort by value (relevance/trend score)
    all_topics.sort(key=lambda x: x['value'], reverse=True)
    
    # Take the hottest topic
    hot_topic = all_topics[0]
    print(f"\n🔥 HOTTEST TOPIC: {hot_topic['query']}")
    print(f"   Score: {hot_topic['value']}")
    print(f"   Source: {hot_topic['source']}")
    
    # Generate blog post
    print("\n✍️ Generating blog post with Gemini...")
    
    book_context = """
    The FaMED Protokoll Book covers:
    - Communication skills and Anamnese techniques
    - Differential diagnosis strategies
    - Physical examination procedures
    - Common exam scenarios and role-plays
    """
    
    # PRIORITY 1: Local Llama (Free, Unlimited)
    blog_content = generate_blog_post_with_local_llama(hot_topic['query'], book_context)
    
    # PRIORITY 2: Gemini API (Fallback)
    if not blog_content:
        print("\n⚠️ Local Llama failed. Falling back to Gemini API...")
        blog_content = generate_blog_post_with_gemini(hot_topic['query'], book_context)
    
    if blog_content:
        # Save to file
        slug = hot_topic['query'].lower().replace(' ', '-').replace('ä', 'ae').replace('ü', 'ue').replace('ö', 'oe')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        
        filename = f"blog/posts/{slug}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(blog_content)
        
        print(f"✅ Created: {filename}")
        return {
            'topic': hot_topic['query'],
            'file': filename,
            'score': hot_topic['value']
        }
    else:
        # FALLBACK: Create Placeholder
        print("⚠️ Gemini failed (likely quota). Creating placeholder...")
        slug = hot_topic['query'].lower().replace(' ', '-').replace('ä', 'ae').replace('ü', 'ue').replace('ö', 'oe')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        
        today = datetime.now().strftime('%Y-%m-%d')
        placeholder_content = f"""---
title: "{hot_topic['query']}"
date: "{today}"
excerpt: "Draft for {hot_topic['query']}. Content generation failed (API Quota). Please edit manually or regenerate."
tags: ["FaMED", "Draft"]
status: "draft"
---
# {hot_topic['query']}

> **⚠️ API LIMIT REACHED**
> The AI could not write this post automatically due to quota limits.
> 
> **Action Required:**
> 1. Edit this post manually
> 2. OR Click 'Regenerate Topic' tomorrow
"""
        filename = f"blog/posts/{slug}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(placeholder_content)
             
        print(f"✅ Created Placeholder: {filename}")
        return {
            'topic': hot_topic['query'],
            'file': filename,
            'score': 0
        }
        
    return None

import argparse
import sys
import json

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate FaMED blog posts')
    parser.add_argument('--topic', type=str, help='Specific topic to generate (skips trend search)')
    parser.add_argument('--json', action='store_true', help='Output result as JSON to stdout')
    parser.add_argument('--no-save', action='store_true', help='Do not save to file (return content only)')
    
    args = parser.parse_args()
    
    if args.json:
        # Redirect stdout to stderr for logs so we can print clean JSON at the end
        # But for now, we will just ensure we only print JSON if successful
        pass
        
    if args.topic:
        # Direct generation mode
        if args.json:
            # Silence prints
            sys.stdout = open(os.devnull, 'w')
            
        book_context = """
        The FaMED Protokoll Book covers:
        - Communication skills and Anamnese techniques
        - Differential diagnosis strategies
        - Physical examination procedures
        - Common exam scenarios and role-plays
        """
        
        # Try generation
        # We need to access the generation functions directly without the trend search wrapper logic if possible
        # Or just adapt the wrapper
        
        # Call generation directly
        blog_content = generate_blog_post_with_local_llama(args.topic, book_context)
        
        if not blog_content:
             blog_content = generate_blog_post_with_gemini(args.topic, book_context)
             
        if args.json:
            # Restore stdout
            sys.stdout = sys.__stdout__
            
            if blog_content:
                result = {
                    "success": True,
                    "topic": args.topic,
                    "content": blog_content
                }
                print(json.dumps(result))
            else:
                 print(json.dumps({"success": False, "error": "Generation failed"}))
        else:
            if blog_content and not args.no_save:
                # Save logic similar to original
                slug = args.topic.lower().replace(' ', '-').replace('ä', 'ae').replace('ü', 'ue').replace('ö', 'oe')
                slug = ''.join(c for c in slug if c.isalnum() or c == '-')
                filename = f"blog/posts/{slug}.md"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(blog_content)
                print(f"✅ Created: {filename}")
            elif blog_content:
                print(blog_content)
            else:
                print("❌ Generation failed")

    else:
        # Original behavior (Trend search)
        result = find_and_create_hot_topic()
        if result:
            print(f"\n🎉 SUCCESS: Created blog about '{result['topic']}'")
