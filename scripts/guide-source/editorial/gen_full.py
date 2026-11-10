#!/usr/bin/env python3
"""Full Spanish guide (31 pages) in each of the 5 design skins, so Felipe can compare and combine.
Content = ES edition (chapters.py / translations.py) unchanged; only layout + book/app links are new."""
import re, html as H
import gen_designs as G
from gen_designs import a, logo, ES, ES_WEEKS, T, HEAD
from translations import CASES_AN, CASES_AUF, CASES_BR, CASES_AA

G.TOTAL = 31
G.TOC[:] = [('01', 'Qué encontrarás en esta guía', 3), ('02', 'Entender el examen FaMED', 4), ('03', 'Estructura actual y tiempos', 5),
            ('04', 'Listas de casos para practicar', 6), ('05', 'Esquemas de comunicación', 9), ('06', 'Calendario: semanas 1 a 8', 10),
            ('07', 'Día del examen y lista de comprobación', 25), ('08', 'Diez errores frecuentes', 27), ('09', 'Recursos para practicar', 29),
            ('10', 'Libro y app', 30)]
BOOK, APP = G.BOOK, G.APP
BUNDLE = 'https://famedtestprep.com/PayPalCheckout?plan=bundle_3m'
T['optional'] = (f'También existe el paquete libro + 90 días de app: {a(BUNDLE, "ver el paquete y sus condiciones →", "u")}<br>'
                 'Todo es opcional: no necesitas comprar nada para usar esta guía.')
TIP = ('FaMED Protokoll 2026', 'El libro digital reúne casos, estructuras de conversación, expresiones profesionales, vocabulario y ejemplos de formulación para practicar junto a este plan.')
APPTIP = (T['app_t'], T['app_d'])
DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
SES = [T['morning'], T['afternoon'], T['evening']]

# ------------------------------------------------------------------ text → html
def link(s):
    s = H.escape(s, quote=False)
    return re.sub(r'https?://[^\s<]+', lambda m: f'<a class="u" href="{m.group(0)}">{m.group(0).replace("https://", "")}</a>', s)

def line_html(l):
    l = l.strip()
    if '"' in l:
        left, q, right = l.partition('"')
        left = left.rstrip(' —:').strip()
        quote = '"' + right
        if not left:
            return f'<p class="de">{link(quote)}</p>'
        return f'<div class="ex"><span>{link(left)}</span><span class="de">{link(quote)}</span></div>'
    m = re.match(r'^(\d+)\. (.+)$', l)
    if m and len(l) > 70:
        return f'<p class="np"><b>{m.group(1)}</b>{link(m.group(2))}</p>'
    return f'<p>{link(l)}</p>'

def body(text):
    out = []
    for block in text.strip().split('\n\n'):
        lines = [l for l in block.split('\n') if l.strip()]
        if not lines: continue
        first = lines[0]
        head = len(lines) > 1 and len(first) < 75 and not first.rstrip().endswith(('.', ':')) and not first.startswith(('•', '□', '"'))
        if head:
            m = re.match(r'^(\d+)\. (.+)$', first)
            out.append(f'<h3>{"<b>" + m.group(1) + "</b>" + link(m.group(2)) if m else link(first)}</h3>')
            lines = lines[1:]
        buf, kind = [], None
        def flush():
            nonlocal buf, kind
            if buf: out.append(f'<ul class="{kind}">' + ''.join(f'<li>{link(x)}</li>' for x in buf) + '</ul>')
            buf, kind = [], None
        for l in lines:
            if l.startswith('• ') or l.startswith('□ '):
                k = 'chk' if l.startswith('□') else 'bl'
                if kind and kind != k: flush()
                kind = k; buf.append(l[2:])
            else:
                flush(); out.append(line_html(l))
        flush()
    return '\n'.join(out)

# ------------------------------------------------------------------ generic content css
GEN = '''
.pg .in{position:absolute;left:0;right:0;top:0;bottom:23mm;overflow:hidden}
.bd p,.bd li{font-family:var(--bf);font-size:var(--fs);line-height:var(--lh);color:var(--tx)}
.bd p{margin:0 0 2.6mm}
.bd h3{font:var(--hf);color:var(--hc);margin:5mm 0 2.2mm;letter-spacing:-.01em}
.bd h3:first-child{margin-top:0}
.bd h3 b{display:inline-block;min-width:7mm;color:var(--acc)}
.bd ul{list-style:none;margin:0 0 3mm}
.bd ul li{position:relative;padding-left:5.5mm;margin:0 0 1.5mm}
.bd ul.bl li:before{content:'';position:absolute;left:.4mm;top:.62em;width:1.8mm;height:1.8mm;border-radius:50%;background:var(--acc)}
.bd ul.chk li:before{content:'';position:absolute;left:0;top:.3em;width:3.2mm;height:3.2mm;border:.4mm solid var(--acc);border-radius:.7mm}
.bd .de{font-family:var(--bf);font-style:italic;color:var(--hc)}
.bd p.de{background:var(--tint);border-left:.9mm solid var(--acc);padding:2mm 3.5mm}
.bd .ex{display:grid;grid-template-columns:52mm 1fr;gap:4mm;padding:1.6mm 0;border-bottom:.25mm solid var(--rule);font-family:var(--bf);font-size:var(--fs);line-height:1.4;color:var(--tx)}
.bd .np{display:grid;grid-template-columns:9mm 1fr;align-items:start}
.bd .np b{font:800 13pt Manrope;color:var(--acc);line-height:1.2}
.bd a.u,.u{color:var(--acc);font-weight:600;text-decoration:underline;text-decoration-thickness:.25mm;text-underline-offset:.6mm}
.bd .cols{display:grid;grid-template-columns:1fr 1fr;gap:9mm}
.bd ol{padding-left:7mm;margin:0}
.bd ol li{margin:0 0 1.1mm;padding-left:1mm}
.bd ol li::marker{color:var(--acc);font-weight:700;font-family:Inter;font-size:.85em}
.bd ol.two{columns:2;column-gap:9mm}
.bd .lede{font-size:calc(var(--fs) * 1.08)}
.pg .gap{height:5mm}
.d4 .dy p.ck{position:relative;padding-left:6mm;margin-top:1.8mm}
.d4 .dy p.ck:before{content:'';position:absolute;left:0;top:.15em;width:3.4mm;height:3.4mm;border:.4mm solid var(--coral);border-radius:.7mm;background:#fff}
.d4 .dy h4{display:flex;align-items:baseline;gap:2mm}
'''
VARS = {
    'd1': '--acc:#EB5A50;--hc:#151612;--bf:Inter;--fs:10pt;--lh:1.55;--tx:#2a2b27;--hf:800 12.5pt Manrope;--tint:#f5f3ec;--rule:#e8e6de',
    'd2': '--acc:#D9483E;--hc:#151612;--bf:Charter,Georgia,serif;--fs:10.6pt;--lh:1.55;--tx:#2a2b27;--hf:700 13pt Charter,Georgia,serif;--tint:#fff;--rule:#d9d6cc',
    'd3': '--acc:#EB5A50;--hc:#14213D;--bf:Inter;--fs:10pt;--lh:1.55;--tx:#2b3550;--hf:800 12.5pt Manrope;--tint:#f2f5fa;--rule:#d8deea',
    'd4': '--acc:#EB5A50;--hc:#151612;--bf:Inter;--fs:10pt;--lh:1.55;--tx:#2a2b27;--hf:400 15pt "New York",Georgia,serif;--tint:#F3EEE4;--rule:#cfc8b8',
    'd5': '--acc:#0E5E63;--hc:#14292b;--bf:Inter;--fs:9.8pt;--lh:1.55;--tx:#22393b;--hf:700 12pt Manrope;--tint:#E7F1F1;--rule:#e1ebeb',
}
FIT = '''<script>
document.fonts.ready.then(()=>{let rep=[];document.querySelectorAll('.pg').forEach(pg=>{const el=pg.querySelector('.in'),b=pg.querySelector('.bd');if(!el||!b)return;let z=1;
while(el.scrollHeight>el.clientHeight+1&&z>0.72){z-=0.02;b.style.zoom=z}
if(z<0.995)rep.push(pg.dataset.n+':'+z.toFixed(2)+(el.scrollHeight>el.clientHeight+1?'!OVERFLOW':''))});document.body.dataset.fit=rep.join(' ')||'ok';});
</script>'''

# ------------------------------------------------------------------ skins: head / foot / tip / week
BAR = '<div class="bar"><i style="background:var(--ink)"></i><i style="background:var(--coral)"></i><i style="background:var(--sun)"></i></div>'
BAND = '<div class="band"><i style="width:12mm;background:var(--ink)"></i><i style="width:4mm;background:var(--coral)"></i><i style="width:4mm;background:var(--sun)"></i></div>'

def dots(on):
    return '<div class="wk">' + ''.join(f'<i class="on">{i}</i>' if i == on else f'<i>{i}</i>' for i in range(1, 9)) + '</div>'

SK = {
 'd1': dict(
    pre=BAR,
    head=lambda k, t, num, on: f'<div class="hd"><span>FaMED Prep · Guía de 8 semanas</span><span>{k}</span></div><h2><small>{num} · {k}</small>{t}</h2>',
    ft=lambda n: f'<div class="ft">{a(BOOK, T["foot_book"])}<span>{n} / {G.TOTAL}</span></div>',
    tip=lambda t, d, href=BOOK, cta=T['book_cta'], img='assets/book3d_s.png': f'<div class="tip">' + (f'<img src="{img}">' if img else '') + f'<div><b>{t}</b><p>{d}</p></div>{a(href, cta + " →", "btn")}</div>'),
 'd2': dict(
    pre=BAND,
    head=lambda k, t, num, on: f'<div class="hd"><span>Guía FaMED · 8 semanas</span><span>{k}</span></div><h2><span style="color:var(--coral);font-family:Manrope;font-weight:800;margin-right:4mm">{num}</span>{t}</h2>',
    ft=lambda n: f'<div class="ft"><span>{n}</span>{a(BOOK, T["foot_book"])}</div>',
    tip=lambda t, d, href=BOOK, cta=T['book_cta'], img='assets/cover_flat.jpg': f'<div class="side">' + (f'<img src="{img}">' if img else '') + f'<div><b>{t}</b><p>{d}</p></div>{a(href, cta + " →", "lnk")}</div>'),
 'd3': dict(
    pre='',
    head=lambda k, t, num, on: f'<div class="top"><h2><small>{num} · {k}</small>{t}</h2>{dots(on)}</div><div class="gap"></div>',
    ft=lambda n: f'<div class="ft"><span>FaMED Prep · Guía de 8 semanas · {n}/{G.TOTAL}</span>{a(BOOK, T["foot_book"])}</div>',
    tip=lambda t, d, href=BOOK, cta=T['book_cta'], img='assets/book3d_s.png': f'<div class="note">' + (f'<img src="{img}">' if img else '') + f'<div><b>{t}</b><p>{d}</p></div>{a(href, cta + " →", "btn")}</div>'),
 'd4': dict(
    pre='',
    head=lambda k, t, num, on: f'<div class="hd"><span>FaMED Prep</span><span>{k}</span></div><div class="big"><b>{num}</b><h2>{t}</h2></div>',
    ft=lambda n: f'<div class="ft"><span>{n} / {G.TOTAL}</span>{a(BOOK, T["foot_book"])}</div>',
    tip=lambda t, d, href=BOOK, cta=T['book_cta'], img='assets/book3d_s.png': a(href, (f'<img src="{img}">' if img else '') + f'<b>{t}</b><p>{d}</p><span>{cta} →</span>', 'pull')),
 'd5': dict(
    pre='',
    head=lambda k, t, num, on: f'<div class="hd">{logo(70)}<span>{k.upper()}</span></div><h2><small>{num} · {k.upper()}</small>{t}</h2>',
    ft=lambda n: f'<div class="ft"><span>FaMED-PREP / GUIA-8W / S.{n:02d}</span>{a(BOOK, T["foot_book"])}</div>',
    tip=lambda t, d, href=BOOK, cta=T['book_cta'], img='assets/cover_flat.jpg': f'<div class="rx">' + (f'<img src="{img}">' if img else '<i></i>') + f'<div><b>{t}</b><p>{d}</p></div>{a(href, cta + " →", "btn c")}</div>'),
}

def split(act):
    x, _, d = act.partition('|'); return x.strip(), d.strip()

def week_html(sk, rows):
    if sk == 'd1':
        return ''.join(f'<div class="day"><h4>{d}<small>{th}</small></h4><ul>' + ''.join(f'<li><b>{l}</b><span>{x}</span><i>{u}</i></li>' for l, (x, u) in zip(SES, c)) + '</ul></div>' for d, th, c in rows)
    if sk in ('d2', 'd5'):
        tr = ''.join(f'<tr><td>{d}<small>{th}</small></td>' + ''.join(f'<td>{x}<i>{u}</i></td>' for x, u in c) + '</tr>' for d, th, c in rows)
        return f'<table><tr><th>Día</th><th>{SES[0]}</th><th>{SES[1]}</th><th>{SES[2]}</th></tr>{tr}</table>'
    if sk == 'd3':
        return ''.join(f'<div class="card"><h4>{d}<span>{th}</span></h4><ul>' + ''.join(f'<li><span><b>{l}</b>{x}<i>{u}</i></span></li>' for l, (x, u) in zip(SES, c)) + '</ul></div>' for d, th, c in rows)
    if sk == 'd4':
        return '<div class="days">' + ''.join(f'<div class="dy"><h4>{d}<small>{th}</small></h4>' + ''.join(f'<p class="ck"><b>{l}</b>{x} · {u}</p>' for l, (x, u) in zip(SES, c)) + '</div>' for d, th, c in rows) + '</div>'

# ------------------------------------------------------------------ assemble
def build(key, desc, css, cls, sample_pages, P4):
    s = SK[cls]; pages = []
    def page(k, t, num, inner, extra='', on=0, bd_cls=''):
        n = len(pages) + 1
        pages.append(f'<section class="pg">{s["pre"]}<div class="in">{s["head"](k, t, num, on)}<div class="bd {bd_cls}">{inner}</div>{extra}</div>{s["ft"](n)}</section>')
    pages.append(sample_pages[0])           # 1 cover
    pages.append(sample_pages[1])           # 2 contents
    page('Introducción', ES['intro'][0], '01', body(ES['intro'][1]))
    page('El examen', ES['exam'][0], '02', body(ES['exam'][1]))
    page('El examen', ES['format'][0], '03', body(ES['format'][1]))
    cases = f'<p class="lede">{ES["cases_note"]}</p><div class="cols">' + ''.join(
        f'<div><h3>{t}</h3><ol>' + ''.join(f'<li>{x}</li>' for x in items) + '</ol></div>' for t, items in [(ES['an'], CASES_AN), (ES['auf'], CASES_AUF)]) + '</div>'
    page('Casos', ES['cases'], '04', cases)
    page('Casos', ES['br'], '04', f'<p class="lede">{ES["br_note"]}</p><ol class="two">' + ''.join(f'<li>{x}</li>' for x in CASES_BR) + '</ol>', s['tip'](*TIP))
    page('Casos', ES['aa'], '04', f'<p class="lede">{ES["aa_note"]}</p><ol class="two">' + ''.join(f'<li>{x}</li>' for x in CASES_AA) + '</ol>')
    page('Esquemas', ES['framework'][0], '05', body(ES['framework'][1]))
    for w, (topic, rows) in enumerate(ES_WEEKS, 1):
        groups = [(0, rows[:5]), (5, rows[5:])] if w < 8 else [(0, rows)]
        for start, grp in groups:
            rr = []
            for i, row in enumerate(grp, start):
                name = 'Día del examen' if (w == 8 and i == 4) else DAYS[i]
                rr.append((name, row[0], [split(x) for x in row[1:]]))
            extra = ''
            if start == 5:   # weekend pages have room: book + app
                extra = s['tip'](*TIP) + '<div style="height:4mm"></div>' + s['tip'](*APPTIP, href=APP, cta=T['app_cta'], img='')
            elif w == 8:
                extra = s['tip'](*TIP)
            page(f'Semana {w}', f'Semana {w}: {topic}', '06', week_html(cls, rr), extra, on=w, bd_cls='wkp')
    page('Día del examen', ES['examday'][0], '07', body(ES['examday'][1]))
    page('Día del examen', ES['check'][0], '07', body(ES['check'][1]))
    page('Errores', ES['mistakes1'][0], '08', body(ES['mistakes1'][1]))
    page('Errores', ES['mistakes2'][0], '08', body(ES['mistakes2'][1]))
    page('Recursos', ES['resources'][0], '09', body(ES['resources'][1]), s['tip'](*APPTIP, href=APP, cta=T['app_cta'], img=''))
    pages.append(P4(len(pages) + 1))        # 30 book + app
    page('Cierre', ES['closing'][0], '10', body(ES['closing'][1]), s['tip'](*TIP))
    assert len(pages) == 31, len(pages)
    pages = [p.replace('<section class="pg', f'<section id="p{i}" data-n="{i}" class="pg {cls}', 1) for i, p in enumerate(pages, 1)]
    return (HEAD + css + GEN + f'.{cls}{{{VARS[cls]}}}' + f'</style></head><body class="{cls}">' + ''.join(pages) + FIT + '</body></html>')

if __name__ == '__main__':
    for key, (desc, css, cls, sp, P4) in G.designs().items():
        (G.W / f'full_{key}.html').write_text(build(key, desc, css, cls, sp, P4))
        print(key)
