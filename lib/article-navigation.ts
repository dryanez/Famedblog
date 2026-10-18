export function headingId(text: string): string { return text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-'); }
export function nodeText(node: any): string { return node?.type==='text' ? String(node.value||'') : Array.isArray(node?.children) ? node.children.map(nodeText).join('') : ''; }
export const relatedSlugs: Record<string,string[]> = {
  "8-week-famed-study-plan": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "famed-vorbereitung-berufstaetig-6-wochen"
  ],
  "akutes-abdomen-famed-chirurgie": [
    "pain-anamnesis-guide",
    "differentialdiagnose-formulieren-deutsch"
  ],
  "anamnese-overview-part-1": [
    "pain-anamnesis-guide",
    "medizinische-fachbegriffe-laiensprache-tabelle"
  ],
  "anamnese-sore-throat-fatigue": [
    "b-symptoms-explained",
    "anamnese-overview-part-1"
  ],
  "anamnesis-red-flags-guide": [
    "red-flags-anamnese-famed",
    "anamnese-overview-part-1"
  ],
  "b-symptoms-explained": [
    "oncological-anamnesis-mastery",
    "anamnese-sore-throat-fatigue"
  ],
  "deutsche-patientensprache-redewendungen": [
    "medizinische-fachbegriffe-laiensprache-tabelle",
    "anamnese-overview-part-1"
  ],
  "differentialdiagnose-formulieren-deutsch": [
    "sbar-schema-arzt-arzt-gespraech",
    "akutes-abdomen-famed-chirurgie"
  ],
  "digital-famed-pruefungszentrum-guide": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "8-week-famed-study-plan"
  ],
  "famed-anerkennung-bundeslaender-2026": [
    "famed-vs-kenntnispruefung-kp",
    "famed-vorbereitung-30-minuten-lernroutine"
  ],
  "famed-arztbrief-soap-schema": [
    "sbar-schema-arzt-arzt-gespraech",
    "medizinische-fachbegriffe-laiensprache-tabelle"
  ],
  "famed-aufklaerungsgespraech-guide": [
    "medizinische-fachbegriffe-laiensprache-tabelle",
    "deutsche-patientensprache-redewendungen"
  ],
  "famed-fsp-durchgefallen-was-tun": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "top-10-famed-mistakes"
  ],
  "famed-kosten-termine-statistik-2026": [
    "famed-anerkennung-bundeslaender-2026",
    "famed-vorbereitung-berufstaetig-6-wochen"
  ],
  "famed-vorbereitung-30-minuten-lernroutine": [
    "anamnese-overview-part-1",
    "famed-vorbereitung-berufstaetig-6-wochen"
  ],
  "famed-vorbereitung-berufstaetig-6-wochen": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "8-week-famed-study-plan"
  ],
  "famed-vs-fsp-complete-guide": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "anamnese-overview-part-1"
  ],
  "famed-vs-kenntnispruefung-kp": [
    "famed-vs-fsp-complete-guide",
    "famed-vorbereitung-30-minuten-lernroutine"
  ],
  "kardiologie-faelle-famed-protokolle": [
    "pain-anamnesis-guide",
    "sbar-schema-arzt-arzt-gespraech"
  ],
  "medizinische-fachbegriffe-laiensprache-tabelle": [
    "deutsche-patientensprache-redewendungen",
    "famed-aufklaerungsgespraech-guide"
  ],
  "neurological-anamnesis-migraine-vertigo": [
    "pain-anamnesis-guide",
    "anamnesis-red-flags-guide"
  ],
  "oncological-anamnesis-mastery": [
    "b-symptoms-explained",
    "medizinische-fachbegriffe-laiensprache-tabelle"
  ],
  "pain-anamnesis-guide": [
    "anamnese-overview-part-1",
    "kardiologie-faelle-famed-protokolle"
  ],
  "red-flags-anamnese-famed": [
    "anamnesis-red-flags-guide",
    "akutes-abdomen-famed-chirurgie"
  ],
  "sbar-schema-arzt-arzt-gespraech": [
    "differentialdiagnose-formulieren-deutsch",
    "famed-arztbrief-soap-schema"
  ],
  "top-10-famed-mistakes": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "anamnese-overview-part-1"
  ],
  "traumatology-knee-ankle-checklist": [
    "pain-anamnesis-guide",
    "sbar-schema-arzt-arzt-gespraech"
  ],
  "ultimate-famed-preparation-guide": [
    "famed-vorbereitung-30-minuten-lernroutine",
    "anamnese-overview-part-1"
  ]
};
