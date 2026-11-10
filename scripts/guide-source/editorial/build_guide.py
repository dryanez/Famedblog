#!/usr/bin/env python3
"""Builds the free FaMED 8-week guide (Editorial design) for one or more locales.
usage: python3 build_guide.py es en de ...   → out/famed-study-guide-<loc>.html (+ render.sh → PDF)
Content: i18n/content_<loc>.py (C, WEEKS, UI). German case lists shared from the Famedblog guide-source."""
import sys, re, html as H, importlib.util
from pathlib import Path
W = Path(__file__).parent
sys.path.insert(0, str(W.parent / 'famed-book-cover'))
sys.path.insert(0, str(W.parent / 'tmp/famedblog-seo/scripts/guide-source'))
from gen import logo
from translations import CASES_AN, CASES_AUF, CASES_BR, CASES_AA

SITE = {'en': '', 'es': '/es', 'ar': '/ar', 'de': '', 'ru': '/ru', 'fr': '/fr', 'tr': '/tr'}
BLOG = {'en': '/blog', 'es': '/es/blog', 'ar': '/ar/blog', 'de': '/de/blog', 'ru': '/blog', 'fr': '/blog', 'tr': '/blog'}
BODY_FONT = {'ru': '-apple-system,"SF Pro Text",system-ui,sans-serif', 'tr': '-apple-system,"SF Pro Text",system-ui,sans-serif',
             'ar': '"SF Arabic","Geeza Pro",sans-serif'}
HEAD_FONT = {'ar': '"SF Arabic","Geeza Pro",sans-serif', 'tr': '"New York",Georgia,serif', 'ru': '"New York",Georgia,serif'}
TOTAL = 30

def load(loc):
    spec = importlib.util.spec_from_file_location(f'c_{loc}', W / 'i18n' / f'content_{loc}.py')
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def build(loc):
    M = load(loc); C, WEEKS, U = M.C, M.WEEKS, M.UI
    rtl = loc == 'ar'
    if loc != 'en':  # drop "the original English PDF is kept unchanged": the English guide is now this same edition
        t, x = C['intro']; C['intro'] = (t, x[:x.rstrip('.').rfind('.') + 1])
    BOOK = f'https://www.paypal.com/ncp/payment/DQCLR47JB5DXU?utm_source=guide_pdf&utm_medium=pdf&utm_campaign=guide_book_{loc}'
    APP = f'https://famedtestprep.com/dashboard?utm_source=blog&utm_medium=guide_pdf&utm_campaign=guide_app&utm_content=guide-pdf&utm_locale={loc}'
    BUNDLE = 'https://famedtestprep.com/PayPalCheckout?plan=bundle_3m'

    def fixurl(s):
        s = re.sub(r'https://famed-vorbereitung\.com/(es|ar)/blog', 'https://famed-vorbereitung.com' + BLOG[loc], s)
        return re.sub(r'https://famed-vorbereitung\.com/(es|ar)(?![\w/])', 'https://famed-vorbereitung.com' + SITE[loc], s)

    def a(href, inner, cls=''):
        return f'<a href="{href}" class="{cls}">{inner}</a>'

    def link(s):
        s = H.escape(fixurl(s), quote=False)
        return re.sub(r'https?://[^\s<]+', lambda m: f'<a class="u" dir="ltr" href="{m.group(0)}">{m.group(0).replace("https://", "")}</a>', s)

    def line_html(l):
        l = l.strip()
        if '"' in l:
            left, _, right = l.partition('"')
            left = left.rstrip(' —:').strip(); q = '"' + right
            if not left: return f'<p class="de" dir="ltr">{link(q)}</p>'
            return f'<div class="ex"><span>{link(left)}</span><span class="de" dir="ltr">{link(q)}</span></div>'
        m = re.match(r'^(\d+)\. (.+)$', l)
        if m and len(l) > 70: return f'<p class="np"><b>{m.group(1)}</b><span>{link(m.group(2))}</span></p>'
        return f'<p>{link(l)}</p>'

    def body(text):
        out = []
        for block in text.strip().split('\n\n'):
            lines = [l for l in block.split('\n') if l.strip()]
            if not lines: continue
            first = lines[0]
            if len(lines) > 1 and len(first) < 80 and not first.rstrip().endswith(('.', ':', '։')) and not first.startswith(('•', '□', '"')):
                m = re.match(r'^(\d+)\. (.+)$', first)
                out.append(f'<h3>{"<b>" + m.group(1) + "</b>" + link(m.group(2)) if m else link(first)}</h3>'); lines = lines[1:]
            buf, kind = [], None
            def flush():
                nonlocal buf, kind
                if buf: out.append(f'<ul class="{kind}">' + ''.join(f'<li>{link(x)}</li>' for x in buf) + '</ul>')
                buf, kind = [], None
            for l in lines:
                if l.startswith(('• ', '□ ')):
                    k = 'chk' if l.startswith('□') else 'bl'
                    if kind and kind != k: flush()
                    kind = k; buf.append(l[2:])
                else:
                    flush(); out.append(line_html(l))
            flush()
        return '\n'.join(out)

    hd = lambda r: f'<div class="hd"><span>FaMED Prep</span><span>{r}</span></div>'
    ft = lambda n: f'<div class="ft"><span dir="ltr">{n} / {TOTAL}</span>{a(BOOK, U["foot_book"] + (" ←" if rtl else " →"))}</div>'
    arr = '←' if rtl else '→'
    def pull(t, d, href=BOOK, cta=U['book_cta'], img=True, cls=''):
        return a(href, (f'<img src="assets/book3d_s.png">' if img else '') + f'<b>{t}</b><p>{d}</p><span>{cta} {arr}</span>', 'pull ' + cls)
    tip = lambda: pull('FaMED Protokoll 2026', U['tip_d'])
    apptip = lambda: pull(U['app_t'], U['app_d'], APP, U['app_cta'], False, 'dark')
    notes = lambda: f'<div class="notes"><b>{U["notes"]}</b>' + '<i></i>' * 6 + '</div>'

    pages = []
    def page(k, t, num, inner, extra=''):
        n = len(pages) + 1
        pages.append(f'<section class="pg"><div class="in">{hd(k)}<div class="big"><b>{num}</b><h2>{t}</h2></div><div class="bd">{inner}</div>{extra}</div>{ft(n)}</section>')

    # 1 cover
    pages.append(f'''<section class="pg cv"><div class="k"><span>FaMED Prep</span><span>{U["free_guide"]}</span></div><div class="eight">8</div>
<h1>{U["cover_a"]} <i>{U["cover_b"]}</i></h1><div class="s">{U["cover_line"]}</div>
<div class="bt">{a(BOOK, f'<img src="assets/cover_flat.jpg"><div><b>FaMED Protokoll 2026</b><span>{U["book_cta"]} {arr}</span></div>', 'cvbook')}{logo(120)}</div></section>''')
    # 2 intro + clickable contents
    tocpages = [2, 3, 4, 5, 8, 9, 24, 26, 28, 29]
    toc = ''.join(f'<a href="#p{pg}"><div><span>{i:02d}</span>{t}<em>{pg}</em></div></a>' for i, (t, pg) in enumerate(zip(U['toc_items'], tocpages), 1))
    page(U['k_intro'], C['intro'][0], '01', body(C['intro'][1]), f'<div class="toc mini"><b>{U["toc_t"]}</b>{toc}</div><div style="height:5mm"></div>' + tip())
    page(U['k_exam'], C['exam'][0], '02', body(C['exam'][1]))
    page(U['k_exam'], C['format'][0], '03', body(C['format'][1]))
    cases = f'<p class="lede">{link(C["cases_note"])}</p><div class="cols">' + ''.join(
        f'<div><h3>{t}</h3><ol>' + ''.join(f'<li dir="ltr">{x}</li>' for x in items) + '</ol></div>' for t, items in [(C['an'], CASES_AN), (C['auf'], CASES_AUF)]) + '</div>'
    page(U['k_cases'], C['cases'], '04', cases)
    page(U['k_cases'], C['br'], '04', f'<p class="lede">{link(C["br_note"])}</p><ol class="two">' + ''.join(f'<li dir="ltr">{x}</li>' for x in CASES_BR) + '</ol>', tip())
    page(U['k_cases'], C['aa'], '04', f'<p class="lede">{link(C["aa_note"])}</p><ol class="two">' + ''.join(f'<li dir="ltr">{x}</li>' for x in CASES_AA) + '</ol>')
    page(U['k_frame'], C['framework'][0], '05', body(C['framework'][1]))
    for w, (topic, rows) in enumerate(WEEKS, 1):
        groups = [(0, rows[:5]), (5, rows[5:])] if w < 8 else [(0, rows)]
        for start, grp in groups:
            days = ''
            for i, row in enumerate(grp, start):
                name = U['exam_day'] if (w == 8 and i == 4) else U['days'][i]
                acts = ''
                for lab, act in zip(U['sessions'], row[1:]):
                    x, _, dur = act.partition('|')
                    acts += f'<p class="ck"><b>{lab}</b>{link(x.strip())} <span class="dur">· {dur.strip()}</span></p>'
                days += f'<div class="dy"><h4>{name}<small>{link(row[0])}</small></h4>{acts}</div>'
            extra = (tip() + '<div style="height:4mm"></div>' + apptip() + notes()) if start == 5 else (tip() if w == 8 else '')
            page(U['k_week'] + f' {w}', U['week_title'].format(n=w, topic=topic), '06', f'<div class="days">{days}</div>', extra)
    page(U['k_examday'], C['examday'][0], '07', body(C['examday'][1]))
    page(U['k_examday'], C['check'][0], '07', body(C['check'][1]))
    page(U['k_mistakes'], C['mistakes1'][0], '08', body(C['mistakes1'][1]))
    page(U['k_mistakes'], C['mistakes2'][0], '08', body(C['mistakes2'][1]))
    page(U['k_res'], C['resources'][0], '09', body(C['resources'][1]), apptip())
    n = len(pages) + 1
    pages.append(f'''<section class="pg"><div class="full">{hd(U["k_bookapp"])}{a(BOOK, '<img src="assets/book3d.png">', 'bimg')}
<div class="tx"><h3>FaMED Protokoll 2026</h3><p>{U["book_d"]}</p>{a(BOOK, U["book_cta"] + " " + arr, "btn")}</div>
<div class="ap"><div><h4>{U["app_t"]}</h4><p>{U["app_d"]}</p></div>{a(APP, U["app_cta"] + " " + arr, "btn")}</div>
<p class="opt">{U["bundle"]} {a(BUNDLE, U["bundle_cta"] + " " + arr, "u")}<br>{U["optional"]}</p>{ft(n)}</div></section>''')
    page(U['k_closing'], C['closing'][0], '10', body(C['closing'][1]), tip())
    assert len(pages) == TOTAL, len(pages)
    pages = [p.replace('<section class="pg', f'<section id="p{i}" data-n="{i}" class="pg d4', 1) for i, p in enumerate(pages, 1)]

    css = (W / 'editorial.css').read_text()
    bf = BODY_FONT.get(loc, 'Inter'); hf = HEAD_FONT.get(loc, '"New York",Georgia,serif')
    extra_css = f'''
.d4{{--acc:#EB5A50;--hc:#151612;--bf:{bf};--hfam:{hf};--fs:10pt;--lh:1.55;--tx:#2a2b27;--hf:400 15pt {hf};--tint:#F3EEE4;--rule:#cfc8b8}}
.d4 .cv h1,.d4 h2,.d4 .toc div,.d4 .dy h4,.d4 .pull b,.d4 .full h3,.d4 .full .ap h4,.d4 .cvbook b,.d4 .lead{{font-family:{hf}}}
.d4 p,.d4 .hd,.d4 .ft,.d4 .cv .s,.d4 .dy small,.d4 .pull span,.d4 .btn,.d4 .toc em{{font-family:{bf}}}
.d4 .dy p.ck{{position:relative;padding-inline-start:6mm;margin-top:1.8mm}}
.d4 .dy p.ck:before{{content:'';position:absolute;inset-inline-start:0;top:.15em;width:3.4mm;height:3.4mm;border:.4mm solid var(--coral);border-radius:.7mm;background:#fff}}
.d4 .dy p.ck b{{margin-inline-end:1.5mm}}
.d4 .dur{{white-space:nowrap;color:#8a8b84}}
svg.logo{{direction:ltr;unicode-bidi:isolate}}
.d4 .dy h4{{display:flex;align-items:baseline;gap:2mm;flex-wrap:wrap}}
.d4 .pull.dark{{background:var(--ink)}}
.d4 .toc.mini{{margin-top:5mm;border-top:.6mm solid var(--ink);padding-top:2mm}}
.d4 .toc.mini>b{{display:block;font:700 7.5pt var(--bf);letter-spacing:.14em;text-transform:uppercase;color:#6b6c66;margin-bottom:1mm;column-span:all}}
.d4 .toc.mini div{{padding:2mm 0;font-size:10.5pt}}
.d4 .notes{{margin-top:6mm;border-top:.6mm solid var(--ink);padding-top:3mm}}
.d4 .notes b{{font:700 7.5pt var(--bf);letter-spacing:.14em;text-transform:uppercase;color:#6b6c66}}
.d4 .notes i{{display:block;height:9mm;border-bottom:.25mm solid #cfc8b8}}
'''
    rtl_css = '''
.d4 .cv .eight{right:auto;left:6mm}.d4 .cv h1,.d4 .cv .s{left:auto;right:16mm;text-align:right}
.d4 .full img{left:auto;right:16mm}.d4 .full .tx{left:16mm;right:112mm}.d4 .full .opt{left:auto;right:16mm}
.d4 .pull img{float:left;margin-left:0;margin-right:3mm}
.bd ul li{padding-left:0;padding-right:5.5mm}.bd ul.bl li:before{left:auto;right:.4mm}.bd ul.chk li:before{left:auto;right:0}
.bd ol{padding-left:0;padding-right:7mm}.bd ol[dir],.bd li[dir]{direction:ltr;text-align:right}
.d4 .hd,.d4 .ft,.d4 .k,.d4 .s,.d4 .toc,.d4 .pull span,.d4 .btn,.d4 .notes b{letter-spacing:0!important}
.bd .ex{grid-template-columns:52mm 1fr}
.d4 .toc em{margin-left:0;margin-right:auto}
''' if rtl else ''
    import gen_full as GF
    html = (f'<!doctype html><html lang="{loc}" dir="{"rtl" if rtl else "ltr"}"><head><meta charset="utf-8"><title>FaMED · {U["toc_t"]}</title><style>'
            + GF.HEAD.split('<style>', 1)[1] + css + GF.GEN + extra_css + rtl_css + f'</style></head><body class="d4">' + ''.join(pages) + GF.FIT + '</body></html>')
    out = W / 'out' / f'famed-study-guide-{loc}.html'
    out.write_text(html.replace('src="assets/', 'src="../assets/').replace('url(assets/', 'url(../assets/'))
    return out

if __name__ == '__main__':
    for loc in sys.argv[1:]:
        print(build(loc))
