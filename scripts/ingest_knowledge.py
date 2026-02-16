
import os
import glob
from supabase import create_client
from dotenv import load_dotenv
import pypdf

# Load env vars
print(f"Current working directory: {os.getcwd()}")
env_path = os.path.join(os.getcwd(), '.env')
env_local_path = os.path.join(os.getcwd(), '.env.local')

env_blog_local_path = os.path.join(os.getcwd(), 'blog_website/.env.local')

print(f"Loading .env from: {env_path} (Exists: {os.path.exists(env_path)})")
load_dotenv(env_path)

print(f"Loading .env.local from: {env_local_path} (Exists: {os.path.exists(env_local_path)})")
load_dotenv(env_local_path)

print(f"Loading blog_website/.env.local from: {env_blog_local_path} (Exists: {os.path.exists(env_blog_local_path)})")
load_dotenv(env_blog_local_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

print(f"SUPABASE_URL found: {bool(SUPABASE_URL)}")
print(f"SUPABASE_KEY found: {bool(SUPABASE_KEY)}")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Supabase credentials not found.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_knowledge(title, content, category, source_url=None):
    print(f"Uploading: {title}...")
    try:
        data = {
            "title": title,
            "content": content,
            "category": category,
            "source_url": source_url
        }
        supabase.table('knowledge_base').insert(data).execute()
        print("✅ Success!")
    except Exception as e:
        print(f"❌ Failed: {e}")

def ingest_pdfs():
    print("\n--- Ingesting PDFs from scripts/Memoria ---")
    pdf_files = glob.glob("scripts/Memoria/*.pdf")
    
    for pdf_path in pdf_files:
        try:
            filename = os.path.basename(pdf_path)
            print(f"Processing {filename}...")
            
            reader = pypdf.PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n\n"
            
            if text.strip():
                upload_knowledge(
                    title=filename,
                    content=text,
                    category="Memoria (Study Guide)"
                )
            else:
                print(f"⚠️ Warning: No text extracted from {filename}")
                
        except Exception as e:
            print(f"❌ Error processing {pdf_path}: {e}")

def ingest_website_content():
    print("\n--- Ingesting Website Content ---")
    
    # Content scraped from famed-test.de
    website_text = """
    ## FaMed – Ihre Fachsprachenprüfung Medizin und Zahnmedizin
    Sie sind Ärztin oder Arzt aus dem Ausland und möchten in Deutschland arbeiten?
    Die FaMed ist der schnellste Weg, um die benötigten Fachsprachenkenntnisse nachzuweisen, für Ärztinnen und Ärzte aus allen Ländern (EU- und Drittstaaten).
    Die Anforderungen an die Fachsprachenprüfung sind überall gleich. Alle Prüfungen richten sich nach den Vorgaben der 87. Gesundheitsministerkonferenz.
    Bei uns können Sie sich bereits zur Prüfung anmelden bevor Sie Ihren Antrag auf Approbation bzw. Berufserlaubnis gestellt haben.

    ## ANERKENNUNG
    Humanmedizin: Grundsätzliche Anerkennung der FaMed
    Zahnmedizin: Grundsätzliche Anerkennung der FaMed
    Rheinland-Pfalz: Ab 01.08.2024 anerkannt (Human- und Zahnmedizin).
    Baden-Württemberg: Akzeptiert FaMed Zertifikate aus anderen Bundesländern im Anerkennungsverfahren.

    ## AKTUELLES
    Nächste FaMed Sprechstunde: Dienstag, 03. März 2026, 16:00 Uhr
    Infoveranstaltung FaMed Zahnmedizin: Donnerstag, 19. März 2026, 16:00 Uhr

    ## PREISE & STORNO
    - Prüfungsgebühr: 530,- EURO
    - Stornierung bis 6 Wochen vor Termin: Kostenlos (abzüglich Transaktionsgebühren).
    - Stornierung bis 14 Tage vor Termin: 265 Euro Bearbeitungsgebühr.
    - Stornierung unter 14 Tage / Nichterscheinen: Gebühr verfällt komplett.
    - Absagen sind bis 14 Tage vorher möglich (245 Euro Gebühr).

    ## ABLAUF
    1. Freien Termin finden
    2. Registrieren
    3. Gebühr bezahlen
    4. Prüfung ablegen
    5. Ergebnis erhalten (ca. 4 Wochen später)
    6. Digitales Zertifikat erhalten

    ## SPRACHNIVEAU C1
    Sie müssen spontan und fließend sprechen, flexibel reagieren und komplizierte Sachverhalte erklären können.
    """
    
    upload_knowledge(
        title="FaMED Test Guide (Official Website)",
        content=website_text,
        category="Exam Facts",
        source_url="https://famed-test.de"
    )

if __name__ == "__main__":
    ingest_pdfs()
    ingest_website_content()
