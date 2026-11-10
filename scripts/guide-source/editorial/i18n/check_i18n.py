#!/usr/bin/env python3
"""Usage: python3 check_i18n.py <loc>  — structural check of content_<loc>.py against content_es.py."""
import sys, re, importlib.util
from collections import Counter
from pathlib import Path
D = Path(__file__).parent

def load(loc):
    spec = importlib.util.spec_from_file_location(f'c_{loc}', D / f'content_{loc}.py')
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def texts(x):
    if isinstance(x, str): yield x
    elif isinstance(x, (list, tuple)):
        for y in x: yield from texts(y)
    elif isinstance(x, dict):
        for y in x.values(): yield from texts(y)

def sig(s):
    return dict(lines=s.count('\n'), bullets=len(re.findall(r'^• ', s, re.M)), boxes=s.count('□'),
                urls=sorted(re.findall(r'https?://\S+', s)), de=Counter(re.findall(r'"[^"]+"', s)))

loc = sys.argv[1]
es, tr = load('es'), load(loc)
err = []
if set(es.C) != set(tr.C): err.append(f'C keys differ: {set(es.C) ^ set(tr.C)}')
for k in es.C:
    a, b = es.C[k], tr.C.get(k)
    if type(a) != type(b): err.append(f'C[{k}] type'); continue
    pa, pb = list(texts(a)), list(texts(b))
    if len(pa) != len(pb): err.append(f'C[{k}] parts'); continue
    for i, (x, y) in enumerate(zip(pa, pb)):
        sx, sy = sig(x), sig(y)
        for f in sx:
            if sx[f] != sy[f]: err.append(f'C[{k}][{i}] {f}: es={sx[f]} {loc}={sy[f]}')
if len(es.WEEKS) != len(tr.WEEKS): err.append('WEEKS count')
for w, ((ta, ra), (tb, rb)) in enumerate(zip(es.WEEKS, tr.WEEKS), 1):
    if len(ra) != len(rb): err.append(f'week {w} rows'); continue
    for r, (x, y) in enumerate(zip(ra, rb)):
        if len(x) != len(y): err.append(f'week {w} row {r} cells')
        for cx, cy in zip(x[1:], y[1:]):
            if ('|' in cx) != ('|' in cy): err.append(f'week {w} row {r}: "|" duration separator missing')
if hasattr(tr, 'UI'):
    for k, v in es.UI.items():
        u = tr.UI.get(k)
        if u is None: err.append(f'UI missing {k}')
        elif isinstance(v, list) and len(v) != len(u): err.append(f'UI {k} length')
    if '{n}' not in tr.UI.get('week_title', '') or '{topic}' not in tr.UI.get('week_title', ''): err.append('UI week_title needs {n} and {topic}')
else:
    err.append('UI dict missing')
print('\n'.join(err) if err else f'{loc}: OK')
sys.exit(1 if err else 0)
