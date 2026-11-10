#!/usr/bin/env python3
"""Five design directions for the free FaMED 8-week guide (Spanish sample pages).
Each design = 4 A4 pages: cover, contents, week page, book+app page.
Every page carries clickable links to the book (PayPal) and the free app case."""
import sys, re
from pathlib import Path
W = Path(__file__).parent
sys.path.insert(0, str(W.parent / 'famed-book-cover'))
sys.path.insert(0, str(W.parent / 'tmp/famedblog-seo/scripts/guide-source'))
from gen import logo, mark
from chapters import ES
from translations import ES_WEEKS

LOC = 'es'
TOTAL = 30
BOOK = f'https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=guide_pdf&utm_medium=pdf&utm_campaign=guide_book_{LOC}'
APP = f'https://famedtestprep.com/dashboard?utm_source=blog&utm_medium=guide_pdf&utm_campaign=guide_app&utm_content=guide-pdf&utm_locale={LOC}'

T = dict(
    kicker='Fachsprachprüfung Medizin · Guía gratuita',
    title='La hoja de ruta completa para preparar FaMED',
    sub='Tu plan de estudio de ocho semanas',
    edition='Edición en español · 30 páginas',
    book_t='FaMED Protokoll 2026',
    book_d='El libro digital con casos, estructuras de conversación, expresiones profesionales, vocabulario y ejemplos de formulación.',
    book_cta='Ver el libro',
    app_t='Practica un caso gratis en la app',
    app_d='Anamnese, Aufklärung, Arzt–Arzt y escritura, con feedback para tu siguiente intento.',
    app_cta='Abrir caso gratis',
    foot_book='Ver el libro FaMED Protokoll 2026 →',
    toc='Contenido', toc_t='Índice de la guía',
    week='Semana 1',
    morning='Mañana', afternoon='Tarde', evening='Noche',
    days=['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    tip_t='En el libro',
    tip_d='Las estructuras SAMPLER y OPQRST con frases modelo en alemán están desarrolladas en FaMED Protokoll 2026.',
    optional='Opcional: no necesitas comprar nada para usar esta guía.',
    products_t='Si quieres seguir practicando',
)
TOC = [('01', 'Entender el examen FaMED', 3), ('02', 'Estructura actual y tiempos', 4), ('03', 'Listas de casos para practicar', 5),
       ('04', 'Esquemas de comunicación', 8), ('05', 'Calendario: semanas 1 a 8', 9), ('06', 'Día del examen y lista de comprobación', 24),
       ('07', 'Diez errores frecuentes', 26), ('08', 'Recursos para practicar', 28), ('09', 'Libro y app', 29)]
WEEK_TOPIC, ROWS = ES_WEEKS[0]
ROWS = ROWS[:5]

def split(act):
    a, _, d = act.partition('|')
    return a.strip(), d.strip()

def a(href, inner, cls=''):
    return f'<a href="{href}" class="{cls}">{inner}</a>'

HEAD = '''<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{font-family:Manrope;src:url(assets/manrope-latin-wght-normal.woff2) format('woff2');font-weight:200 800}
@font-face{font-family:Inter;src:url(assets/inter-latin-wght-normal.woff2) format('woff2');font-weight:100 900}
@font-face{font-family:Lato;src:url(assets/Lato-Reg.ttf);font-weight:400}
@font-face{font-family:Lato;src:url(assets/Lato-Bol.ttf);font-weight:700}
:root{--ink:#151612;--coral:#EB5A50;--sun:#F6D46B;--paper:#FBFAF6;--lk:#000;--ly:#EAC714;--lr:#B81617}
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Inter;color:var(--ink);-webkit-font-smoothing:antialiased}
.pg{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;break-after:page}
.pg:last-child{page-break-after:auto}
a{color:inherit;text-decoration:none}
.logo{display:block}
'''

# ---------------------------------------------------------------- shared blocks
def week_rows(style):
    out = []
    for day, row in zip(T['days'], ROWS):
        theme, *acts = row
        cells = [split(x) for x in acts]
        out.append((day, theme, cells))
    return out

def designs():
    D = {}
    # ============================================================ 1 · KLASSIK (matches the book)
    css = '''
.d1 .cv{background:var(--ink);color:#fff}
.d1 .fan{position:absolute;inset:0;width:100%;height:100%}
.d1 .cv .k{position:absolute;left:20mm;top:20mm;font:700 8.5pt Inter;letter-spacing:.22em;text-transform:uppercase;color:#a9aaa2}
.d1 .cv h1{position:absolute;left:19mm;top:34mm;width:120mm;font:800 40pt/1.02 Manrope;letter-spacing:-.035em}
.d1 .cv h1 em{font-style:normal;color:var(--sun)}
.d1 .cv .r{position:absolute;left:20mm;top:104mm;width:16mm;height:1.3mm;background:var(--coral)}
.d1 .cv .s{position:absolute;left:20mm;top:110mm;width:90mm;font:500 15pt/1.4 Manrope;color:#e5e4dc}
.d1 .cv .lg{position:absolute;right:18mm;bottom:20mm}
.d1 .cv .ed{position:absolute;right:18mm;bottom:13mm;font:700 7.5pt Inter;letter-spacing:.2em;text-transform:uppercase;color:#77786f}
.d1 .cvbook{position:absolute;left:20mm;top:132mm;display:flex;gap:5mm;align-items:center;background:#fff;color:var(--ink);border-radius:3mm;padding:3.5mm 5mm 3.5mm 3.5mm;box-shadow:0 2mm 6mm #0003}
.d1 .cvbook img{height:24mm;border-radius:1mm}
.d1 .cvbook b{display:block;font:800 11pt Manrope}
.d1 .cvbook span{font:600 8.5pt Inter;color:var(--coral)}
.d1 .in{padding:22mm 20mm 0}
.d1 .bar{position:absolute;left:0;right:0;top:0;height:2.2mm;display:flex}.d1 .bar i{flex:1}
.d1 .hd{display:flex;justify-content:space-between;font:700 7.5pt Inter;letter-spacing:.2em;text-transform:uppercase;color:#8a8b84;padding-bottom:4mm;border-bottom:.3mm solid #e2e0d8}
.d1 h2{font:800 26pt/1.08 Manrope;letter-spacing:-.03em;margin:10mm 0 6mm}
.d1 h2 small{display:block;font:700 9pt Inter;color:var(--coral);letter-spacing:.18em;text-transform:uppercase;margin-bottom:3mm}
.d1 p{font:400 10.5pt/1.6 Inter;color:#2a2b27}
.d1 .toc div{display:flex;align-items:baseline;gap:6mm;padding:3.4mm 0;border-bottom:.3mm solid #e8e6de;font:600 11.5pt Manrope}
.d1 .toc span{font:800 9pt Inter;color:var(--coral);width:8mm}
.d1 .toc em{margin-left:auto;font:600 9pt Inter;font-style:normal;color:#8a8b84}
.d1 .day{display:grid;grid-template-columns:30mm 1fr;gap:5mm;padding:3.6mm 0;border-bottom:.3mm solid #e8e6de}
.d1 .day h4{font:800 11pt Manrope}.d1 .day h4 small{display:block;font:500 8.5pt Inter;color:#8a8b84;margin-top:1mm}
.d1 .day ul{list-style:none;display:grid;gap:1.6mm}
.d1 .day li{display:grid;grid-template-columns:20mm 1fr 14mm;font:400 9.2pt/1.4 Inter;color:#2a2b27}
.d1 .day li b{font:700 7.5pt Inter;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);padding-top:.5mm}
.d1 .day li i{font-style:normal;text-align:right;color:#8a8b84;font-size:8.5pt}
.d1 .tip{display:flex;gap:5mm;align-items:center;margin-top:6mm;background:var(--ink);color:#fff;border-radius:3mm;padding:4.5mm 6mm;position:relative;overflow:hidden}
.d1 .tip img{height:20mm;position:relative}
.d1 .tip div{position:relative;flex:1}
.d1 .tip b{display:block;font:800 11pt Manrope;margin-bottom:1mm}
.d1 .tip p{color:#d8d7cf;font-size:9pt}
.d1 .tip .btn{background:var(--coral);color:#fff;font:700 9pt Inter;padding:2.6mm 4.5mm;border-radius:10mm;white-space:nowrap;position:relative}
.d1 .ft{position:absolute;left:20mm;right:20mm;bottom:11mm;display:flex;justify-content:space-between;font:600 8pt Inter;color:#8a8b84;border-top:.3mm solid #e2e0d8;padding-top:3.5mm}
.d1 .ft a{color:var(--coral);font-weight:700}
.d1 .bk{background:var(--ink);color:#fff;border-radius:4mm;padding:9mm;display:grid;grid-template-columns:58mm 1fr;gap:8mm;align-items:center;position:relative;overflow:hidden;margin-top:4mm}
.d1 .bk .fan2{position:absolute;right:0;top:0;height:100%}
.d1 .bk img{width:58mm;position:relative}
.d1 .bk div{position:relative}
.d1 .bk h3{font:800 22pt/1.05 Manrope;letter-spacing:-.03em}.d1 .bk h3 em{font-style:normal;color:var(--sun)}
.d1 .bk p{color:#d8d7cf;margin:4mm 0 6mm;font-size:10pt}
.d1 .btn{display:inline-block;background:var(--coral);color:#fff;font:700 10.5pt Inter;padding:3.4mm 7mm;border-radius:10mm}
.d1 .ap{margin-top:6mm;border:.4mm solid var(--ink);border-radius:4mm;padding:7mm 8mm;display:flex;align-items:center;gap:7mm}
.d1 .ap div{flex:1}.d1 .ap h3{font:800 15pt Manrope;margin-bottom:2mm}
.d1 .ap .btn{background:var(--ink)}
.d1 .opt{margin-top:6mm;font:500 9pt Inter;color:#8a8b84}
'''
    bar = '<div class="bar"><i style="background:var(--ink)"></i><i style="background:var(--coral)"></i><i style="background:var(--sun)"></i></div>'
    hd = lambda r: f'<div class="hd"><span>FaMED Prep · Guía de 8 semanas</span><span>{r}</span></div>'
    ft = lambda n: f'<div class="ft">{a(BOOK, T["foot_book"])}<span>{n} / {TOTAL}</span></div>'
    fan = '<svg class="fan" viewBox="0 0 210 297" preserveAspectRatio="none"><path d="M0 297L210 128V186Z" fill="var(--coral)"/><path d="M0 297L210 186V240Z" fill="var(--sun)"/><path d="M0 297L210 240V297Z" fill="#fff"/></svg>'
    p1 = f'''<section class="pg cv">{fan}<div class="k">{T["kicker"]}</div>
<h1>La hoja de ruta<br>completa para<br><em>preparar FaMED</em></h1><div class="r"></div><div class="s">{T["sub"]}</div>
{a(BOOK, f'<img src="assets/cover_flat.jpg"><div><b>{T["book_t"]}</b><span>{T["book_cta"]} →</span></div>', 'cvbook')}
<div class="lg">{logo(150, '#151612')}</div><div class="ed">{T["edition"]}</div></section>'''
    toc = ''.join(f'<a href="#p{pg}"><div><span>{n}</span>{t}<em>{pg}</em></div></a>' for n, t, pg in TOC)
    p2 = f'''<section class="pg">{bar}<div class="in">{hd(T["toc"])}<h2><small>{T["toc"]}</small>{T["toc_t"]}</h2>
<p>Un plan de ocho semanas para organizar una preparación constante y realista, con todas las listas de casos y las sesiones diarias.</p>
<div class="toc" style="margin-top:7mm">{toc}</div>
<div class="tip">{fan.replace('class="fan"', 'class="fan" style="opacity:.25"')}<img src="assets/book3d_s.png"><div><b>{T["book_t"]}</b><p>{T["book_d"]}</p></div>{a(BOOK, T["book_cta"] + " →", "btn")}</div>
</div>{ft(2)}</section>'''
    days = ''.join(f'''<div class="day"><h4>{d}<small>{th}</small></h4><ul>{''.join(f'<li><b>{lab}</b><span>{x}</span><i>{dur}</i></li>' for lab, (x, dur) in zip([T["morning"], T["afternoon"], T["evening"]], cells))}</ul></div>''' for d, th, cells in week_rows(1))
    p3 = f'''<section class="pg">{bar}<div class="in">{hd(T["week"])}<h2><small>{T["week"]}</small>{WEEK_TOPIC}</h2>{days}
<div class="tip"><img src="assets/book3d_s.png"><div><b>{T["tip_t"]}</b><p>{T["tip_d"]}</p></div>{a(BOOK, T["book_cta"] + " →", "btn")}</div></div>{ft(9)}</section>'''
    P4 = lambda n: f'''<section class="pg">{bar}<div class="in">{hd("Libro y app")}<h2><small>Libro y app</small>{T["products_t"]}</h2>
<div class="bk"><svg class="fan2" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M40 100L100 0V100Z" fill="var(--coral)" opacity=".18"/></svg>{a(BOOK, '<img src="assets/book3d.png">')}
<div><h3>FaMED Protokoll<br><em>2026</em></h3><p>{T["book_d"]}</p>{a(BOOK, T["book_cta"] + " →", "btn")}</div></div>
<div class="ap"><div><h3>{T["app_t"]}</h3><p>{T["app_d"]}</p></div>{a(APP, T["app_cta"] + " →", "btn")}</div>
<p class="opt">{T["optional"]}</p></div>{ft(n)}</section>'''
    D['1-klassik'] = ('Klassik — el mismo lenguaje que la portada del libro: negro, coral y amarillo', css, 'd1', [p1, p2, p3, P4(29)], P4)

    # ============================================================ 2 · FACHBUCH (textbook, serif)
    css = '''
.d2{background:var(--paper)}
.d2 .band{position:absolute;left:0;top:0;bottom:0;display:flex}.d2 .band i{display:block;height:100%}
.d2 .cv .k{position:absolute;left:34mm;right:16mm;top:20mm;display:flex;justify-content:space-between;font:700 7.5pt Inter;letter-spacing:.2em;text-transform:uppercase;color:#6b6c66;padding-bottom:4mm;border-bottom:.3mm solid #d9d6cc}
.d2 .cv h1{position:absolute;left:33mm;right:18mm;top:42mm;font:400 42pt/1.06 Charter,Georgia,serif;letter-spacing:-.01em}
.d2 .cv h1 b{font-weight:700;color:var(--coral)}
.d2 .cv .s{position:absolute;left:34mm;top:118mm;font:italic 15pt/1.4 Charter,Georgia,serif;color:#3a3b36}
.d2 .cv .num{position:absolute;left:31mm;top:138mm;font:800 120pt/1 Manrope;letter-spacing:-.06em;color:var(--ink)}
.d2 .cv .num small{font:700 16pt Manrope;letter-spacing:0;margin-left:3mm;color:var(--coral)}
.d2 .cv .bt{position:absolute;left:34mm;right:16mm;bottom:20mm;display:flex;justify-content:space-between;align-items:flex-end;border-top:.3mm solid #d9d6cc;padding-top:6mm}
.d2 .cvbook{display:flex;gap:4mm;align-items:center}.d2 .cvbook img{height:26mm;box-shadow:0 1mm 3mm #0003}
.d2 .cvbook b{display:block;font:700 10.5pt Charter,Georgia,serif}.d2 .cvbook span{font:700 8pt Inter;letter-spacing:.1em;text-transform:uppercase;color:var(--coral)}
.d2 .in{padding:22mm 18mm 0 34mm}
.d2 .hd{display:flex;justify-content:space-between;font:700 7pt Inter;letter-spacing:.2em;text-transform:uppercase;color:#8a8b84;padding-bottom:3mm;border-bottom:.3mm solid #d9d6cc}
.d2 .sec{position:absolute;left:13mm;top:40mm;font:800 30pt Manrope;color:var(--coral);letter-spacing:-.04em}
.d2 h2{font:700 25pt/1.12 Charter,Georgia,serif;margin:12mm 0 5mm}
.d2 p{font:400 10.8pt/1.62 Charter,Georgia,serif;color:#2a2b27}
.d2 .toc div{display:flex;align-items:baseline;gap:4mm;padding:3mm 0;font:400 12pt Charter,Georgia,serif;border-bottom:.25mm dotted #b9b6ac}
.d2 .toc span{font:700 8.5pt Inter;color:var(--coral);width:8mm}.d2 .toc em{margin-left:auto;font:600 9pt Inter;font-style:normal;color:#6b6c66}
.d2 table{width:100%;border-collapse:collapse;margin-top:2mm}
.d2 th{font:700 7pt Inter;letter-spacing:.16em;text-transform:uppercase;color:#6b6c66;text-align:left;padding:2mm 2mm;border-bottom:.5mm solid var(--ink)}
.d2 td{font:400 9pt/1.4 Charter,Georgia,serif;vertical-align:top;padding:3mm 2mm;border-bottom:.25mm solid #d9d6cc}
.d2 td:first-child{font:700 9.5pt Charter,Georgia,serif;width:27mm}.d2 td:first-child small{display:block;font:italic 8.3pt Charter,Georgia,serif;color:#6b6c66;margin-top:1mm}
.d2 td i{display:block;font:600 7.5pt Inter;font-style:normal;color:var(--coral);margin-top:1mm}
.d2 .side{margin-top:7mm;border-left:1.2mm solid var(--coral);background:#fff;padding:5mm 6mm;display:flex;gap:5mm;align-items:center;box-shadow:0 .3mm 0 #d9d6cc}
.d2 .side img{height:24mm;box-shadow:0 1mm 3mm #0003}.d2 .side div{flex:1}
.d2 .side b{display:block;font:700 8pt Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--coral);margin-bottom:1.5mm}
.d2 .side p{font-size:9.8pt}
.d2 .lnk{font:700 9pt Inter;color:var(--ink);border-bottom:.5mm solid var(--coral);padding-bottom:.4mm;white-space:nowrap}
.d2 .ft{position:absolute;left:34mm;right:18mm;bottom:11mm;display:flex;justify-content:space-between;font:400 8.5pt Charter,Georgia,serif;color:#6b6c66}
.d2 .ft a{font:700 8pt Inter;color:var(--coral)}
.d2 .bk{display:grid;grid-template-columns:62mm 1fr;gap:9mm;align-items:center;margin-top:6mm;padding:8mm 0;border-top:.5mm solid var(--ink);border-bottom:.3mm solid #d9d6cc}
.d2 .bk img{width:62mm;box-shadow:0 2mm 6mm #0003}
.d2 .bk h3{font:700 22pt/1.1 Charter,Georgia,serif}.d2 .bk p{margin:3mm 0 6mm}
.d2 .btn{display:inline-block;background:var(--ink);color:#fff;font:700 10pt Inter;padding:3.2mm 6mm}
.d2 .btn.c{background:var(--coral)}
.d2 .ap{padding:7mm 0;display:flex;gap:8mm;align-items:center;border-bottom:.3mm solid #d9d6cc}.d2 .ap div{flex:1}
.d2 .ap h3{font:700 15pt Charter,Georgia,serif;margin-bottom:2mm}
.d2 .opt{margin-top:5mm;font:italic 9.5pt Charter,Georgia,serif;color:#6b6c66}
'''
    band = '<div class="band"><i style="width:12mm;background:var(--ink)"></i><i style="width:4mm;background:var(--coral)"></i><i style="width:4mm;background:var(--sun)"></i></div>'
    hd = lambda r: f'<div class="hd"><span>Guía FaMED · 8 semanas</span><span>{r}</span></div>'
    ft = lambda n: f'<div class="ft"><span>{n}</span>{a(BOOK, T["foot_book"])}</div>'
    p1 = f'''<section class="pg cv">{band}<div class="k"><span>Fachsprachprüfung Medizin</span><span>Guía gratuita</span></div>
<h1>La hoja de ruta completa para <b>preparar FaMED</b></h1><div class="s">{T["sub"]}</div>
<div class="num">8<small>semanas · 54 sesiones</small></div>
<div class="bt">{a(BOOK, f'<img src="assets/cover_flat.jpg"><div><b>{T["book_t"]}</b><span>{T["book_cta"]} →</span></div>', 'cvbook')}{logo(130)}</div></section>'''
    toc = ''.join(f'<a href="#p{pg}"><div><span>{n}</span>{t}<em>{pg}</em></div></a>' for n, t, pg in TOC)
    side = lambda ttl, txt: f'<div class="side"><img src="assets/cover_flat.jpg"><div><b>{ttl}</b><p>{txt}</p></div>{a(BOOK, T["book_cta"] + " →", "lnk")}</div>'
    p2 = f'''<section class="pg">{band}<div class="in">{hd(T["toc"])}<h2>{T["toc"]}</h2>
<p>Un plan de ocho semanas para organizar una preparación constante y realista, con todas las listas de casos y las sesiones diarias.</p>
<div class="toc" style="margin-top:6mm">{toc}</div>{side(T["book_t"], T["book_d"])}</div>{ft(2)}</section>'''
    rows = ''.join(f'<tr><td>{d}<small>{th}</small></td>' + ''.join(f'<td>{x}<i>{dur}</i></td>' for x, dur in cells) + '</tr>' for d, th, cells in week_rows(2))
    p3 = f'''<section class="pg">{band}<div class="in">{hd(T["week"])}<h2>{T["week"]}: {WEEK_TOPIC}</h2>
<table><tr><th>Día</th><th>{T["morning"]}</th><th>{T["afternoon"]}</th><th>{T["evening"]}</th></tr>{rows}</table>{side(T["tip_t"], T["tip_d"])}</div>{ft(9)}</section>'''
    P4 = lambda n: f'''<section class="pg">{band}<div class="in">{hd("Libro y app")}<h2>{T["products_t"]}</h2>
<div class="bk">{a(BOOK, '<img src="assets/cover_flat.jpg">')}<div><h3>{T["book_t"]}</h3><p>{T["book_d"]}</p>{a(BOOK, T["book_cta"] + " →", "btn c")}</div></div>
<div class="ap"><div><h3>{T["app_t"]}</h3><p>{T["app_d"]}</p></div>{a(APP, T["app_cta"] + " →", "btn")}</div><p class="opt">{T["optional"]}</p></div>{ft(n)}</section>'''
    D['2-fachbuch'] = ('Fachbuch — libro de texto médico: papel crema, serif, banda tricolor en el lomo', css, 'd2', [p1, p2, p3, P4(29)], P4)

    # ============================================================ 3 · PLANER (weekly planner)
    css = '''
.d3 .cv{background:#14213D;color:#fff}
.d3 .cv .k{position:absolute;left:18mm;top:18mm;font:700 8pt Inter;letter-spacing:.2em;text-transform:uppercase;color:#9aa6c2}
.d3 .cv h1{position:absolute;left:18mm;top:30mm;width:150mm;font:800 36pt/1.05 Manrope;letter-spacing:-.03em}
.d3 .cv h1 em{font-style:normal;color:var(--sun)}
.d3 .grid{position:absolute;left:18mm;top:100mm;display:grid;grid-template-columns:repeat(7,19mm);gap:2.2mm}
.d3 .grid i{height:13mm;border-radius:1.6mm;background:#22345c;font:700 6.5pt Inter;color:#6f7fa6;padding:1.4mm 1.8mm;font-style:normal}
.d3 .grid i.w{background:var(--sun);color:#14213D}.d3 .grid i.x{background:var(--coral);color:#fff}
.d3 .gl{position:absolute;left:18mm;top:91mm;font:700 8pt Inter;letter-spacing:.16em;text-transform:uppercase;color:#9aa6c2}
.d3 .cv .bt{position:absolute;left:18mm;right:18mm;bottom:16mm;display:flex;justify-content:space-between;align-items:center}
.d3 .cvbook{display:flex;gap:4mm;align-items:center;background:#fff;color:#14213D;border-radius:2.5mm;padding:3mm 5mm 3mm 3mm}.d3 .cvbook img{height:20mm;border-radius:.8mm}
.d3 .cvbook b{display:block;font:800 10.5pt Manrope}.d3 .cvbook span{font:700 8.5pt Inter;color:var(--coral)}
.d3 .wlogo{background:#fff;border-radius:2.5mm;padding:4mm 5mm}
.d3 .in{padding:16mm 16mm 0}
.d3 .top{display:flex;justify-content:space-between;align-items:center;background:#14213D;color:#fff;border-radius:2.5mm;padding:5mm 6mm}
.d3 .top h2{font:800 19pt/1.1 Manrope}.d3 .top h2 small{display:block;font:700 8pt Inter;letter-spacing:.16em;text-transform:uppercase;color:var(--sun);margin-bottom:1.5mm}
.d3 .top .wk{display:flex;gap:1.2mm}.d3 .top .wk i{width:6mm;height:6mm;border-radius:50%;border:.4mm solid #4d5f8c;font:700 7pt/5.2mm Inter;text-align:center;font-style:normal;color:#9aa6c2}
.d3 .top .wk i.on{background:var(--sun);border-color:var(--sun);color:#14213D}
.d3 p{font:400 10.3pt/1.6 Inter;color:#2b3550}
.d3 .card{border:.35mm solid #d8deea;border-radius:2.5mm;margin-top:3.5mm;overflow:hidden}
.d3 .card h4{display:flex;justify-content:space-between;background:#f2f5fa;padding:2.6mm 4mm;font:800 10pt Manrope;color:#14213D}.d3 .card h4 span{font:500 8.5pt Inter;color:#5b6787}
.d3 .card ul{list-style:none;display:grid;grid-template-columns:repeat(3,1fr)}
.d3 .card li{padding:2.8mm 4mm;font:400 8.6pt/1.4 Inter;color:#2b3550;border-left:.35mm solid #e3e8f1;display:grid;grid-template-columns:4mm 1fr;gap:1.5mm}
.d3 .card li:first-child{border-left:0}
.d3 .card li:before{content:'';width:3.2mm;height:3.2mm;border:.4mm solid #9aa6c2;border-radius:.8mm;margin-top:.4mm}
.d3 .card li b{display:block;font:700 7pt Inter;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);margin-bottom:.6mm}
.d3 .card li i{display:block;font-style:normal;color:#8590ab;font-size:7.8pt;margin-top:.6mm}
.d3 .note{margin-top:4mm;display:flex;gap:4mm;align-items:center;background:#fff7d9;border:.35mm dashed #e2c456;border-radius:2.5mm;padding:3.5mm 5mm}
.d3 .note img{height:17mm}.d3 .note div{flex:1}.d3 .note b{font:800 10pt Manrope;color:#14213D}.d3 .note p{font-size:8.8pt;line-height:1.45}
.d3 .btn{display:inline-block;background:var(--coral);color:#fff;font:700 9.5pt Inter;padding:2.8mm 5mm;border-radius:1.6mm;white-space:nowrap}
.d3 .btn.n{background:#14213D}
.d3 .toc{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:6mm}
.d3 .toc div{border:.35mm solid #d8deea;border-radius:2.5mm;padding:4mm;font:700 10.5pt/1.3 Manrope;color:#14213D;display:flex;gap:3mm}
.d3 .toc span{font:800 8pt Inter;color:var(--coral)}.d3 .toc em{margin-left:auto;font:600 8.5pt Inter;font-style:normal;color:#8590ab}
.d3 .ft{position:absolute;left:16mm;right:16mm;bottom:10mm;display:flex;justify-content:space-between;align-items:center;font:600 8pt Inter;color:#8590ab}
.d3 .ft a{background:#14213D;color:#fff;padding:1.8mm 3.5mm;border-radius:1.4mm;font-weight:700}
.d3 .bk{margin-top:6mm;display:grid;grid-template-columns:55mm 1fr;gap:8mm;align-items:center;background:#f2f5fa;border-radius:3mm;padding:8mm}
.d3 .bk img{width:55mm}.d3 .bk h3{font:800 20pt/1.1 Manrope;color:#14213D}.d3 .bk p{margin:3mm 0 5mm}
.d3 .ap{margin-top:5mm;display:flex;gap:6mm;align-items:center;border:.35mm solid #d8deea;border-radius:3mm;padding:6mm 8mm}.d3 .ap div{flex:1}
.d3 .ap h3{font:800 14pt Manrope;color:#14213D;margin-bottom:1.5mm}
.d3 .opt{margin-top:5mm;font-size:8.8pt;color:#8590ab}
'''
    cells = ''
    for wk in range(8):
        for d in range(7):
            n = wk * 7 + d + 1
            cls = 'w' if d == 0 else ''
            if wk == 7 and d == 4: cls = 'x'
            lbl = f'S{wk+1}' if d == 0 else ('Examen' if cls == 'x' else '')
            cells += f'<i class="{cls}">{lbl}</i>'
    ft = lambda n: f'<div class="ft"><span>FaMED Prep · Guía de 8 semanas · {n}/{TOTAL}</span>{a(BOOK, T["foot_book"])}</div>'
    top = lambda s, t, on: f'<div class="top"><h2><small>{s}</small>{t}</h2><div class="wk">{"".join(f"<i class={chr(34)}on{chr(34)}>{i}</i>" if i == on else f"<i>{i}</i>" for i in range(1, 9))}</div></div>'
    p1 = f'''<section class="pg cv"><div class="k">{T["kicker"]}</div><h1>La hoja de ruta completa<br>para <em>preparar FaMED</em></h1>
<div class="gl">8 semanas · 54 sesiones · día del examen</div><div class="grid">{cells}</div>
<div class="bt">{a(BOOK, f'<img src="assets/cover_flat.jpg"><div><b>{T["book_t"]}</b><span>{T["book_cta"]} →</span></div>', 'cvbook')}<div class="wlogo">{logo(110)}</div></div></section>'''
    toc = ''.join(f'<a href="#p{pg}"><div><span>{n}</span>{t}<em>{pg}</em></div></a>' for n, t, pg in TOC)
    note = lambda t, d: f'<div class="note"><img src="assets/book3d_s.png"><div><b>{t}</b><p>{d}</p></div>{a(BOOK, T["book_cta"] + " →", "btn")}</div>'
    p2 = f'''<section class="pg"><div class="in">{top(T["toc"], T["toc_t"], 0)}<p style="margin-top:6mm">Un plan de ocho semanas para organizar una preparación constante y realista, con todas las listas de casos y las sesiones diarias.</p>
<div class="toc">{toc}</div>{note(T["book_t"], T["book_d"])}</div>{ft(2)}</section>'''
    cards = ''.join(f'<div class="card"><h4>{d}<span>{th}</span></h4><ul>' + ''.join(f'<li><span><b>{lab}</b>{x}<i>{dur}</i></span></li>' for lab, (x, dur) in zip([T["morning"], T["afternoon"], T["evening"]], c)) + '</ul></div>' for d, th, c in week_rows(3))
    p3 = f'''<section class="pg"><div class="in">{top(T["week"], WEEK_TOPIC, 1)}{cards}{note(T["tip_t"], T["tip_d"])}</div>{ft(9)}</section>'''
    P4 = lambda n: f'''<section class="pg"><div class="in">{top("Libro y app", T["products_t"], 0)}
<div class="bk">{a(BOOK, '<img src="assets/book3d.png">')}<div><h3>{T["book_t"]}</h3><p>{T["book_d"]}</p>{a(BOOK, T["book_cta"] + " →", "btn")}</div></div>
<div class="ap"><div><h3>{T["app_t"]}</h3><p>{T["app_d"]}</p></div>{a(APP, T["app_cta"] + " →", "btn n")}</div><p class="opt">{T["optional"]}</p></div>{ft(n)}</section>'''
    D['3-planer'] = ('Planer — agenda semanal: azul marino, casillas para marcar cada sesión', css, 'd3', [p1, p2, p3, P4(29)], P4)

    # ============================================================ 4 · EDITORIAL (big numerals, magazine)
    css = '''
.d4 .cv{background:#F3EEE4}
.d4 .cv .k{position:absolute;left:16mm;right:16mm;top:16mm;display:flex;justify-content:space-between;font:700 7.5pt Inter;letter-spacing:.22em;text-transform:uppercase;border-bottom:.6mm solid var(--ink);padding-bottom:3mm}
.d4 .cv .eight{position:absolute;right:6mm;top:16mm;font:800 330pt/1 Manrope;letter-spacing:-.08em;color:var(--coral)}
.d4 .cv h1{position:absolute;left:16mm;top:150mm;width:120mm;font:400 34pt/1.08 "New York",Georgia,serif;letter-spacing:-.01em}
.d4 .cv h1 i{color:var(--coral)}
.d4 .cv .s{position:absolute;left:16mm;top:205mm;font:600 10pt Inter;letter-spacing:.14em;text-transform:uppercase}
.d4 .cv .bt{position:absolute;left:16mm;right:16mm;bottom:16mm;display:flex;justify-content:space-between;align-items:flex-end;border-top:.6mm solid var(--ink);padding-top:5mm}
.d4 .cvbook{display:flex;gap:4mm;align-items:center}.d4 .cvbook img{height:24mm}.d4 .cvbook b{display:block;font:400 13pt "New York",Georgia,serif}.d4 .cvbook span{font:700 8pt Inter;letter-spacing:.12em;text-transform:uppercase;color:var(--coral)}
.d4 .in{padding:16mm 16mm 0}
.d4 .hd{display:flex;justify-content:space-between;font:700 7pt Inter;letter-spacing:.22em;text-transform:uppercase;border-bottom:.6mm solid var(--ink);padding-bottom:3mm}
.d4 .big{display:flex;align-items:flex-end;gap:6mm;margin:8mm 0 6mm}
.d4 .big b{font:800 70pt/0.8 Manrope;letter-spacing:-.06em;color:var(--coral)}
.d4 h2{font:400 26pt/1.1 "New York",Georgia,serif}
.d4 p{font:400 10.3pt/1.6 Inter;color:#2a2b27}
.d4 .lead{font:400 13pt/1.5 "New York",Georgia,serif;color:var(--ink);margin-bottom:6mm}
.d4 .toc{columns:2;column-gap:8mm}.d4 .toc div{break-inside:avoid;padding:3.5mm 0;border-top:.25mm solid #cfc8b8;font:400 12pt "New York",Georgia,serif;display:flex;gap:3mm}
.d4 .toc span{font:800 9pt Manrope;color:var(--coral)}.d4 .toc em{margin-left:auto;font:600 8.5pt Inter;font-style:normal;color:#8a8b84}
.d4 .days{columns:2;column-gap:8mm}
.d4 .dy{break-inside:avoid;border-top:.25mm solid #cfc8b8;padding:3mm 0 3.5mm}
.d4 .dy h4{font:400 13pt "New York",Georgia,serif}.d4 .dy h4 small{font:600 8pt Inter;color:var(--coral);letter-spacing:.06em;margin-left:2mm}
.d4 .dy p{font-size:8.8pt;line-height:1.45;margin-top:1.2mm}.d4 .dy p b{font:700 7pt Inter;letter-spacing:.12em;text-transform:uppercase;color:#8a8b84;margin-right:1.5mm}
.d4 .pull{break-inside:avoid;background:var(--coral);color:#fff;padding:5mm;margin-top:3mm;display:block}
.d4 .pull img{height:30mm;float:right;margin-left:3mm}
.d4 .pull b{display:block;font:400 14pt/1.2 "New York",Georgia,serif;margin-bottom:2mm}.d4 .pull p{color:#fff;font-size:9pt}
.d4 .pull span{display:inline-block;margin-top:3mm;font:700 8.5pt Inter;letter-spacing:.1em;text-transform:uppercase;border-bottom:.5mm solid #fff}
.d4 .ft{position:absolute;left:16mm;right:16mm;bottom:10mm;display:flex;justify-content:space-between;font:700 7.5pt Inter;letter-spacing:.14em;text-transform:uppercase;border-top:.25mm solid #cfc8b8;padding-top:3mm;color:#6b6c66}
.d4 .ft a{color:var(--coral)}
.d4 .full{position:absolute;inset:0;background:var(--coral);color:#fff}
.d4 .full .hd{border-color:#fff;margin:16mm 16mm 0}
.d4 .full img{position:absolute;left:16mm;top:42mm;width:88mm}
.d4 .full .tx{position:absolute;left:112mm;right:16mm;top:52mm}
.d4 .full h3{font:400 30pt/1.05 "New York",Georgia,serif}.d4 .full p{color:#fff;margin:5mm 0 7mm}
.d4 .btn{display:inline-block;background:var(--ink);color:#fff;font:700 10pt Inter;padding:3.4mm 6mm}
.d4 .full .ap{position:absolute;left:16mm;right:16mm;top:178mm;background:#fff;color:var(--ink);padding:7mm 8mm;display:flex;gap:6mm;align-items:center}
.d4 .full .ap div{flex:1}.d4 .full .ap h4{font:400 17pt "New York",Georgia,serif;margin-bottom:1.5mm}.d4 .full .ap p{color:#2a2b27;margin:0}
.d4 .full .opt{position:absolute;left:16mm;top:222mm;font:600 9pt Inter;color:#ffe9e5}
.d4 .full .ft{border-color:#ffffff88;color:#fff}.d4 .full .ft a{color:#fff}
'''
    hd = lambda r: f'<div class="hd"><span>FaMED Prep</span><span>{r}</span></div>'
    ft = lambda n: f'<div class="ft"><span>{n} / {TOTAL}</span>{a(BOOK, T["foot_book"])}</div>'
    pull = lambda t, d: a(BOOK, f'<img src="assets/book3d_s.png"><b>{t}</b><p>{d}</p><span>{T["book_cta"]} →</span>', 'pull')
    p1 = f'''<section class="pg cv"><div class="k"><span>FaMED Prep</span><span>Guía gratuita</span></div><div class="eight">8</div>
<h1>La hoja de ruta completa para <i>preparar FaMED</i></h1><div class="s">Ocho semanas · 54 sesiones · casos y frases en alemán</div>
<div class="bt">{a(BOOK, f'<img src="assets/cover_flat.jpg"><div><b>{T["book_t"]}</b><span>{T["book_cta"]} →</span></div>', 'cvbook')}{logo(120)}</div></section>'''
    toc = ''.join(f'<a href="#p{pg}"><div><span>{n}</span>{t}<em>{pg}</em></div></a>' for n, t, pg in TOC)
    p2 = f'''<section class="pg"><div class="in">{hd(T["toc"])}<div class="big"><b>00</b><h2>{T["toc_t"]}</h2></div>
<p class="lead">Un plan de ocho semanas para organizar una preparación constante y realista, con todas las listas de casos y las sesiones diarias.</p>
<div class="toc">{toc}</div><div style="margin-top:6mm">{pull(T["book_t"], T["book_d"])}</div></div>{ft(2)}</section>'''
    days = ''.join(f'<div class="dy"><h4>{d}<small>{th}</small></h4>' + ''.join(f'<p><b>{lab}</b>{x} · {dur}</p>' for lab, (x, dur) in zip([T["morning"], T["afternoon"], T["evening"]], c)) + '</div>' for d, th, c in week_rows(4))
    p3 = f'''<section class="pg"><div class="in">{hd(T["week"])}<div class="big"><b>01</b><h2>{WEEK_TOPIC}</h2></div><div class="days">{days}{pull(T["tip_t"], T["tip_d"])}</div></div>{ft(9)}</section>'''
    P4 = lambda n: f'''<section class="pg"><div class="full">{hd("Libro y app")}{a(BOOK, '<img src="assets/book3d.png">')}
<div class="tx"><h3>FaMED Protokoll 2026</h3><p>{T["book_d"]}</p>{a(BOOK, T["book_cta"] + " →", "btn")}</div>
<div class="ap"><div><h4>{T["app_t"]}</h4><p>{T["app_d"]}</p></div>{a(APP, T["app_cta"] + " →", "btn")}</div><p class="opt">{T["optional"]}</p>{ft(n)}</div></section>'''
    D['4-editorial'] = ('Editorial — estilo revista: números grandes, serif elegante, página coral del libro', css, 'd4', [p1, p2, p3, P4(29)], P4)

    # ============================================================ 5 · KLINIK (clinical record)
    css = '''
.d5{--t:#0E5E63;--tl:#E7F1F1}
.d5 .cv{background:#fff}
.d5 .cv .hb{position:absolute;left:0;right:0;top:0;height:80mm;background:var(--t);color:#fff;padding:18mm 18mm 0}
.d5 .cv .k{font:600 8pt Menlo,monospace;letter-spacing:.06em;color:#a8d0d1}
.d5 .cv h1{margin-top:8mm;font:700 30pt/1.1 Manrope;letter-spacing:-.025em}
.d5 .cv .meta{position:absolute;left:18mm;right:18mm;top:94mm;display:grid;grid-template-columns:repeat(3,1fr);border:.35mm solid #c9d9da}
.d5 .cv .meta div{padding:4mm;border-left:.35mm solid #c9d9da}.d5 .cv .meta div:first-child{border-left:0}
.d5 label{display:block;font:600 6.8pt Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#6c8587;margin-bottom:1.5mm}
.d5 .cv .meta b{font:700 13pt Manrope;color:var(--t)}
.d5 .cv .sts{position:absolute;left:18mm;right:18mm;top:122mm}
.d5 .cv .sts div{display:grid;grid-template-columns:30mm 1fr;padding:3.2mm 0;border-bottom:.3mm solid #e1ebeb;font:500 10pt Inter;color:#22393b}
.d5 .cv .sts span{font:600 8pt Menlo,monospace;color:var(--t)}
.d5 .cv .bt{position:absolute;left:18mm;right:18mm;bottom:16mm;display:flex;justify-content:space-between;align-items:center}
.d5 .cvbook{display:flex;gap:4mm;align-items:center;border:.35mm solid #c9d9da;padding:3mm 5mm 3mm 3mm}.d5 .cvbook img{height:22mm}
.d5 .cvbook b{display:block;font:800 10.5pt Manrope;color:#22393b}.d5 .cvbook span{font:700 8.5pt Inter;color:var(--t)}
.d5 .in{padding:16mm 18mm 0}
.d5 .hd{display:flex;justify-content:space-between;align-items:center;padding-bottom:3mm;border-bottom:.6mm solid var(--t)}
.d5 .hd span{font:600 7.5pt Menlo,monospace;color:#6c8587;letter-spacing:.04em}
.d5 h2{font:700 21pt/1.15 Manrope;letter-spacing:-.02em;margin:8mm 0 5mm;color:#14292b}
.d5 h2 small{display:block;font:600 8pt Menlo,monospace;color:var(--t);margin-bottom:2mm;letter-spacing:.04em}
.d5 p{font:400 10pt/1.6 Inter;color:#22393b}
.d5 .toc div{display:grid;grid-template-columns:12mm 1fr 10mm;padding:3mm 0;border-bottom:.3mm solid #e1ebeb;font:600 11pt Manrope;color:#14292b}
.d5 .toc span{font:600 8.5pt Menlo,monospace;color:var(--t)}.d5 .toc em{font:600 8.5pt Menlo,monospace;font-style:normal;color:#6c8587;text-align:right}
.d5 table{width:100%;border-collapse:collapse;border:.35mm solid #c9d9da}
.d5 th{background:var(--tl);font:600 7pt Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--t);text-align:left;padding:2.4mm 3mm;border-left:.35mm solid #c9d9da}
.d5 td{font:400 8.8pt/1.4 Inter;color:#22393b;padding:2.8mm 3mm;vertical-align:top;border-top:.35mm solid #c9d9da;border-left:.35mm solid #c9d9da}
.d5 td:first-child{width:28mm;font:700 9.5pt Manrope}.d5 td:first-child small{display:block;font:500 8pt Inter;color:#6c8587;margin-top:.8mm}
.d5 td i{display:block;font:600 7.3pt Menlo,monospace;font-style:normal;color:var(--t);margin-top:1mm}
.d5 .rx{margin-top:6mm;display:grid;grid-template-columns:24mm 1fr auto;gap:5mm;align-items:center;background:var(--tl);border-left:1.2mm solid var(--t);padding:4.5mm 5mm}
.d5 .rx img{width:24mm}.d5 .rx b{display:block;font:800 10.5pt Manrope;color:#14292b;margin-bottom:1mm}.d5 .rx p{font-size:9pt;line-height:1.45}
.d5 .btn{display:inline-block;background:var(--t);color:#fff;font:700 9.5pt Inter;padding:3mm 5.5mm;border-radius:1mm;white-space:nowrap}
.d5 .btn.c{background:var(--coral)}
.d5 .ft{position:absolute;left:18mm;right:18mm;bottom:10mm;display:flex;justify-content:space-between;font:600 7.5pt Menlo,monospace;color:#6c8587;border-top:.3mm solid #e1ebeb;padding-top:3mm}
.d5 .ft a{color:var(--t);font-weight:700}
.d5 .bk{margin-top:4mm;display:grid;grid-template-columns:58mm 1fr;gap:8mm;align-items:center;border:.35mm solid #c9d9da;padding:8mm}
.d5 .bk img{width:58mm}.d5 .bk h3{font:800 20pt/1.1 Manrope;color:#14292b}.d5 .bk p{margin:3mm 0 5mm}
.d5 .ap{margin-top:4mm;display:flex;gap:6mm;align-items:center;background:var(--tl);padding:6mm 8mm}.d5 .ap div{flex:1}
.d5 .ap h3{font:800 14pt Manrope;color:#14292b;margin-bottom:1.5mm}
.d5 .opt{margin-top:5mm;font:500 8.5pt Menlo,monospace;color:#6c8587}
'''
    hd = lambda r: f'<div class="hd">{logo(70)}<span>{r}</span></div>'
    ft = lambda n: f'<div class="ft"><span>FaMED-PREP / GUIA-8W / S.{n:02d}</span>{a(BOOK, T["foot_book"])}</div>'
    rx = lambda t, d: f'<div class="rx"><img src="assets/cover_flat.jpg"><div><b>{t}</b><p>{d}</p></div>{a(BOOK, T["book_cta"] + " →", "btn c")}</div>'
    sts = [('Estación 1', 'Arzt–Patient: Anamnese + Aufklärung · 23 min'), ('Estación 2', 'Arzt–Arzt: dos presentaciones · 23 min'), ('Estación 3', 'Escrito: anamnesis desde vídeo · 22 min')]
    p1 = f'''<section class="pg cv"><div class="hb"><div class="k">FACHSPRACHPRÜFUNG MEDIZIN · GUÍA GRATUITA</div><h1>La hoja de ruta completa<br>para preparar FaMED</h1></div>
<div class="meta"><div><label>Duración</label><b>8 semanas</b></div><div><label>Sesiones</label><b>54</b></div><div><label>Páginas</label><b>30</b></div></div>
<div class="sts">{''.join(f'<div><span>{s}</span>{t}</div>' for s, t in sts)}</div>
<div class="bt">{a(BOOK, f'<img src="assets/cover_flat.jpg"><div><b>{T["book_t"]}</b><span>{T["book_cta"]} →</span></div>', 'cvbook')}{logo(120)}</div></section>'''
    toc = ''.join(f'<a href="#p{pg}"><div><span>{n}</span>{t}<em>{pg:02d}</em></div></a>' for n, t, pg in TOC)
    p2 = f'''<section class="pg"><div class="in">{hd("ÍNDICE")}<h2><small>00 · ÍNDICE</small>{T["toc_t"]}</h2>
<p>Un plan de ocho semanas para organizar una preparación constante y realista, con todas las listas de casos y las sesiones diarias.</p><div class="toc" style="margin-top:6mm">{toc}</div>{rx(T["book_t"], T["book_d"])}</div>{ft(2)}</section>'''
    rows = ''.join(f'<tr><td>{d}<small>{th}</small></td>' + ''.join(f'<td>{x}<i>{dur}</i></td>' for x, dur in c) + '</tr>' for d, th, c in week_rows(5))
    p3 = f'''<section class="pg"><div class="in">{hd("SEMANA 01 / 08")}<h2><small>05 · CALENDARIO</small>{T["week"]}: {WEEK_TOPIC}</h2>
<table><tr><th>Día</th><th>{T["morning"]}</th><th>{T["afternoon"]}</th><th>{T["evening"]}</th></tr>{rows}</table>{rx(T["tip_t"], T["tip_d"])}</div>{ft(9)}</section>'''
    P4 = lambda n: f'''<section class="pg"><div class="in">{hd("LIBRO Y APP")}<h2><small>09 · RECURSOS</small>{T["products_t"]}</h2>
<div class="bk">{a(BOOK, '<img src="assets/book3d.png">')}<div><h3>{T["book_t"]}</h3><p>{T["book_d"]}</p>{a(BOOK, T["book_cta"] + " →", "btn c")}</div></div>
<div class="ap"><div><h3>{T["app_t"]}</h3><p>{T["app_d"]}</p></div>{a(APP, T["app_cta"] + " →", "btn")}</div><p class="opt">{T["optional"]}</p></div>{ft(n)}</section>'''
    D['5-klinik'] = ('Klinik — como una historia clínica: verde petróleo, campos y tablas ordenadas', css, 'd5', [p1, p2, p3, P4(29)], P4)
    return D

if __name__ == '__main__':
    for key, (desc, css, cls, pages) in designs().items():
        html = HEAD + css + f'</style></head><body class="{cls}">' + ''.join(p.replace('class="pg', f'class="pg {cls}') for p in pages) + '</body></html>'
        (W / f'design_{key}.html').write_text(html)
        print(key)
