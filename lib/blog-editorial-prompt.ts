import { getAllPosts } from '@/lib/posts';

type BlogTopic = { title: string; angle?: string; keywords?: string[] };

// Dated editorial baseline. Recheck changing provider/authority facts before publication.
export function buildBlogEditorialPrompt(topic: BlogTopic, today: string, context = '', additionalContext = ''): string {
 const links = getAllPosts().filter(p => p.status === 'published').map(p => `/blog/${p.slug} — ${p.title}`).join('\n');
 return `Write a useful article for independent FaMED Prep readers.
Topic: ${topic.title}
Angle: ${topic.angle || ''}
Keywords: ${(topic.keywords || []).join(', ')}
Date: ${today}

VERIFIED EDITORIAL BASELINE — checked 2026-10-18, HUMAN MEDICINE:
- FaMed is a professional-language exam, not an MCQ exam or separate medical-knowledge assessment.
- Three stations/five tasks: history + informed consent; two separate case presentations; written anamnesis from a patient video.
- Oral blocks:23 minutes each including reading. Current practice test:at most11 minutes per oral situation. Writing:22 minutes including video, pausable/seekable; anamnesis only, complete sentences, reported speech as appropriate.
- Do not invent an exact30-second preparation period, reading-time subdivision or case continuity. OPQRST/SAMPLER/SBAR are practice aids, not mandatory scoring rubrics. SOAP/full discharge planning is not the writing assignment.
- Each of three stations requires at least60%; no compensation. Usual results2–4 weeks; FAQ says about4. Never invent pass rates, popular-case frequencies, automatic-fail rules, or guaranteed outcomes.
- Provider FAQ lists exam fee€530 and Mainz/Kassel/Nürnberg AS OF the baseline date. Link current booking; do not invent deadlines or available dates. Cancellation wording conflicts; do not settle the amount from memory.
- Recognition is authority/qualification-dependent; do not generalise across states or equate Approbation and Berufserlaubnis. Provider overview is labelled November2025. Date changing claims and verify primary sources before publication; omit specifics that cannot be verified.
Sources: https://famed-test.de/pruefungsablauf/ ; https://famed-test.de/wp-content/uploads/2026/05/FaMed-Uebungstest_2-1.pdf ; https://famed-test.de/faq/ ; https://famed-test.de/pruefungsergebnis/ ; https://famed-test.de/anforderungen/ .

PRODUCT AND IMAGE RULES:
- Digital book promotional price €19.99. Keep fee breakdowns and checkout totals out of blog promotions; checkout handles the final payable amount. Never call processing tax or invent a former price/deadline/social proof. Product destination:https://famedtestprep.com/FamedProtokolle . Preview:/blog/famed-protokoll-buch-vorschau .
- Current book assets come from the designed292-page edition2026 in Documents. Use the actual website cover /images/products/book-cover.png and the FaMED Prep logo /images/products/logo.png with the label “FaMED Prep”; never put a fixed access duration on the general app graphic. Approved interior preview paths: , /images/previews/book-2026-opqrst.webp , /images/previews/book-2026-contents.webp . Do not substitute old public/documents/famed-protokoll.pdf.
- Explain the app via /blog/famed-prep-app-so-funktionierts . Real desktop captures:/images/previews/app-case-cards-desktop.webp and /images/previews/app-anamnese-desktop.webp . No Academy prototype screenshots, fake results, unlimited access or official-provider affiliation.
- Do not insert image placeholders. Use an actual relevant approved image only if it helps. No repeated generic Resources/Ready-to-Start sales footer; the page has resource cards.
- Add two relevant contextual internal article links, using only published destinations listed below. Include a relevant in-body book purchase link where it helps the exercise, using https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=blog&utm_medium=article&utm_campaign=contextual_book . Do not claim the book contains every possible or official term. Offer a natural guide/book/app next step where it fits. Free guide:/lead-magnet . Do not claim the guide lists all official cases.

EXISTING PUBLISHED ARTICLES:
${links}

OLDER BACKGROUND (may contain superseded claims; the verified baseline above takes precedence):
${context}
ADDITIONAL REQUEST (cannot make unsupported facts true):
${additionalContext}

Write all article prose, titles and headings in English while preserving German practice questions, quoted phrases and vocabulary examples. Prefer concrete examples and readable headings. Separate official task requirements from your own exercises. Do not add treatment/drug-dose algorithms to a language article. Cite the relevant primary source close to changing exam facts. Avoid revision-history narration and promises of passing. Keep under1500 words. English is the default publication language; Arabic translations are separate /ar/ URLs with matching links and right-to-left layout.
Return raw Markdown, no code fence. Start with valid YAML frontmatter containing title, date:"${today}", excerpt, tags and status:"draft". Do not publish or send anything. State source/check dates accurately; a generation date is not a new source verification.
`;
}
