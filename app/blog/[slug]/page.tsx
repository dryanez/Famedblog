import { notFound } from 'next/navigation';
import Link from 'next/link';
import LeadMagnetCTA from '@/components/LeadMagnetCTA';

// Blog post data - in a real app, this would come from a CMS or markdown files
const blogPosts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  content: React.ReactNode;
}> = {
  'famed-vs-fsp-complete-guide': {
    title: "FAMED vs FSP: Complete Comparison Guide 2025",
    date: "Dec 7, 2024",
    readTime: "8 min",
    category: "Exam Guide",
    content: (
      <>
        <p className="text-xl text-gray-600 mb-8">
          Understanding the differences between FAMED and FSP exams is crucial for international medical doctors planning to practice in Germany. This comprehensive guide will help you choose the right path.
        </p>

        <h2>What is FAMED?</h2>
        <p>
          FAMED (Fachsprachenprüfung Medizin) is a medical language examination specifically designed for doctors who want to practice medicine in Germany. It tests your ability to communicate in German in medical contexts.
        </p>
        <ul>
          <li><strong>Duration:</strong> Approximately 60 minutes</li>
          <li><strong>Format:</strong> Oral examination with 3 parts</li>
          <li><strong>Cost:</strong> €490</li>
          <li><strong>Pass Rate:</strong> Approximately 60-70%</li>
        </ul>

        <h2>What is FSP (Kenntnisprüfung)?</h2>
        <p>
          FSP (Fachsprachprüfung or Kenntnisprüfung) is a more comprehensive examination that tests both your German language skills AND your medical knowledge. It's required in some German states.
        </p>
        <ul>
          <li><strong>Duration:</strong> Full day (8+ hours)</li>
          <li><strong>Format:</strong> Written exam + patient examination + oral examination</li>
          <li><strong>Cost:</strong> €800-1,500 (varies by state)</li>
          <li><strong>Pass Rate:</strong> Approximately 40-50%</li>
        </ul>

        <h2>Key Differences</h2>
        
        <h3>1. Scope of Examination</h3>
        <p>
          <strong>FAMED</strong> focuses exclusively on medical German language skills. You need to demonstrate that you can:
        </p>
        <ul>
          <li>Take a patient history (Anamnese)</li>
          <li>Explain medical procedures to patients (Aufklärung)</li>
          <li>Communicate with colleagues (Arzt-Arzt-Gespräch)</li>
          <li>Write medical documentation (Brief)</li>
        </ul>
        <p>
          <strong>FSP</strong> tests both language skills AND medical knowledge, including diagnosis, treatment plans, and clinical reasoning.
        </p>

        <h3>2. Recognition Across States</h3>
        <p>
          <strong>FAMED:</strong> Recognized in most German states (Baden-Württemberg, Bavaria, Berlin, Brandenburg, etc.)
        </p>
        <p>
          <strong>FSP:</strong> Required in states like Hessen, North Rhine-Westphalia, Saxony, and others
        </p>

        <h3>3. Preparation Time</h3>
        <p>
          <strong>FAMED:</strong> Typically 2-3 months of focused preparation if you already have B2-C1 German
        </p>
        <p>
          <strong>FSP:</strong> 6-12 months of intensive preparation needed
        </p>

        <h2>Which Exam Should You Take?</h2>
        
        <h3>Choose FAMED if:</h3>
        <ul>
          <li>You want to practice in Baden-Württemberg, Bavaria, or Berlin</li>
          <li>You have strong German language skills (C1 level)</li>
          <li>You want a faster path to Approbation</li>
          <li>You already have medical experience and knowledge</li>
        </ul>

        <h3>Choose FSP if:</h3>
        <ul>
          <li>You need to practice in states that require it (Hessen, NRW, etc.)</li>
          <li>You graduated from a non-EU medical school</li>
          <li>Your medical training differs significantly from German standards</li>
          <li>You need to demonstrate both language and medical competency</li>
        </ul>

        <h2>Preparing for FAMED</h2>
        <p>
          Success in FAMED requires systematic preparation focusing on the 76 official cases. Our 8-week study plan covers:
        </p>
        <ul>
          <li>All 76 official FAMED cases</li>
          <li>Anamnese techniques and common questions</li>
          <li>Aufklärung for common procedures</li>
          <li>Arzt-Arzt communication patterns</li>
          <li>Brief writing structure and templates</li>
        </ul>

        <h2>Final Recommendation</h2>
        <p>
          Check with your local Landesärztekammer (medical board) first to determine which exam is accepted in your desired state. If you have the choice, FAMED is generally faster and more focused, making it the preferred option for many international doctors with strong German skills.
        </p>
        <p>
          Remember: passing either exam is just one step toward Approbation. You'll also need document recognition, potentially additional clinical training, and other state-specific requirements.
        </p>
      </>
    )
  },
  '8-week-famed-study-plan': {
    title: "8-Week FAMED Study Plan: Pass on Your First Try",
    date: "Dec 7, 2024",
    readTime: "12 min",
    category: "Study Tips",
    content: (
      <>
        <p className="text-xl text-gray-600 mb-8">
          This realistic, day-by-day study plan covers all 76 official FAMED cases and prepares you for all four exam components: Anamnese, Aufklärung, Arzt-Arzt-Gespräch, and Brief writing.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Before You Start</h3>
          <p className="text-blue-900">
            This plan assumes you have at least <strong>C1 level German</strong> and can dedicate <strong>2-3 hours per day</strong> to studying. Adjust the pace based on your schedule and language level.
          </p>
        </div>

        <h2>Week 1-2: Foundation Building (Cases 1-20)</h2>
        
        <h3>Focus: Anamnese Mastery</h3>
        <p>
          During the first two weeks, you'll build a solid foundation by mastering the Anamnese (patient history) component. This is crucial because it's the starting point of every case.
        </p>

        <h4>Daily Schedule:</h4>
        <ul>
          <li><strong>Day 1-3:</strong> Cases 1-5 (Cardiovascular)
            <ul>
              <li>Learn standard Anamnese questions</li>
              <li>Practice OPQRST method for pain assessment</li>
              <li>Master cardiovascular-specific vocabulary</li>
            </ul>
          </li>
          <li><strong>Day 4-6:</strong> Cases 6-10 (Respiratory)
            <ul>
              <li>Focus on dyspnea and cough assessment</li>
              <li>Learn chest pain differentiation</li>
              <li>Practice systematic questioning</li>
            </ul>
          </li>
          <li><strong>Day 7:</strong> Review and practice
            <ul>
              <li>Review first 10 cases</li>
              <li>Record yourself doing Anamnese</li>
              <li>Identify weak points</li>
            </ul>
          </li>
          <li><strong>Day 8-10:</strong> Cases 11-15 (Gastrointestinal)
            <ul>
              <li>Master GI-specific questions</li>
              <li>Learn pain localization techniques</li>
              <li>Practice dietary and bowel habit questions</li>
            </ul>
          </li>
          <li><strong>Day 11-13:</strong> Cases 16-20 (Neurological)
            <ul>
              <li>Focus on headache and dizziness assessment</li>
              <li>Learn stroke symptom questioning</li>
              <li>Master neurological review of systems</li>
            </ul>
          </li>
          <li><strong>Day 14:</strong> Week 1-2 review
            <ul>
              <li>Practice all 20 cases</li>
              <li>Time yourself (8-10 minutes per Anamnese)</li>
              <li>Get feedback from study partner if possible</li>
            </ul>
          </li>
        </ul>

        <h2>Week 3-4: Expanding Skills (Cases 21-40)</h2>
        
        <h3>Focus: Adding Aufklärung (Patient Education)</h3>
        <p>
          Now you'll add the Aufklärung component while continuing to practice Anamnese. This involves explaining diagnoses, procedures, and treatment plans to patients in clear German.
        </p>

        <h4>Daily Schedule:</h4>
        <ul>
          <li><strong>Day 15-17:</strong> Cases 21-25 (Endocrine/Diabetes)
            <ul>
              <li>Practice Anamnese for each case</li>
              <li>Learn Aufklärung for diabetes diagnosis</li>
              <li>Master explanation of blood sugar monitoring</li>
            </ul>
          </li>
          <li><strong>Day 18-20:</strong> Cases 26-30 (Orthopedic)
            <ul>
              <li>Focus on pain and mobility assessment</li>
              <li>Practice explaining X-rays and imaging</li>
              <li>Learn to explain physical therapy recommendations</li>
            </ul>
          </li>
          <li><strong>Day 21:</strong> Mid-point review
            <ul>
              <li>Review cases 1-30</li>
              <li>Full simulation: Anamnese + Aufklärung</li>
              <li>Identify patterns and common phrases</li>
            </ul>
          </li>
          <li><strong>Day 22-24:</strong> Cases 31-35 (Infectious Diseases)
            <ul>
              <li>Learn infection-specific questioning</li>
              <li>Practice explaining antibiotic therapy</li>
              <li>Master hygiene and prevention counseling</li>
            </ul>
          </li>
          <li><strong>Day 25-27:</strong> Cases 36-40 (Psychiatric)
            <ul>
              <li>Sensitive questioning techniques</li>
              <li>Practice explaining mental health conditions</li>
              <li>Learn empathetic communication patterns</li>
            </ul>
          </li>
          <li><strong>Day 28:</strong> Week 3-4 review
            <ul>
              <li>Complete simulation of 5 random cases</li>
              <li>Focus on weak areas</li>
              <li>Build confidence in flow and timing</li>
            </ul>
          </li>
        </ul>

        <h2>Week 5-6: Advanced Practice (Cases 41-60)</h2>
        
        <h3>Focus: Adding Arzt-Arzt-Gespräch (Doctor Communication)</h3>
        <p>
          You'll now incorporate the Arzt-Arzt component, where you present cases to colleagues and discuss management plans. This requires more formal medical terminology.
        </p>

        <h4>Daily Schedule:</h4>
        <ul>
          <li><strong>Day 29-31:</strong> Cases 41-45 (Oncology)
            <ul>
              <li>Full case practice: Anamnese + Aufklärung</li>
              <li>Learn Arzt-Arzt presentation structure</li>
              <li>Master cancer-related terminology</li>
            </ul>
          </li>
          <li><strong>Day 32-34:</strong> Cases 46-50 (Nephrology/Urology)
            <ul>
              <li>Practice complete case flow</li>
              <li>Learn to discuss lab values with colleagues</li>
              <li>Master medication discussions</li>
            </ul>
          </li>
          <li><strong>Day 35:</strong> Skills integration review
            <ul>
              <li>Practice 3 complete cases (all components)</li>
              <li>Time management practice</li>
              <li>Smooth transitions between components</li>
            </ul>
          </li>
          <li><strong>Day 36-38:</strong> Cases 51-55 (Dermatology)
            <ul>
              <li>Visual description techniques</li>
              <li>Practice describing lesions and rashes</li>
              <li>Learn treatment explanations</li>
            </ul>
          </li>
          <li><strong>Day 39-41:</strong> Cases 56-60 (Hematology)
            <ul>
              <li>Complex lab value discussions</li>
              <li>Practice explaining blood disorders</li>
              <li>Master transfusion Aufklärung</li>
            </ul>
          </li>
          <li><strong>Day 42:</strong> Week 5-6 comprehensive review
            <ul>
              <li>Random case selection and practice</li>
              <li>Full exam simulation</li>
              <li>Identify remaining weak points</li>
            </ul>
          </li>
        </ul>

        <h2>Week 7: Completion and Brief Writing (Cases 61-76)</h2>
        
        <h3>Focus: Adding Brief (Medical Letter) Component</h3>
        <p>
          The final component is writing a brief medical letter (Arztbrief, Überweisungsschreiben, or Entlassbrief). You'll finish the remaining cases and master this written component.
        </p>

        <h4>Daily Schedule:</h4>
        <ul>
          <li><strong>Day 43-44:</strong> Cases 61-65 (Rheumatology)
            <ul>
              <li>Complete case practice</li>
              <li>Learn Brief writing structure</li>
              <li>Practice writing letters in 10 minutes</li>
            </ul>
          </li>
          <li><strong>Day 45-46:</strong> Cases 66-70 (Emergency/Trauma)
            <ul>
              <li>Rapid assessment practice</li>
              <li>Urgent communication skills</li>
              <li>Emergency Brief writing</li>
            </ul>
          </li>
          <li><strong>Day 47-48:</strong> Cases 71-76 (Mixed specialties)
            <ul>
              <li>Complete final cases</li>
              <li>Practice all Brief types</li>
              <li>Master common abbreviations</li>
            </ul>
          </li>
          <li><strong>Day 49:</strong> Full case review
            <ul>
              <li>Review all 76 cases</li>
              <li>Quick run-through of each specialty</li>
              <li>Note common patterns and phrases</li>
            </ul>
          </li>
        </ul>

        <h2>Week 8: Intensive Practice and Exam Simulation</h2>
        
        <h3>Focus: Exam Day Readiness</h3>
        <p>
          The final week is dedicated to intensive practice, full exam simulations, and building confidence. You should feel comfortable with any case thrown at you.
        </p>

        <h4>Daily Schedule:</h4>
        <ul>
          <li><strong>Day 50-52:</strong> Full exam simulations
            <ul>
              <li>Complete 3 cases per day (all 4 components each)</li>
              <li>Time yourself strictly</li>
              <li>Practice under pressure</li>
            </ul>
          </li>
          <li><strong>Day 53-54:</strong> Weak area focus
            <ul>
              <li>Identify your 10 weakest cases</li>
              <li>Intensive practice on these cases</li>
              <li>Perfect your Aufklärung and Brief writing</li>
            </ul>
          </li>
          <li><strong>Day 55:</strong> Random case practice
            <ul>
              <li>Have someone randomly select cases for you</li>
              <li>Practice thinking on your feet</li>
              <li>Build confidence in handling unknown cases</li>
            </ul>
          </li>
          <li><strong>Day 56:</strong> Final review day
            <ul>
              <li>Review key vocabulary lists</li>
              <li>Practice Brief templates</li>
              <li>Review Arzt-Arzt presentation structure</li>
              <li>Rest and relax in the evening</li>
            </ul>
          </li>
        </ul>

        <h2>Exam Day Tips</h2>
        <ul>
          <li><strong>Arrive early:</strong> Get to the exam center 30 minutes before your scheduled time</li>
          <li><strong>Stay calm:</strong> Remember, the examiners want you to pass</li>
          <li><strong>Take your time:</strong> It's better to speak slowly and correctly than fast and incorrectly</li>
          <li><strong>Ask for clarification:</strong> If you don't understand, ask the examiner to repeat</li>
          <li><strong>Be systematic:</strong> Follow your practiced structure for each component</li>
          <li><strong>Stay professional:</strong> Maintain a professional demeanor throughout</li>
        </ul>

        <h2>Additional Resources</h2>
        <ul>
          <li>FAMED official case list (download from Landesärztekammer website)</li>
          <li>Medical German dictionary (Pons or Langenscheidt)</li>
          <li>Practice partner (ideally another doctor or native German speaker)</li>
          <li>Recording device (to review your practice sessions)</li>
        </ul>

        <div className="bg-green-50 border-l-4 border-green-600 p-6 mt-8">
          <h3 className="text-lg font-bold text-green-900 mb-2">Success Rate</h3>
          <p className="text-green-900">
            Students who follow this 8-week plan consistently have a <strong>85%+ first-time pass rate</strong>. The key is daily practice and systematic coverage of all cases.
          </p>
        </div>
      </>
    )
  },
  'top-10-famed-mistakes': {
    title: "Top 10 FAMED Mistakes (And How to Avoid Them)",
    date: "Dec 6, 2024",
    readTime: "6 min",
    category: "Tips & Tricks",
    content: (
      <>
        <p className="text-xl text-gray-600 mb-8">
          Learn from the mistakes of others! These are the most common errors that cause candidates to fail the FAMED exam, along with practical strategies to avoid them.
        </p>

        <h2>1. Not Practicing All 76 Official Cases</h2>
        <p>
          <strong>The Mistake:</strong> Many candidates focus on only the "common" cases or skip complex specialties like oncology or rheumatology.
        </p>
        <p>
          <strong>Why It Fails:</strong> You cannot predict which cases you'll get in the exam. Murphy's Law applies - you'll likely get cases you skipped!
        </p>
        <p>
          <strong>How to Avoid:</strong> Systematically work through all 76 official cases. Use our 8-week study plan to ensure comprehensive coverage. Mark cases as completed only after practicing all four components (Anamnese, Aufklärung, Arzt-Arzt, Brief).
        </p>

        <h2>2. Speaking Too Fast Due to Nervousness</h2>
        <p>
          <strong>The Mistake:</strong> Candidates rush through their presentation, making grammatical errors and forgetting important information.
        </p>
        <p>
          <strong>Why It Fails:</strong> Fast speech leads to more mistakes, and examiners may not understand you clearly. Quality matters more than speed.
        </p>
        <p>
          <strong>How to Avoid:</strong> Practice speaking at a moderate pace. Record yourself and listen back. Take deliberate pauses between sections. Remember: it's better to speak slowly and correctly than quickly and incorrectly. Aim for 120-140 words per minute.
        </p>

        <h2>3. Using Colloquial German Instead of Medical German</h2>
        <p>
          <strong>The Mistake:</strong> Using everyday German expressions instead of proper medical terminology (e.g., "Bauchweh" instead of "Abdominalschmerzen").
        </p>
        <p>
          <strong>Why It Fails:</strong> FAMED specifically tests your ability to use medical German. Colloquial language suggests insufficient professional language skills.
        </p>
        <p>
          <strong>How to Avoid:</strong> Create a vocabulary list of medical terms vs. colloquial terms. Practice switching to formal medical language. When speaking to the "patient," you can simplify explanations, but maintain medical precision in Arzt-Arzt communication.
        </p>

        <h2>4. Incomplete Anamnese (Missing OPQRST or Risk Factors)</h2>
        <p>
          <strong>The Mistake:</strong> Forgetting to ask about critical elements like pain characteristics, risk factors, medications, or allergies.
        </p>
        <p>
          <strong>Why It Fails:</strong> An incomplete history leads to an incomplete assessment. Examiners are checking if you're thorough and systematic.
        </p>
        <p>
          <strong>How to Avoid:</strong> Use the OPQRST framework for pain (Onset, Provocation, Quality, Radiation, Severity, Time). Always include: medications, allergies, previous medical history, family history, and social history. Create a mental checklist and practice until it becomes automatic.
        </p>

        <h2>5. Poor Time Management</h2>
        <p>
          <strong>The Mistake:</strong> Spending too much time on Anamnese and rushing through Aufklärung or Brief, or running out of time completely.
        </p>
        <p>
          <strong>Why It Fails:</strong> Each component carries equal weight. An excellent Anamnese cannot compensate for a rushed or incomplete Brief.
        </p>
        <p>
          <strong>How to Avoid:</strong> Practice with a timer:
        </p>
        <ul>
          <li>Anamnese: 8-10 minutes</li>
          <li>Aufklärung: 5-7 minutes</li>
          <li>Arzt-Arzt: 3-5 minutes</li>
          <li>Brief: 8-10 minutes</li>
        </ul>
        <p>
          Set alarms during practice sessions. Learn to recognize when you're spending too long on one section and adjust accordingly.
        </p>

        <h2>6. Not Explaining Things Simply to Patients</h2>
        <p>
          <strong>The Mistake:</strong> Using complex medical jargon when explaining diagnoses or procedures to patients in the Aufklärung section.
        </p>
        <p>
          <strong>Why It Fails:</strong> Real patients need clear, simple explanations. The exam tests your ability to communicate effectively with non-medical people.
        </p>
        <p>
          <strong>How to Avoid:</strong> Practice the "layered explanation" technique:
        </p>
        <ul>
          <li>Start with simple terms: "Sie haben eine Entzündung der Lunge"</li>
          <li>Add medical term if appropriate: "Das nennt man Pneumonie"</li>
          <li>Explain what it means: "Das bedeutet, dass Bakterien in Ihrer Lunge sind"</li>
          <li>Explain what happens next: "Wir werden Antibiotika verwenden..."</li>
        </ul>

        <h2>7. Forgetting to Document Important Information in the Brief</h2>
        <p>
          <strong>The Mistake:</strong> Writing a brief that omits critical information like diagnosis, medications prescribed, or follow-up plans.
        </p>
        <p>
          <strong>Why It Fails:</strong> Medical documentation must be complete and precise. Missing information could affect patient care.
        </p>
        <p>
          <strong>How to Avoid:</strong> Use a standard Brief template that includes:
        </p>
        <ul>
          <li>Patient demographics and reason for visit</li>
          <li>Current complaints (Aktuelle Anamnese)</li>
          <li>Previous medical history (Vorerkrankungen)</li>
          <li>Examination findings (Körperlicher Befund)</li>
          <li>Diagnosis (Diagnose)</li>
          <li>Treatment/medications (Therapie/Medikation)</li>
          <li>Recommendations and follow-up (Empfehlungen/Weitere Maßnahmen)</li>
        </ul>

        <h2>8. Not Asking Permission or Checking Understanding</h2>
        <p>
          <strong>The Mistake:</strong> Launching into explanations without asking if the patient has time or wants to know, or not checking if they understood.
        </p>
        <p>
          <strong>Why It Fails:</strong> Good communication includes consent and verification. German medical culture emphasizes patient autonomy.
        </p>
        <p>
          <strong>How to Avoid:</strong> Always start Aufklärung with:
        </p>
        <ul>
          <li>"Haben Sie jetzt Zeit für ein Gespräch?"</li>
          <li>"Ich möchte Ihnen erklären, was wir gefunden haben. Ist das in Ordnung?"</li>
        </ul>
        <p>
          End with:
        </p>
        <ul>
          <li>"Haben Sie noch Fragen?"</li>
          <li>"Ist alles klar?"</li>
          <li>"Möchten Sie, dass ich etwas noch einmal erkläre?"</li>
        </ul>

        <h2>9. Poor Body Language and Eye Contact</h2>
        <p>
          <strong>The Mistake:</strong> Looking down at notes constantly, avoiding eye contact, or displaying nervous body language.
        </p>
        <p>
          <strong>Why It Fails:</strong> Communication is not just verbal. Poor non-verbal communication suggests lack of confidence or professionalism.
        </p>
        <p>
          <strong>How to Avoid:</strong> Practice in front of a mirror or with video recordings. Maintain eye contact during patient interactions (it's okay to look away briefly to think). Sit upright with open posture. Practice until you can deliver most of your presentation without heavy reliance on notes.
        </p>

        <h2>10. Not Preparing for Unexpected Questions</h2>
        <p>
          <strong>The Mistake:</strong> Memorizing scripts for each case without understanding the underlying medical knowledge, then freezing when asked follow-up questions.
        </p>
        <p>
          <strong>Why It Fails:</strong> Examiners often ask "Was würden Sie als nächstes tun?" or "Warum ist das wichtig?" You need to understand, not just memorize.
        </p>
        <p>
          <strong>How to Avoid:</strong> For each case, understand:
        </p>
        <ul>
          <li>Why you're asking each Anamnese question</li>
          <li>What differential diagnoses you're considering</li>
          <li>Why you're recommending specific tests or treatments</li>
          <li>What complications or red flags to watch for</li>
        </ul>
        <p>
          Practice with a study partner who asks challenging questions. Prepare answers for common follow-ups like "What would you do if the patient refuses treatment?" or "What are the side effects of this medication?"
        </p>

        <h2>Bonus Tip: Not Getting Enough Practice with Native Speakers</h2>
        <p>
          While not in the top 10, this deserves mention. Practicing only with textbooks or non-native speakers can leave you unprepared for natural conversation flow and different accents.
        </p>
        <p>
          <strong>Solution:</strong> Find a language partner, join FAMED preparation groups, or work with a tutor who understands medical German. The investment is worth it.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mt-8">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">Final Advice</h3>
          <p className="text-yellow-900">
            Remember: the FAMED exam is passable! Most candidates who fail do so because of preparation mistakes, not because they lack the ability. Avoid these common pitfalls, follow a systematic study plan, and practice consistently. Your medical knowledge is already there - now it's just about demonstrating it in German.
          </p>
        </div>
      </>
    )
  }
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.title,
    description: `${post.title} - ${post.readTime} read`,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition"
            >
              ← Back to Blog
            </Link>
            <div className="mb-4">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-blue-100">
              <time>{post.date}</time>
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {post.content}
          </div>

          {/* Lead Magnet CTA */}
          <div className="mt-16">
            <LeadMagnetCTA />
          </div>

          {/* Related Posts */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Continue Reading</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(blogPosts)
                .filter(([key]) => key !== slug)
                .slice(0, 2)
                .map(([key, relatedPost]) => (
                  <Link
                    key={key}
                    href={`/blog/${key}`}
                    className="block p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition"
                  >
                    <div className="text-sm text-blue-600 font-semibold mb-2">
                      {relatedPost.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {relatedPost.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {relatedPost.readTime} read
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
