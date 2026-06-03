// Self-contained BoldKit (neo-brutalist) CSS for the static SEO landing pages.
// Mirrors the design tokens in src/index.css but ships zero JS — these pages are
// pure HTML so crawlers (and humans on slow links) get full content instantly.

export const CSS = `
:root {
  --bg: hsl(48 50% 97%);
  --fg: hsl(240 10% 8%);
  --card: hsl(0 0% 100%);
  --primary: hsl(38 96% 54%);
  --secondary: hsl(174 62% 56%);
  --accent: hsl(49 100% 71%);
  --muted: hsl(48 20% 92%);
  --muted-fg: hsl(240 4% 40%);
  --border: hsl(240 10% 8%);
  --shadow: hsl(240 10% 8%);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Space Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
a { color: inherit; }
h1, h2, h3, h4 { font-family: 'Syne', sans-serif; letter-spacing: -0.03em; }

/* grid background */
.grid-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(hsl(240 10% 8% / 0.08) 1px, transparent 1px),
    linear-gradient(90deg, hsl(240 10% 8% / 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* header */
.header {
  position: sticky; top: 0; z-index: 100;
  height: 56px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; background: var(--bg); border-bottom: 3px solid var(--border);
}
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.logo-name {
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px;
  letter-spacing: -0.03em; text-transform: uppercase; line-height: 1;
}
.header-nav { display: flex; gap: 6px; }
.nav-link {
  font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none; padding: 6px 12px; border: 2px solid transparent;
  color: var(--muted-fg); transition: all .15s;
}
.nav-link:hover { color: var(--fg); }
.nav-link.active { color: var(--fg); border-color: var(--border); background: var(--primary); }
.header-link {
  font-size: 11px; letter-spacing: 0.08em; color: var(--muted-fg); text-decoration: none;
}
.header-link:hover { color: var(--fg); }
.header-actions { display: flex; align-items: center; gap: 12px; }
.star-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px;
  border: 3px solid var(--border); background: var(--primary); cursor: pointer;
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: var(--fg);
  text-decoration: none; letter-spacing: 0.06em; line-height: 1; box-shadow: 3px 3px 0 var(--shadow);
  transition: all 0.12s;
}
.star-btn:hover { translate: 3px 3px; box-shadow: none; }
.star-icon { display: inline-flex; align-items: center; justify-content: center; font-size: 15px; line-height: 1; transform: translateY(-1px); }
@media (max-width: 480px) { .header-link { display: none; } }

/* layout */
.wrap { flex: 1; width: 100%; max-width: 880px; margin: 0 auto; padding: 56px 24px 80px; position: relative; z-index: 1; }

/* breadcrumb */
.crumbs { font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted-fg); margin-bottom: 28px; }
.crumbs a { text-decoration: none; }
.crumbs a:hover { color: var(--fg); text-decoration: underline; }
.crumbs .sep { margin: 0 8px; opacity: .5; }
.crumbs .current { color: var(--fg); font-weight: 700; }

/* hero */
.eyebrow {
  display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; background: var(--primary); border: 3px solid var(--border);
  padding: 5px 12px; box-shadow: 3px 3px 0 var(--shadow); margin-bottom: 22px; transform: rotate(-1deg);
}
h1.hero-title {
  font-weight: 800; font-size: clamp(38px, 7vw, 68px); line-height: 0.98;
  text-transform: uppercase; margin-bottom: 22px;
}
.hero-title .hl { background: var(--primary); padding: 0 8px; display: inline-block; transform: rotate(-.5deg); }
.lead {
  font-size: 15px; color: var(--fg); max-width: 560px; border-left: 3px solid var(--primary);
  padding-left: 16px; margin-bottom: 28px;
}
.badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
.badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  border: 2px solid var(--border); background: var(--secondary); padding: 5px 14px;
}

/* CTA button */
.cta {
  display: inline-block; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
  text-transform: uppercase; letter-spacing: 0.02em; text-decoration: none;
  background: var(--primary); color: var(--fg); border: 3px solid var(--border);
  padding: 14px 26px; box-shadow: 4px 4px 0 var(--shadow); transition: transform .1s, box-shadow .1s;
}
.cta:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--shadow); }
.cta:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--shadow); }
.cta.alt { background: var(--card); }

/* sections */
section.block { margin-top: 56px; }
section.block > h2 {
  font-size: clamp(24px, 4vw, 34px); font-weight: 800; text-transform: uppercase;
  margin-bottom: 18px; line-height: 1.05;
}
.prose p { margin-bottom: 16px; max-width: 680px; }
.prose strong { background: var(--accent); padding: 0 3px; }

/* steps */
ol.steps { list-style: none; counter-reset: s; display: grid; gap: 14px; }
ol.steps li {
  counter-increment: s; position: relative; border: 3px solid var(--border); background: var(--card);
  padding: 16px 18px 16px 64px; box-shadow: 4px 4px 0 var(--shadow);
}
ol.steps li::before {
  content: counter(s); position: absolute; left: 0; top: 0; bottom: 0; width: 48px;
  display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif;
  font-weight: 800; font-size: 22px; background: var(--primary); border-right: 3px solid var(--border);
}
ol.steps li b { font-family: 'Syne', sans-serif; display: block; text-transform: uppercase; font-size: 13px; margin-bottom: 2px; }

/* two-column compare */
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.compare .col { border: 3px solid var(--border); background: var(--card); box-shadow: 4px 4px 0 var(--shadow); }
.compare .col h3 { background: var(--fg); color: var(--bg); padding: 10px 16px; font-size: 16px; text-transform: uppercase; }
.compare .col dl { padding: 14px 16px; display: grid; gap: 10px; }
.compare .col dt { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-fg); }
.compare .col dd { font-size: 13px; }

/* info cards */
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cards .icard { border: 3px solid var(--border); background: var(--card); padding: 18px; box-shadow: 4px 4px 0 var(--shadow); }
.cards .icard h3 { font-size: 16px; text-transform: uppercase; margin-bottom: 8px; }
.cards .icard p { font-size: 13px; color: var(--muted-fg); }

/* bullet list */
ul.ticks { list-style: none; display: grid; gap: 10px; }
ul.ticks li { padding-left: 26px; position: relative; }
ul.ticks li::before { content: '\\2192'; position: absolute; left: 0; font-weight: 700; color: hsl(38 96% 44%); }

/* FAQ */
.faq { display: grid; gap: 12px; }
.faq details { border: 3px solid var(--border); background: var(--card); box-shadow: 4px 4px 0 var(--shadow); }
.faq summary {
  cursor: pointer; list-style: none; padding: 14px 18px; font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 15px; display: flex; justify-content: space-between; gap: 12px; align-items: center;
}
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: '+'; font-size: 22px; line-height: 1; }
.faq details[open] summary::after { content: '\\2212'; }
.faq details[open] summary { background: var(--primary); border-bottom: 3px solid var(--border); }
.faq .answer { padding: 14px 18px; font-size: 13px; color: var(--muted-fg); }
.faq .answer p { margin-bottom: 10px; }

/* related grid */
.related { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
.related a {
  border: 3px solid var(--border); background: var(--card); padding: 14px 16px; text-decoration: none;
  box-shadow: 3px 3px 0 var(--shadow); font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
  text-transform: uppercase; transition: transform .1s, box-shadow .1s; display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.related a:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--shadow); background: var(--accent); }
.related a span { font-weight: 400; }

/* final cta band */
.cta-band {
  margin-top: 64px; border: 3px solid var(--border); background: var(--secondary);
  box-shadow: 6px 6px 0 var(--shadow); padding: 32px; text-align: center;
}
.cta-band h2 { font-size: clamp(22px, 4vw, 30px); text-transform: uppercase; margin-bottom: 8px; }
.cta-band p { margin-bottom: 20px; font-size: 13px; }

/* footer */
.footer { border-top: 3px solid var(--border); background: var(--bg); padding: 24px 28px; position: relative; z-index: 1; }
.footer-row { max-width: 880px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.footer a { text-decoration: none; }
.footer a:hover { text-decoration: underline; }
.footer .muted { color: var(--muted-fg); font-size: 12px; }
.footer .links { display: flex; gap: 14px; font-size: 12px; flex-wrap: wrap; }

@media (max-width: 640px) {
  .compare, .cards { grid-template-columns: 1fr; }
  .header-nav { display: none; }
  .wrap { padding-top: 40px; }
}
`
