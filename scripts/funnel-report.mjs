#!/usr/bin/env node
// Funnel report (read-only): free guide → app/book purchase, and blog visits → app.
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/funnel-report.mjs [days=30]
// (NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL also work.) Felipe's own accounts are excluded.
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const days = Number(process.argv[2] || 30);
const since = new Date(Date.now() - days * 864e5).toISOString();
const ME = new Set(['dr.felipeyanez@gmail.com', 'dr.felipeyane@gmail.com', 'eunacomapp@gmail.com', 'famedvorbereitung@gmail.com', 'test@example.com']);
const WINDOW_DAYS = 14; // a purchase within 14 days of the guide counts as "after the guide"

async function get(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res.json();
}
const [guides, leads, fulfil, guests, users, blogCtx, events] = await Promise.all([
  get(`guide_requests?select=email,locale,created_at,marketing_requested,confirmed_at&created_at=gte.${since}&limit=5000`),
  get(`leads?select=email,source,created_at&created_at=gte.${since}&limit=5000`),
  get(`payment_fulfillments?select=user_id,plan_id,provider,created_at&created_at=gte.${since}&limit=5000`),
  get(`guest_purchases?select=email,plan_id,status,paid_at&paid_at=gte.${since}&limit=5000`),
  get(`users?select=id,email&limit=20000`),
  get(`blog_purchase_context?select=session_id,entry_slug,entry_locale,created_at&created_at=gte.${since}&limit=5000`),
  get(`purchase_events?select=session_id,event,plan_id&created_at=gte.${since}&limit=50000`),
]);
const lc = (e) => (e || '').toLowerCase().trim();
const emailOf = Object.fromEntries(users.map((u) => [u.id, lc(u.email)]));
const g = guides.filter((x) => !ME.has(lc(x.email)));

// Sales (deduplicated by email + plan + day)
const salesMap = new Map();
for (const f of fulfil) { const e = emailOf[f.user_id]; if (e && !ME.has(e)) salesMap.set(`${e}|${f.plan_id}|${f.created_at.slice(0, 10)}`, { email: e, plan: f.plan_id, at: f.created_at }); }
for (const p of guests) if (['paid', 'claimed'].includes(p.status) && p.paid_at && !ME.has(lc(p.email))) salesMap.set(`${lc(p.email)}|${p.plan_id}|${p.paid_at.slice(0, 10)}`, { email: lc(p.email), plan: p.plan_id, at: p.paid_at });
const sales = [...salesMap.values()].sort((a, b) => a.at.localeCompare(b.at));

const firstGuide = {};
for (const x of g) { const e = lc(x.email); if (!firstGuide[e] || x.created_at < firstGuide[e]) firstGuide[e] = x.created_at; }
const afterGuide = sales.filter((s) => firstGuide[s.email] && s.at >= firstGuide[s.email] && (new Date(s.at) - new Date(firstGuide[s.email])) / 864e5 <= WINDOW_DAYS);
const buyersAfterGuide = new Set(afterGuide.map((s) => s.email));
const hours = afterGuide.map((s) => (new Date(s.at) - new Date(firstGuide[s.email])) / 36e5).sort((a, b) => a - b);

const count = (arr, f) => arr.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
const pageOf = (src) => (src || '').split(':')[1] || '(no page recorded)';

console.log(`\nFaMED funnel, last ${days} days (since ${since.slice(0, 10)}), without Felipe's accounts\n`);
console.log('1) Free guide requests');
console.log('   total:', g.length, '| by language:', count(g, (x) => x.locale));
console.log('   opted into marketing:', g.filter((x) => x.marketing_requested).length, '| confirmed it:', g.filter((x) => x.confirmed_at).length);
console.log('   by page (new requests only):', count(leads.filter((l) => (l.source || '').startsWith('website_guide_request_v2') && !ME.has(lc(l.email))), (l) => pageOf(l.source)));
console.log('\n2) Purchases');
console.log('   total:', sales.length, count(sales, (s) => s.plan));
console.log(`   after the guide (≤${WINDOW_DAYS} days):`, afterGuide.length, `from ${buyersAfterGuide.size} people`, count(afterGuide, (s) => s.plan));
console.log('   guide → purchase conversion:', g.length ? `${((buyersAfterGuide.size / new Set(g.map((x) => lc(x.email))).size) * 100).toFixed(1)}%` : '-');
if (hours.length) console.log('   hours from guide to purchase (median):', hours[Math.floor(hours.length / 2)].toFixed(1), '| within 48 h:', hours.filter((h) => h <= 48).length);
console.log('   without guide:', sales.length - afterGuide.length);

console.log('\n3) Blog / guide-email visits that reached the app');
const ses = new Set(blogCtx.map((b) => b.session_id));
const ev = (name) => new Set(events.filter((e) => e.event === name && ses.has(e.session_id)).map((e) => e.session_id)).size;
console.log('   sessions:', ses.size, '| by entry:', count(blogCtx, (b) => b.entry_slug));
console.log('   viewed prices:', ev('pricing_view'), '| checkout:', ev('checkout_view'), '| order created:', ev('order_created'));
console.log('\nNote: book purchases through the direct PayPal link are matched to the guide by email (section 2), not by session.\n');
