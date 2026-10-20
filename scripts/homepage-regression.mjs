import assert from 'node:assert/strict';
import postcss from 'postcss';

export function verifyHomepage(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  const hero = main.match(/<section\b[^>]*>([\s\S]*?)<\/section>/)?.[1] || '';
  assert.ok((hero.match(/<a\b/g) || []).length >= 2, 'Homepage hero lost its primary actions');
  for (const name of ['Anamnese', 'Aufklärung', 'Arzt–Arzt', 'Arztbrief']) assert.ok(main.includes(name), `Missing practice section: ${name}`);
  assert.ok(main.includes('/images/products/book-cover.png'), 'Homepage lost the actual book cover');
}
export function verifyPalette(css) {
  // The public site has a light palette. OS dark preference must not turn its
  // backgrounds black while its fixed slate typography stays dark.
  const root = postcss.parse(css);
  for (const mode of ['light', 'dark']) {
    let background;
    root.walkRules(rule => {
      if (!rule.selector.split(',').some(s => s.trim() === ':root')) return;
      let parent = rule.parent;
      while (parent && parent.type !== 'root') {
        if (parent.type === 'atrule' && parent.name === 'media' && /prefers-color-scheme/.test(parent.params) && !parent.params.includes(mode)) return;
        parent = parent.parent;
      }
      rule.walkDecls('--background', declaration => { background = declaration.value.toLowerCase(); });
    });
    assert.ok(['#fff', '#ffffff', 'white'].includes(background), `${mode} preference produces unsupported background ${background}`);
  }
}
if (process.argv[1]?.endsWith('homepage-regression.mjs')) {
  const origin = process.argv[2] || 'https://famed-vorbereitung.com';
  for (const path of ['/', '/ar']) {
    const html = await fetch(origin + path).then(r => { assert.equal(r.status, 200); return r.text(); });
    const cssPaths = [...new Set([...html.matchAll(/href="([^\"]+\.css[^\"]*)"/g)].map(m => m[1].replaceAll('&amp;', '&')))];
    const css = (await Promise.all(cssPaths.map(p => fetch(new URL(p, origin)).then(r => r.text())))).join('\n');
    const failures = [];
    for (const check of [() => verifyHomepage(html), () => verifyPalette(css)]) { try { check(); } catch (e) { failures.push(e.message); } }
    console.log(path, failures.length ? 'FAIL: ' + failures.join('; ') : 'PASS: designed homepage and both OS colour preferences');
    if (failures.length) process.exitCode = 1;
  }
}
