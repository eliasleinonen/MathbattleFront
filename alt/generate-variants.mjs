/**
 * Generates 60 alternative Derivative Duel landing pages.
 * Similar minimal / math-game spirit as the current home, with layout,
 * type, and composition experiments.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'pages');

const FONTS = {
  spaceGrotesk: 'Space+Grotesk:wght@400;500;700',
  instrument: 'Instrument+Serif:ital@0;1',
  ibmPlex: 'IBM+Plex+Sans:wght@300;400;500;600',
  ibmMono: 'IBM+Plex+Mono:wght@400;500',
  fraunces: 'Fraunces:opsz,wght@9..144,400;9..144,700',
  dmSans: 'DM+Sans:wght@400;500;700',
  syne: 'Syne:wght@500;700;800',
  newsreader: 'Newsreader:opsz,wght@6..72,400;6..72,600',
  geist: 'Geist:wght@400;500;600;700',
  jetbrains: 'JetBrains+Mono:wght@400;500;700',
  archivo: 'Archivo:wght@400;600;800',
  literata: 'Literata:opsz,wght@7..72,400;7..72,700',
};

function fontLink(keys) {
  const families = keys.map((k) => `family=${FONTS[k]}`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

function shell({ id, title, fonts, css, body, motionNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · Derivative Duel alt ${String(id).padStart(2, '0')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${fontLink(fonts)}" rel="stylesheet" />
  <style>
    :root {
      --ink: #111111;
      --muted: #5c5c5c;
      --line: #d6d6d6;
      --paper: #f7f7f5;
      --surface: #ffffff;
      --accent: #1a1a1a;
      --soft: #ecece8;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      color: var(--ink);
      background: var(--paper);
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    button {
      font: inherit;
      cursor: pointer;
      border: none;
      background: none;
    }
    .cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.35rem;
      background: var(--ink);
      color: #fff;
      border-radius: 4px;
      transition: transform 180ms ease, background 180ms ease;
    }
    .cta:hover { transform: translateY(-1px); background: #000; }
    .cta-ghost {
      display: inline-flex;
      align-items: center;
      padding: 0.85rem 1.2rem;
      border: 1px solid var(--line);
      border-radius: 4px;
      color: var(--ink);
      background: transparent;
      transition: border-color 180ms ease, background 180ms ease;
    }
    .cta-ghost:hover { border-color: var(--ink); background: rgba(0,0,0,0.02); }
    .brand-mark {
      font-size: 1.75rem;
      line-height: 1;
      letter-spacing: -0.04em;
    }
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
    }
    .nav-links { display: flex; gap: 1.25rem; font-size: 0.9rem; color: var(--muted); }
    .nav-links a:hover { color: var(--ink); }
    .eq {
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
    }
    @keyframes rise {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes draw {
      from { stroke-dashoffset: 120; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes pulseSoft {
      0%, 100% { opacity: 0.55; }
      50% { opacity: 1; }
    }
    @keyframes drift {
      from { transform: translateY(0); }
      to { transform: translateY(-8px); }
    }
    .anim-rise { animation: rise 700ms ease both; }
    .anim-rise-2 { animation: rise 800ms 120ms ease both; }
    .anim-rise-3 { animation: rise 900ms 220ms ease both; }
    .anim-fade { animation: fade 900ms ease both; }
    ${css}
  </style>
</head>
<body data-variant="${id}" data-motion="${motionNote || 'rise+fade'}">
${body}
</body>
</html>
`;
}

const variants = [];

function add(def) {
  variants.push(def);
}

// ——— Hand-crafted heroes 01–15 (each a distinct composition) ———

// 01 — Centered brand over soft equation stage
add({
  id: 1,
  title: 'Centered classic',
  fonts: ['ibmPlex', 'instrument'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f7f7f5; }
    .hero {
      max-width: 720px; margin: 0 auto; padding: 3.5rem 1.5rem 2rem; text-align: center;
    }
    .mark {
      font-family: 'Instrument Serif', serif; font-size: clamp(2.8rem, 7vw, 3.6rem);
      margin: 0 0 0.35rem; line-height: 1; animation: rise 700ms ease both, drift 6s ease-in-out 700ms infinite alternate;
    }
    .brand {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(3.4rem, 9vw, 5.4rem); margin: 0 0 1rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); font-size: 1.12rem; line-height: 1.55; max-width: 32rem; margin: 0 auto 2rem; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .stage {
      margin-top: 3rem; min-height: min(38vh, 320px);
      background:
        radial-gradient(ellipse at 50% 20%, #e4e4dc 0%, transparent 55%),
        linear-gradient(180deg, #efefe9, #f7f7f5);
      border-top: 1px solid var(--line);
      display: grid; place-items: center; position: relative; overflow: hidden;
    }
    .stage::before {
      content: ''; position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      animation: pulseSoft 5s ease-in-out infinite;
    }
    .stage .eq {
      position: relative;
      font-family: 'Instrument Serif', serif;
      font-size: clamp(1.9rem, 5vw, 3.1rem); opacity: 0.88;
      animation: fade 1s 200ms ease both;
    }
  `,
  body: `
    <nav class="nav anim-fade">
      <div class="brand-mark" aria-label="Derivative Duel">∂</div>
      <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
    </nav>
    <main class="hero">
      <p class="mark" aria-hidden="true">∂</p>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Solve derivatives faster than your opponent. First to three rounds wins.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Challenge a friend</a>
      </div>
    </main>
    <section class="stage" aria-hidden="true">
      <p class="eq">f(x)=x<sup>5</sup>+2x<sup>3</sup> → f′(x)</p>
    </section>
  `,
});

// 02 — Light split: copy left, graph-grid equation plane right
add({
  id: 2,
  title: 'Split plane',
  fonts: ['syne', 'ibmMono'],
  motionNote: 'rise+fade+pulseSoft',
  css: `
    body { font-family: 'Syne', sans-serif; background: #f5f5f2; }
    .wrap { display: grid; min-height: 100vh; grid-template-columns: 1fr 1fr; }
    @media (max-width: 800px) { .wrap { grid-template-columns: 1fr; } .visual { min-height: 44vh; order: -1; } }
    .copy { padding: 1.75rem 2.5rem 3rem; display: flex; flex-direction: column; }
    .lockup {
      font-size: clamp(2.9rem, 6.5vw, 4.5rem); line-height: 0.92;
      margin: auto 0 1rem; letter-spacing: -0.045em;
    }
    .lockup .partial {
      display: block; font-family: 'IBM Plex Mono', monospace;
      font-size: 0.42em; letter-spacing: 0; color: #3a3a3a; margin-bottom: 0.35rem;
      animation: fade 800ms ease both;
    }
    .copy .lead {
      color: var(--muted); max-width: 28rem; margin: 0 0 1.75rem;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; line-height: 1.65; font-weight: 400;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: auto; }
    .visual {
      background:
        radial-gradient(ellipse at 60% 40%, #ddd9ce 0%, transparent 50%),
        linear-gradient(160deg, #ebe8e0, #f0efe9 55%, #e2dfd6);
      display: grid; place-items: center; position: relative; overflow: hidden;
    }
    .visual::before {
      content: ''; position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(17,17,17,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(17,17,17,0.06) 1px, transparent 1px);
      background-size: 44px 44px;
      animation: pulseSoft 4.5s ease-in-out infinite;
    }
    .visual svg { position: absolute; width: 78%; height: 45%; opacity: 0.35; }
    .visual svg path {
      fill: none; stroke: #222; stroke-width: 2;
      stroke-dasharray: 120; animation: draw 1.6s ease both;
    }
    .visual .eq {
      position: relative; z-index: 1;
      font-family: 'IBM Plex Mono', monospace;
      font-size: clamp(1.15rem, 2.4vw, 1.65rem);
      animation: rise 900ms 150ms ease both;
    }
  `,
  body: `
    <div class="wrap">
      <section class="copy">
        <nav class="nav" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
        </nav>
        <h1 class="lockup anim-rise"><span class="partial">∂</span>Derivative<br/>Duel</h1>
        <p class="lead anim-rise-2">1v1 calculus battles with live ELO. Differentiation under pressure.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Enter matchmaking</a>
          <a class="cta-ghost" href="#">Daily challenge</a>
        </div>
      </section>
      <aside class="visual anim-fade" aria-label="Example problem">
        <svg viewBox="0 0 200 80" aria-hidden="true"><path d="M4 60 C40 60, 40 20, 80 20 S120 60, 160 28 S190 10, 196 18"/></svg>
        <p class="eq">d/dx [ x<sup>7</sup> − 4x<sup>5</sup> ]</p>
      </aside>
    </div>
  `,
});

// 03 — Editorial: giant brand + drifting ∂ field
add({
  id: 3,
  title: 'Watermark editorial',
  fonts: ['fraunces', 'dmSans'],
  motionNote: 'rise+drift+fade',
  css: `
    body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; background: #f6f5f1; }
    .page { position: relative; min-height: 100vh; padding: 1.5rem 1.5rem 0; max-width: 960px; margin: 0 auto; }
    .watermark {
      position: absolute; top: 8%; right: -6%;
      font-family: 'Fraunces', serif; font-size: clamp(14rem, 42vw, 24rem);
      color: rgba(20,20,18,0.045); line-height: 0.75; pointer-events: none;
      animation: drift 6s ease-in-out infinite alternate;
    }
    .brand {
      font-family: 'Fraunces', serif;
      font-size: clamp(3.2rem, 9vw, 5.2rem); margin: 3.5rem 0 0.75rem;
      letter-spacing: -0.03em; line-height: 1.02;
    }
    .headline {
      font-family: 'Fraunces', serif; font-style: italic;
      font-size: clamp(1.35rem, 3vw, 1.75rem); margin: 0 0 1rem; color: #2a2a28; font-weight: 400;
    }
    .lead { font-size: 1.05rem; color: var(--muted); max-width: 30rem; line-height: 1.55; margin: 0; }
    .actions { margin-top: 2rem; display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .eq-band {
      margin-top: 3.5rem; margin-left: -1.5rem; margin-right: -1.5rem;
      padding: 2.25rem 1.5rem; border-top: 1px solid var(--line);
      background: linear-gradient(180deg, #efece4, #f6f5f1);
      text-align: center;
    }
    .eq-band .eq {
      font-family: 'Fraunces', serif; font-size: clamp(1.5rem, 4vw, 2.4rem);
      margin: 0; opacity: 0.8; animation: fade 1.1s ease both;
    }
    .eq-band .rule {
      display: block; width: 4rem; height: 1px; background: #222; margin: 0 auto 1.25rem;
      transform-origin: left; animation: rise 800ms ease both;
    }
  `,
  body: `
    <div class="page">
      <div class="watermark" aria-hidden="true">∂</div>
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="headline anim-rise-2">Race the chain rule.</p>
      <p class="lead anim-rise-2">A calm arena for competitive differentiation — speed, accuracy, and a climbing rating.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">View leaderboard</a>
      </div>
      <div class="eq-band" aria-hidden="true">
        <span class="rule"></span>
        <p class="eq">y = e<sup>2x</sup> · find dy/dx</p>
      </div>
    </div>
  `,
});

// 04 — Light console: brand prompt + live equation output pane
add({
  id: 4,
  title: 'Light terminal',
  fonts: ['jetbrains', 'ibmPlex'],
  motionNote: 'rise+pulseSoft+fade',
  css: `
    body {
      font-family: 'JetBrains Mono', monospace; background: #f2f2ed;
      background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .shell { max-width: 820px; margin: 0 auto; padding: 1.5rem; min-height: 100vh; display: flex; flex-direction: column; }
    .prompt { color: var(--muted); margin: 2rem 0 0.75rem; font-size: 0.82rem; animation: fade 700ms ease both; }
    h1 {
      font-size: clamp(1.7rem, 4.5vw, 2.35rem); margin: 0 0 1rem; font-weight: 700; letter-spacing: -0.03em;
    }
    .cursor {
      display: inline-block; width: 0.55ch; height: 1.05em; background: var(--ink);
      margin-left: 3px; animation: pulseSoft 1s steps(1) infinite; vertical-align: text-bottom;
    }
    .lead { color: var(--muted); line-height: 1.65; margin: 0 0 1.75rem; max-width: 38rem; font-size: 0.92rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .cta, .cta-ghost { border-radius: 2px; font-size: 0.88rem; }
    .output {
      margin-top: auto; padding: 2rem 1.25rem;
      border: 1px solid var(--line); background: #fafaf6;
      min-height: 200px; display: grid; place-items: center;
      animation: fade 1s 180ms ease both;
    }
    .output .eq { font-size: clamp(1.1rem, 3vw, 1.55rem); margin: 0; animation: rise 900ms 280ms ease both; }
    .output .blink { opacity: 0.4; animation: pulseSoft 2.2s ease-in-out infinite; }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <p class="prompt">~/mathbattle · ranked</p>
      <h1 class="anim-rise">∂ Derivative Duel<span class="cursor"></span></h1>
      <p class="lead anim-rise-2">Solve f′(x) before your opponent. Rating updates after every match.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
      <div class="output" aria-hidden="true">
        <p class="eq"><span class="blink">&gt;</span> f(x)=ln(3x) &nbsp;→&nbsp; f′(x)=1/x</p>
      </div>
    </div>
  `,
});

// 05 — Tall brand column + soft equation ribbon
add({
  id: 5,
  title: 'Vertical flow',
  fonts: ['archivo', 'literata'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'Archivo', sans-serif; background: #f8f7f3; }
    .wrap {
      max-width: 560px; margin: 0 auto; padding: 1.5rem 1.5rem 0;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .mark {
      font-size: clamp(3rem, 10vw, 4.5rem); line-height: 1; margin: 2.5rem 0 0.25rem;
      letter-spacing: -0.06em; animation: rise 700ms ease both, drift 5.5s ease-in-out 700ms infinite alternate;
    }
    h1 {
      font-size: clamp(2.7rem, 8vw, 4rem); letter-spacing: -0.045em; margin: 0 0 1rem; line-height: 0.98;
    }
    .lead {
      font-family: 'Literata', serif; color: var(--muted);
      font-size: 1.12rem; line-height: 1.55; margin: 0 0 2rem; max-width: 28rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .ribbon {
      margin-top: auto; margin-left: -1.5rem; margin-right: -1.5rem;
      padding: 2.5rem 1.5rem; border-top: 1px solid var(--line);
      background:
        repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(0,0,0,0.04) 31px, rgba(0,0,0,0.04) 32px),
        linear-gradient(180deg, #eceae2, #f8f7f3);
      text-align: center;
    }
    .ribbon .eq {
      font-family: 'Literata', serif; font-size: clamp(1.35rem, 3.5vw, 1.9rem);
      margin: 0; animation: fade 1s ease both;
    }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">faq</a><a href="#">login</a></div>
      </nav>
      <p class="mark" aria-hidden="true">∂</p>
      <h1 class="anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Queue ranked or invite a friend. Differentiate under a live countdown.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play now</a>
        <a class="cta-ghost" href="#">Learn derivatives</a>
      </div>
      <div class="ribbon" aria-hidden="true">
        <p class="eq">f(x)=(2x+1)<sup>5</sup> · find f′</p>
      </div>
    </div>
  `,
});

// 06 — Ink stripe + wide brand lockup + equation horizon
add({
  id: 6,
  title: 'Ink stripe hero',
  fonts: ['spaceGrotesk', 'ibmMono'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'Space Grotesk', sans-serif; background: #f6f6f3; }
    .stripe {
      height: 10px;
      background: linear-gradient(90deg, #111 0 38%, #7a7a7a 38% 68%, #d0d0c8 68%);
      animation: fade 600ms ease both;
    }
    .hero { max-width: 780px; margin: 0 auto; padding: 2.75rem 1.5rem 2rem; }
    .brand-row {
      display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap; margin: 1.5rem 0 1rem;
    }
    .brand-row .partial {
      font-size: clamp(3rem, 8vw, 4.5rem); line-height: 1; animation: rise 700ms ease both;
    }
    h1 {
      font-size: clamp(2.8rem, 7vw, 4.3rem); letter-spacing: -0.05em; margin: 0; line-height: 0.95;
    }
    .lead {
      color: var(--muted); max-width: 34rem; line-height: 1.55; margin: 0 0 2rem;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.88rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .horizon {
      margin-top: 3rem; min-height: 240px; position: relative;
      border-top: 1px solid var(--line);
      background: linear-gradient(180deg, #edede6, #f6f6f3);
      display: grid; place-items: center; overflow: hidden;
    }
    .horizon svg { position: absolute; inset: 18% 8% auto; width: 84%; height: 50%; }
    .horizon path {
      fill: none; stroke: #1a1a1a; stroke-width: 1.5; opacity: 0.35;
      stroke-dasharray: 140; animation: draw 1.8s ease both;
    }
    .horizon .eq {
      position: relative; font-family: 'IBM Plex Mono', monospace;
      font-size: clamp(1rem, 2.5vw, 1.35rem); animation: rise 900ms 200ms ease both;
    }
  `,
  body: `
    <div class="stripe"></div>
    <nav class="nav anim-fade">
      <div class="brand-mark">∂</div>
      <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
    </nav>
    <main class="hero">
      <div class="brand-row">
        <span class="partial" aria-hidden="true">∂</span>
        <h1 class="anim-rise">Derivative Duel</h1>
      </div>
      <p class="lead anim-rise-2">Real-time 1v1 calculus matches for students who treat practice like competition.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Find opponent</a>
        <a class="cta-ghost" href="#">Invite friend</a>
      </div>
    </main>
    <section class="horizon" aria-hidden="true">
      <svg viewBox="0 0 240 60" preserveAspectRatio="none"><path d="M0 45 C50 45, 60 10, 100 18 S150 55, 180 30 S220 8, 240 20"/></svg>
      <p class="eq">d/dx [ cos(x²) ]</p>
    </section>
  `,
});

// 07 — Full-viewport calm field; brand centered; CTA dock
add({
  id: 7,
  title: 'Bottom-anchored CTA',
  fonts: ['newsreader', 'dmSans'],
  motionNote: 'rise+fade+pulseSoft',
  css: `
    body {
      font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; min-height: 100vh;
      background:
        radial-gradient(ellipse at 50% 35%, #e8e4d8 0%, transparent 55%),
        #f4f3ee;
    }
    .field {
      flex: 1; display: flex; flex-direction: column; justify-content: center;
      padding: 2rem 1.5rem; max-width: 820px; margin: 0 auto; width: 100%;
      position: relative;
    }
    .field .ghost-eq {
      position: absolute; inset: auto 0 12% 0; text-align: center;
      font-family: 'Newsreader', serif; font-size: clamp(1.4rem, 4vw, 2.2rem);
      color: rgba(20,20,18,0.12); pointer-events: none;
      animation: pulseSoft 4s ease-in-out infinite;
    }
    .mark {
      font-family: 'Newsreader', serif; font-size: clamp(2.4rem, 6vw, 3.2rem);
      margin: 0 0 0.4rem; line-height: 1; animation: fade 800ms ease both;
    }
    h1 {
      font-family: 'Newsreader', serif;
      font-size: clamp(3.1rem, 8vw, 5rem); margin: 0 0 1rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); font-size: 1.1rem; max-width: 30rem; line-height: 1.5; margin: 0; }
    .dock {
      border-top: 1px solid var(--line); padding: 1rem 1.5rem;
      display: flex; justify-content: space-between; align-items: center;
      gap: 1rem; flex-wrap: wrap; background: rgba(255,255,255,0.85);
      backdrop-filter: blur(6px);
    }
    .dock .actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .dock .hint { color: var(--muted); font-size: 0.9rem; animation: fade 1s ease both; }
  `,
  body: `
    <nav class="nav anim-fade">
      <div class="brand-mark">∂</div>
      <div class="nav-links"><a href="#">about</a><a href="#">login</a></div>
    </nav>
    <main class="field">
      <p class="ghost-eq" aria-hidden="true">f′(x) = lim Δx→0 …</p>
      <p class="mark" aria-hidden="true">∂</p>
      <h1 class="anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">A quiet interface for loud calculus matches. Queue up and prove the chain rule.</p>
    </main>
    <footer class="dock anim-rise-3">
      <span class="hint">Ready when you are</span>
      <div class="actions">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Daily challenge</a>
      </div>
    </footer>
  `,
});

// 08 — Diagonal paper fold with brand on light side
add({
  id: 8,
  title: 'Diagonal paper fold',
  fonts: ['instrument', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #eceae3; }
    .plane {
      min-height: 100vh; padding: 1.5rem;
      background:
        linear-gradient(122deg, #f8f7f3 0 56%, #ddd9ce 56% 57.2%, #2a2a28 57.2%);
      position: relative; overflow: hidden;
    }
    .fold-eq {
      position: absolute; right: 6%; bottom: 14%;
      font-family: 'Instrument Serif', serif; color: #f0efe9;
      font-size: clamp(1.2rem, 2.8vw, 1.8rem); max-width: 12rem; text-align: right;
      animation: fade 1s 200ms ease both, drift 5s ease-in-out 1s infinite alternate;
    }
    .content { max-width: 520px; padding: 2.5rem 0.5rem 3rem; }
    .mark {
      font-family: 'Instrument Serif', serif; font-size: 2.6rem; margin: 2rem 0 0.35rem; line-height: 1;
    }
    h1 {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(3rem, 8vw, 4.8rem); margin: 0 0 1rem; letter-spacing: -0.03em; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 2rem; max-width: 26rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    @media (max-width: 700px) {
      .plane {
        background: linear-gradient(180deg, #f8f7f3 0 62%, #ddd9ce 62% 63%, #2a2a28 63%);
      }
      .fold-eq { right: 1.5rem; bottom: 8%; text-align: left; max-width: none; }
      .content { padding-bottom: 7rem; }
    }
  `,
  body: `
    <div class="plane">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">login</a></div>
      </nav>
      <div class="content">
        <p class="mark anim-rise" aria-hidden="true">∂</p>
        <h1 class="anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Math, but matchmade. Queue into ranked derivative battles as problems get sharper.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play</a>
          <a class="cta-ghost" href="#">Guide</a>
        </div>
      </div>
      <p class="fold-eq" aria-hidden="true">√(4x+1)<br/>→ differentiate</p>
    </div>
  `,
});

// 09 — Type ladder culminating in hero brand + thin equation footing
add({
  id: 9,
  title: 'Type scale ladder',
  fonts: ['syne', 'ibmPlex'],
  motionNote: 'rise+fade+pulseSoft',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f7f7f4; }
    .wrap { max-width: 880px; margin: 0 auto; padding: 1.5rem 1.5rem 0; min-height: 100vh; display: flex; flex-direction: column; }
    .ladder { display: grid; gap: 0.3rem; margin: 2.25rem 0 1.25rem; }
    .ladder span {
      display: block; font-family: 'Syne', sans-serif; letter-spacing: -0.04em; line-height: 0.95;
    }
    .s1 { font-size: clamp(1.1rem, 2vw, 1.4rem); color: #a3a39a; animation: rise 600ms ease both; }
    .s2 { font-size: clamp(1.7rem, 3.8vw, 2.3rem); color: #6a6a62; animation: rise 700ms 80ms ease both; }
    .s3 {
      font-size: clamp(2.9rem, 7.5vw, 4.7rem); color: #111;
      animation: rise 800ms 140ms ease both;
    }
    .s3 .partial { margin-right: 0.35rem; }
    .lead { color: var(--muted); max-width: 30rem; margin: 0 0 1.75rem; line-height: 1.55; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .footing {
      margin-top: auto; padding: 2rem 0; border-top: 1px solid var(--line);
      font-family: 'Syne', sans-serif; font-size: clamp(1.2rem, 3vw, 1.7rem);
      color: #3a3a36; letter-spacing: -0.02em;
    }
    .footing .dot {
      display: inline-block; width: 6px; height: 6px; background: #111; margin: 0 0.65rem;
      vertical-align: middle; animation: pulseSoft 2s ease-in-out infinite;
    }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="ladder">
        <span class="s1">competitive calculus</span>
        <span class="s2">real-time duels</span>
        <span class="s3"><span class="partial">∂</span>Derivative Duel</span>
      </div>
      <p class="lead anim-rise-2">The type ladder ends on the brand. One click into a match.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start duel</a>
        <a class="cta-ghost" href="#">How it works</a>
      </div>
      <p class="footing anim-fade" aria-hidden="true">f(x)=x<sup>5</sup>+2x<sup>3</sup><span class="dot"></span>f′(x)</p>
    </div>
  `,
});

// 10 — Full-bleed equation atmosphere with brand overlaid
add({
  id: 10,
  title: 'Equation as hero media',
  fonts: ['fraunces', 'dmSans'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'DM Sans', sans-serif; }
    .hero-plane {
      min-height: 100vh; display: flex; flex-direction: column;
      background:
        radial-gradient(circle at 28% 42%, #e4e0d4 0%, transparent 42%),
        radial-gradient(circle at 72% 58%, #d8d3c6 0%, transparent 38%),
        linear-gradient(180deg, #f1efe8, #e8e4da);
      position: relative; overflow: hidden;
    }
    .hero-plane .drift-eq {
      position: absolute; top: 18%; left: 8%;
      font-family: 'Fraunces', serif; font-size: clamp(2rem, 7vw, 4.2rem);
      color: rgba(17,17,17,0.1); white-space: nowrap;
      animation: drift 7s ease-in-out infinite alternate;
    }
    .hero-plane .drift-eq.b {
      top: auto; bottom: 22%; left: auto; right: 6%;
      font-size: clamp(1.4rem, 4vw, 2.4rem);
      animation-delay: -2s; animation-direction: alternate-reverse;
    }
    .copy {
      margin-top: auto; padding: 2.5rem 1.5rem 3.5rem; max-width: 720px;
      position: relative; z-index: 1;
    }
    .mark {
      font-family: 'Fraunces', serif; font-size: clamp(2.6rem, 6vw, 3.4rem);
      margin: 0 0 0.25rem; line-height: 1;
    }
    h1 {
      font-family: 'Fraunces', serif;
      font-size: clamp(2.8rem, 7vw, 4.2rem); letter-spacing: -0.03em; margin: 0 0 0.85rem;
    }
    .lead { color: #4a4a45; margin: 0 0 1.75rem; line-height: 1.55; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <div class="hero-plane">
      <p class="drift-eq" aria-hidden="true">f(x)=sin(x²)</p>
      <p class="drift-eq b" aria-hidden="true">find f′</p>
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">login</a></div>
      </nav>
      <div class="copy">
        <p class="mark anim-rise" aria-hidden="true">∂</p>
        <h1 class="anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">The problem is the landscape. Race an opponent to the correct derivative.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Play friend</a>
        </div>
      </div>
    </div>
  `,
});

// 11 — Wide lockup: brand left, ruled equation panel right
add({
  id: 11,
  title: 'Wide lockup',
  fonts: ['geist', 'ibmMono'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'Geist', sans-serif; background: #f5f6f7; }
    :root { --ink: #152238; --muted: #5a6573; --line: #d2d7df; --paper: #f5f6f7; }
    .cta { background: var(--ink); }
    .cta:hover { background: #0d1828; }
    .shell {
      max-width: 1100px; margin: 0 auto; padding: 1.5rem 2rem 0;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .row {
      flex: 1; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 2.5rem; align-items: center;
      padding: 2rem 0 3rem;
    }
    @media (max-width: 800px) { .row { grid-template-columns: 1fr; } }
    .mark { font-size: 2.4rem; margin: 0 0 0.5rem; line-height: 1; letter-spacing: -0.05em; }
    h1 {
      font-size: clamp(2.8rem, 5.5vw, 4.3rem); letter-spacing: -0.05em;
      margin: 0 0 1rem; line-height: 0.95;
    }
    .lead {
      color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 32rem;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.88rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .panel {
      min-height: 280px; background: #e7ebf0;
      display: grid; place-items: center; position: relative; overflow: hidden;
      border-left: 3px solid var(--ink);
    }
    .panel svg { position: absolute; width: 70%; opacity: 0.4; }
    .panel path {
      fill: none; stroke: var(--ink); stroke-width: 2;
      stroke-dasharray: 120; animation: draw 1.5s ease both;
    }
    .panel .eq {
      position: relative; font-family: 'IBM Plex Mono', monospace;
      font-size: clamp(1rem, 2.2vw, 1.35rem); animation: rise 850ms 120ms ease both;
    }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="row">
        <div>
          <p class="mark anim-rise" aria-hidden="true">∂</p>
          <h1 class="anim-rise">Derivative Duel</h1>
          <p class="lead anim-rise-2">Beat the clock. Beat your opponent. Master the derivative in ranked 1v1.</p>
          <div class="actions anim-rise-3">
            <a class="cta" href="#">Play random</a>
            <a class="cta-ghost" href="#">Challenge friend</a>
          </div>
        </div>
        <aside class="panel anim-fade" aria-hidden="true">
          <svg viewBox="0 0 160 70"><path d="M2 55 Q40 55 50 25 T100 30 T158 12"/></svg>
          <p class="eq">y = tan(x)·x²</p>
        </aside>
      </div>
    </div>
  `,
});

// 12 — Narrow monospaced arena strip
add({
  id: 12,
  title: 'Narrow arena',
  fonts: ['jetbrains', 'spaceGrotesk'],
  motionNote: 'rise+pulseSoft+fade',
  css: `
    body {
      font-family: 'Space Grotesk', sans-serif; background: #f3f6f3;
      --ink: #1f3d2c; --muted: #5a6b5e; --line: #c9d4cc; --paper: #f3f6f3;
    }
    .cta { background: var(--ink); }
    .cta:hover { background: #163024; }
    .cta-ghost:hover { border-color: var(--ink); }
    .wrap {
      max-width: 460px; margin: 0 auto; padding: 1.5rem 1.25rem 0;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .vs {
      font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
      letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted);
      margin: 2.5rem 0 0.75rem; animation: fade 700ms ease both;
    }
    .vs i {
      display: inline-block; width: 1.5rem; height: 1px; background: var(--ink);
      margin: 0 0.55rem; vertical-align: middle; opacity: 0.35;
      animation: pulseSoft 2.4s ease-in-out infinite;
    }
    .mark { font-size: 2.8rem; margin: 0; line-height: 1; color: var(--ink); }
    h1 {
      font-size: clamp(2.5rem, 9vw, 3.5rem); letter-spacing: -0.045em;
      margin: 0.35rem 0 1rem; color: var(--ink); line-height: 0.98;
    }
    .lead { color: var(--muted); line-height: 1.6; margin: 0 0 1.75rem; }
    .actions { display: grid; gap: 0.6rem; }
    .cta, .cta-ghost { width: 100%; border-radius: 3px; }
    .strip {
      margin-top: auto; margin-left: -1.25rem; margin-right: -1.25rem;
      padding: 2rem 1.25rem; border-top: 1px solid var(--line);
      background: linear-gradient(180deg, #e6eee8, #f3f6f3);
      font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; text-align: center;
      color: var(--ink); animation: rise 900ms 150ms ease both;
    }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">login</a></div>
      </nav>
      <p class="vs">you <i></i> opponent</p>
      <p class="mark anim-rise" aria-hidden="true">∂</p>
      <h1 class="anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">A focused strip for ranked matches. First to three rounds.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Enter matchmaking</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
      <p class="strip" aria-hidden="true">d/dx [ x⁷ − 4x⁵ ]</p>
    </div>
  `,
});

// 13 — Asymmetric: oversized ∂ + brand, olive wash
add({
  id: 13,
  title: 'Asymmetric mark',
  fonts: ['instrument', 'dmSans'],
  motionNote: 'rise+drift+fade',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f4f5ef; --ink: #3a3f2b; --muted: #6a6f5c; --line: #d5d8c8; }
    .cta { background: var(--ink); }
    .cta:hover { background: #2c3120; }
    .shell {
      max-width: 980px; margin: 0 auto; padding: 1.5rem;
      min-height: 100vh; display: grid; grid-template-columns: 1.35fr 0.9fr;
      gap: 1.5rem; align-items: end;
    }
    @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } .visual { min-height: 220px; order: -1; } }
    .giant {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(5rem, 16vw, 9rem); line-height: 0.8; margin: 0;
      color: rgba(58,63,43,0.12);
      animation: drift 6s ease-in-out infinite alternate;
    }
    h1 {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(2.6rem, 6vw, 3.9rem); letter-spacing: -0.035em;
      margin: -1.5rem 0 1rem; color: var(--ink); position: relative;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .visual {
      min-height: 260px; margin-bottom: 2.5rem;
      background:
        radial-gradient(circle at 40% 50%, #e4e6d6 0%, transparent 55%),
        linear-gradient(165deg, #e8eadc, #f4f5ef);
      display: grid; place-items: center; border-top: 1px solid var(--line);
    }
    .visual .eq {
      font-family: 'Instrument Serif', serif; font-size: clamp(1.4rem, 3vw, 2rem);
      color: var(--ink); opacity: 0.85; animation: fade 1s ease both;
    }
  `,
  body: `
    <nav class="nav anim-fade" style="max-width:980px;margin:0 auto;padding:1.25rem 1.5rem 0">
      <div class="brand-mark">∂</div>
      <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
    </nav>
    <div class="shell">
      <div>
        <p class="giant" aria-hidden="true">∂</p>
        <h1 class="anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Quiet olive paper, sharp stakes. Differentiated answers under a countdown.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Daily challenge</a>
        </div>
      </div>
      <aside class="visual anim-fade" aria-hidden="true">
        <p class="eq">f(x)=e<sup>2x</sup>·x<sup>3</sup></p>
      </aside>
    </div>
  `,
});

// 14 — Serif manifesto: brand, thin drawn rule, equation whisper
add({
  id: 14,
  title: 'Serif manifesto',
  fonts: ['literata', 'archivo'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'Archivo', sans-serif; background: #f6f5f2; }
    .page {
      max-width: 700px; margin: 0 auto; padding: 1.5rem 1.5rem 0;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .mark {
      font-family: 'Literata', serif; font-size: clamp(2.8rem, 7vw, 3.6rem);
      margin: 3rem 0 0.4rem; line-height: 1;
    }
    h1 {
      font-family: 'Literata', serif;
      font-size: clamp(3rem, 8vw, 4.6rem); letter-spacing: -0.035em;
      margin: 0 0 1.25rem; line-height: 1.02;
    }
    .rule {
      width: 5rem; height: 2px; background: #111; margin: 0 0 1.25rem; border: 0;
      transform-origin: left center;
      animation: rise 700ms ease both;
    }
    .lead { color: var(--muted); line-height: 1.6; margin: 0 0 2rem; max-width: 28rem; font-size: 1.05rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .whisper {
      margin-top: auto; padding: 2.5rem 0 3rem;
      font-family: 'Literata', serif; font-style: italic;
      font-size: clamp(1.35rem, 3.5vw, 1.9rem); color: #3a3a36;
      border-top: 1px solid var(--line);
      position: relative;
    }
    .whisper svg {
      position: absolute; top: -1px; left: 0; width: 5rem; height: 2px; overflow: visible;
    }
    .whisper line {
      stroke: #111; stroke-width: 2;
      stroke-dasharray: 80; animation: draw 1.2s ease both;
    }
  `,
  body: `
    <div class="page">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">about</a><a href="#">login</a></div>
      </nav>
      <p class="mark anim-rise" aria-hidden="true">∂</p>
      <h1 class="anim-rise">Derivative Duel</h1>
      <hr class="rule" />
      <p class="lead anim-rise-2">A short manifesto for competitive calculus: clear type, clean stakes, one correct answer.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">View leaderboard</a>
      </div>
      <p class="whisper anim-fade" aria-hidden="true">
        <svg viewBox="0 0 80 2" aria-hidden="true"><line x1="0" y1="1" x2="80" y2="1"/></svg>
        prove d/dx [ ln(3x) ]
      </p>
    </div>
  `,
});

// 15 — Light scoreboard / match header composition
add({
  id: 15,
  title: 'Match header',
  fonts: ['archivo', 'jetbrains'],
  motionNote: 'rise+pulseSoft+fade',
  css: `
    body { font-family: 'Archivo', sans-serif; background: #f4f4f1; }
    .arena {
      max-width: 760px; margin: 0 auto; padding: 1.5rem;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .score {
      display: flex; justify-content: space-between; align-items: baseline;
      gap: 1rem; margin: 2.5rem 0 0.5rem;
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
      letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
      animation: fade 700ms ease both;
    }
    .score .pulse {
      width: 7px; height: 7px; border-radius: 50%; background: #111;
      display: inline-block; margin-right: 0.4rem; vertical-align: middle;
      animation: pulseSoft 1.8s ease-in-out infinite;
    }
    .mark {
      font-size: clamp(2.6rem, 7vw, 3.4rem); margin: 0.5rem 0 0.15rem; line-height: 1;
      letter-spacing: -0.05em;
    }
    h1 {
      font-weight: 800; font-size: clamp(2.7rem, 7.5vw, 4.2rem);
      letter-spacing: -0.05em; margin: 0 0 1rem; line-height: 0.95;
    }
    .lead {
      font-family: 'JetBrains Mono', monospace; color: var(--muted);
      font-size: 0.9rem; line-height: 1.65; margin: 0 0 1.75rem; max-width: 34rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .cta, .cta-ghost { border-radius: 2px; }
    .board {
      margin-top: auto; padding: 2.25rem 1.25rem;
      border: 1px solid var(--line); background: #fafaf7;
      display: grid; place-items: center; min-height: 200px;
    }
    .board .eq {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(1.05rem, 2.8vw, 1.45rem); margin: 0;
      animation: rise 900ms 160ms ease both;
    }
  `,
  body: `
    <div class="arena">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="score"><span><span class="pulse"></span>live</span><span>1v1 ranked</span></div>
      <p class="mark anim-rise" aria-hidden="true">∂</p>
      <h1 class="anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Matchmaking that feels like a scoreboard — calm chrome, fast problems.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
      <div class="board anim-fade" aria-hidden="true">
        <p class="eq">problem · f(x)=√(4x+1)</p>
      </div>
    </div>
  `,
});

const layouts = [
  'center',
  'left',
  'split',
  'topMedia',
  'bottomBar',
  'asymmetric',
  'narrow',
  'wide',
  'stack',
  'frame',
];

const accentsFixed = [
  { name: 'ink', accent: '#111111', soft: '#ecece8', paper: '#f7f7f5' },
  { name: 'forest', accent: '#1f3d2c', soft: '#e6eee8', paper: '#f3f6f3' },
  { name: 'slate', accent: '#243447', soft: '#e7ebf0', paper: '#f4f6f8' },
  { name: 'rust', accent: '#5c2e1f', soft: '#f0e7e2', paper: '#f8f4f1' },
  { name: 'navy', accent: '#152238', soft: '#e4e8f0', paper: '#f2f4f8' },
  { name: 'olive', accent: '#3a3f2b', soft: '#ecead9', paper: '#f6f5ec' },
];

const headlines = [
  ['Derivative Duel', 'Beat the clock. Beat your opponent. Master the derivative.'],
  ['Race f′(x)', 'Live 1v1 calculus matches with adaptive ELO difficulty.'],
  ['Prove the chain rule', 'Competitive differentiation for students who like pressure.'],
  ['Mathbattle mode', 'Queue ranked or invite a friend. First to three rounds.'],
  ['Speed meets calculus', 'Answer correctly before they do. Climb the board.'],
  ['Your daily derivative', 'Warm up with the daily challenge, then enter ranked.'],
  ['Quiet UI. Loud stakes.', 'A focused arena for derivative speed and accuracy.'],
  ['From practice to duel', 'Turn homework drills into real-time matches.'],
  ['ELO for derivatives', 'Harder problems unlock as your rating rises.'],
  ['∂ in real time', 'Countdown. Problem. Answer. Rematch.'],
];

const fontPairs = [
  ['spaceGrotesk', 'ibmMono'],
  ['instrument', 'ibmPlex'],
  ['fraunces', 'dmSans'],
  ['syne', 'ibmPlex'],
  ['newsreader', 'dmSans'],
  ['archivo', 'literata'],
  ['jetbrains', 'ibmPlex'],
  ['geist', 'ibmMono'],
  ['literata', 'dmSans'],
  ['ibmPlex', 'ibmMono'],
];

const eqSamples = [
  'f(x)=x⁵+2x³',
  'd/dx [ln(3x)]',
  'f(x)=e^{2x}·x³',
  'y=cos(x²)',
  'f(x)=√(4x+1)',
  'd/dx [x⁷−4x⁵]',
  'f(x)=(2x+1)⁵',
  'y=tan(x)·x²',
];

function layoutCss(layout, accent) {
  const base = `
    :root { --ink: ${accent.accent}; --paper: ${accent.paper}; --soft: ${accent.soft}; --accent: ${accent.accent}; }
    body { background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .hero-eq {
      font-size: clamp(1.6rem, 4vw, 2.6rem);
      opacity: 0.88;
    }
  `;
  switch (layout) {
    case 'center':
      return (
        base +
        `
        .shell { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem 4rem; text-align: center; }
        h1 { font-size: clamp(2.6rem, 7vw, 4.2rem); letter-spacing: -0.04em; margin: 2.5rem 0 1rem; }
        .lead { color: var(--muted); max-width: 34rem; margin: 0 auto 2rem; line-height: 1.55; }
        .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        .media {
          margin-top: 3rem; min-height: 240px; border-radius: 0;
          background: linear-gradient(180deg, var(--soft), var(--paper));
          border: 1px solid var(--line); display: grid; place-items: center;
        }
      `
      );
    case 'left':
      return (
        base +
        `
        .shell { max-width: 760px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        h1 { font-size: clamp(2.6rem, 7vw, 4rem); letter-spacing: -0.04em; margin: 2.5rem 0 1rem; }
        .lead { color: var(--muted); max-width: 32rem; margin: 0 0 2rem; line-height: 1.55; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .media { margin-top: 2.5rem; padding: 2rem; background: var(--soft); border-left: 4px solid var(--ink); }
      `
      );
    case 'split':
      return (
        base +
        `
        .shell { display: grid; grid-template-columns: 1.1fr 0.9fr; min-height: calc(100vh - 4rem); }
        @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
        .copy { padding: 2rem 2rem 3rem; display: flex; flex-direction: column; }
        h1 { font-size: clamp(2.4rem, 5vw, 3.8rem); letter-spacing: -0.04em; margin: auto 0 1rem; }
        .lead { color: var(--muted); margin: 0 0 1.75rem; line-height: 1.55; max-width: 28rem; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: auto; }
        .media { background: var(--soft); display: grid; place-items: center; min-height: 280px;
          background-image: radial-gradient(circle at 50% 50%, var(--soft) 0%, transparent 60%),
            linear-gradient(160deg, var(--soft), #fff); }
      `
      );
    case 'topMedia':
      return (
        base +
        `
        .media { min-height: 48vh; display: grid; place-items: center;
          background:
            linear-gradient(120deg, var(--soft), var(--paper) 55%, #fff);
          border-bottom: 1px solid var(--line); }
        .shell { max-width: 720px; margin: 0 auto; padding: 2.25rem 1.5rem 4rem; }
        h1 { font-size: clamp(2.4rem, 6vw, 3.6rem); letter-spacing: -0.03em; margin: 0 0 0.75rem; }
        .lead { color: var(--muted); margin: 0 0 1.75rem; line-height: 1.55; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
      `
      );
    case 'bottomBar':
      return (
        base +
        `
        body { display: flex; flex-direction: column; }
        .shell { flex: 1; max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem; width: 100%; display: flex; flex-direction: column; justify-content: center; }
        h1 { font-size: clamp(2.8rem, 7vw, 4.4rem); letter-spacing: -0.04em; margin: 0 0 1rem; }
        .lead { color: var(--muted); max-width: 34rem; line-height: 1.55; }
        .media { display: none; }
        .bar { border-top: 1px solid var(--line); padding: 1rem 1.5rem; display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; background: #fff; align-items: center; }
        .actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
      `
      );
    case 'asymmetric':
      return (
        base +
        `
        .shell { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 4rem; display: grid; grid-template-columns: 1.4fr 0.8fr; gap: 2rem; align-items: end; }
        @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
        h1 { font-size: clamp(2.6rem, 6vw, 4rem); letter-spacing: -0.045em; margin: 2rem 0 1rem; }
        .lead { color: var(--muted); line-height: 1.55; margin-bottom: 1.75rem; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .media { min-height: 220px; background: var(--soft); display: grid; place-items: center; transform: translateY(-1.5rem); }
      `
      );
    case 'narrow':
      return (
        base +
        `
        .shell { max-width: 480px; margin: 0 auto; padding: 3rem 1.25rem 4rem; }
        h1 { font-size: clamp(2.4rem, 8vw, 3.4rem); letter-spacing: -0.04em; margin: 2rem 0 1rem; }
        .lead { color: var(--muted); line-height: 1.6; margin-bottom: 1.75rem; }
        .actions { display: grid; gap: 0.6rem; }
        .cta, .cta-ghost { width: 100%; }
        .media { margin-top: 2rem; padding: 1.5rem 0; border-top: 1px solid var(--line); text-align: center; }
      `
      );
    case 'wide':
      return (
        base +
        `
        .shell { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
        h1 { font-size: clamp(2.8rem, 5vw, 4.2rem); letter-spacing: -0.045em; margin: 0 0 1rem; }
        .lead { color: var(--muted); line-height: 1.55; margin-bottom: 1.75rem; max-width: 34rem; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .media { min-height: 300px; background:
          repeating-linear-gradient(-45deg, var(--soft), var(--soft) 12px, transparent 12px, transparent 24px),
          #fff; border: 1px solid var(--line); display: grid; place-items: center; }
      `
      );
    case 'stack':
      return (
        base +
        `
        .shell { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        .brand-line { font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 2rem; }
        h1 { font-size: clamp(2.5rem, 6vw, 3.8rem); letter-spacing: -0.03em; margin: 0.75rem 0 1rem; }
        .lead { color: var(--muted); line-height: 1.55; margin-bottom: 1.5rem; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .media { padding: 1.5rem; background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      `
      );
    case 'frame':
      return (
        base +
        `
        body { padding: 1rem; }
        .frame { border: 1px solid var(--line); background: #fff; min-height: calc(100vh - 2rem); display: flex; flex-direction: column; }
        .shell { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem 3rem; width: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center; }
        h1 { font-size: clamp(2.5rem, 6vw, 3.8rem); letter-spacing: -0.04em; margin: 0 0 1rem; }
        .lead { color: var(--muted); line-height: 1.55; margin-bottom: 1.75rem; }
        .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .media { border-top: 1px solid var(--line); padding: 1.5rem; text-align: center; background: var(--soft); }
      `
      );
    default: {
      const _exhaustive = layout;
      throw new Error(`Unhandled layout: ${_exhaustive}`);
    }
  }
}

function layoutBody(layout, brandTitle, lead, eq, fontFamily) {
  const nav = `<nav class="nav"><div class="brand-mark" aria-label="Derivative Duel">∂</div><div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div></nav>`;
  const h1 = `<h1 class="anim-rise" style="font-family:${fontFamily}">${brandTitle.includes('Derivative') ? brandTitle : `Derivative Duel`}</h1>`;
  const sub = brandTitle.includes('Derivative')
    ? `<p class="lead anim-rise-2">${lead}</p>`
    : `<p class="lead anim-rise-2"><strong style="color:var(--ink)">${brandTitle}.</strong> ${lead}</p>`;
  const actions = `<div class="actions anim-rise-3"><a class="cta" href="#">Play random</a><a class="cta-ghost" href="#">Challenge friend</a></div>`;
  const media = `<div class="media anim-fade" aria-hidden="true"><p class="hero-eq eq">${eq}</p></div>`;

  switch (layout) {
    case 'center':
      return `${nav}<main class="shell"><p class="brand-mark anim-rise" style="font-size:2.2rem;margin:1rem 0 0">∂</p>${h1}${sub}${actions}${media}</main>`;
    case 'left':
      return `${nav}<main class="shell">${h1}${sub}${actions}${media}</main>`;
    case 'split':
      return `<div class="shell"><div class="copy">${nav}${h1}${sub}${actions}</div>${media}</div>`;
    case 'topMedia':
      return `${nav}${media}<main class="shell">${h1}${sub}${actions}</main>`;
    case 'bottomBar':
      return `${nav}<main class="shell">${h1}${sub}</main><div class="bar anim-rise-3"><span style="color:var(--muted);font-size:0.9rem">${eq}</span>${actions}</div>`;
    case 'asymmetric':
      return `${nav}<main class="shell"><div>${h1}${sub}${actions}</div>${media}</main>`;
    case 'narrow':
      return `${nav}<main class="shell"><p class="brand-mark">∂ Derivative Duel</p>${h1}${sub}${actions}${media}</main>`;
    case 'wide':
      return `${nav}<main class="shell"><div>${h1}${sub}${actions}</div>${media}</main>`;
    case 'stack':
      return `${nav}<main class="shell"><p class="brand-line anim-fade">Derivative Duel</p>${h1}${sub}${actions}${media}</main>`;
    case 'frame':
      return `<div class="frame">${nav}<main class="shell">${h1}${sub}${actions}</main>${media}</div>`;
    default: {
      const _exhaustive = layout;
      throw new Error(`Unhandled layout: ${_exhaustive}`);
    }
  }
}

function fontCssName(key) {
  const map = {
    spaceGrotesk: "'Space Grotesk', sans-serif",
    instrument: "'Instrument Serif', serif",
    ibmPlex: "'IBM Plex Sans', sans-serif",
    ibmMono: "'IBM Plex Mono', monospace",
    fraunces: "'Fraunces', serif",
    dmSans: "'DM Sans', sans-serif",
    syne: "'Syne', sans-serif",
    newsreader: "'Newsreader', serif",
    geist: "'Geist', sans-serif",
    jetbrains: "'JetBrains Mono', monospace",
    archivo: "'Archivo', sans-serif",
    literata: "'Literata', serif",
  };
  return map[key];
}

function addMatrixVariant(id) {
  const i = id - 11;
  const layout = layouts[i % layouts.length];
  const accent = accentsFixed[i % accentsFixed.length];
  const [headline, lead] = headlines[i % headlines.length];
  const fonts = fontPairs[i % fontPairs.length];
  const eq = eqSamples[i % eqSamples.length];
  const title = `${layout} / ${accent.name} / ${fonts[0]}`;

  // Extra unique twists per decade
  let extraCss = '';
  if (id % 5 === 0) {
    extraCss += `
      .cta { border-radius: 0; }
      .cta-ghost { border-radius: 0; }
      body { background-image: radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px); background-size: 18px 18px; }
    `;
  }
  if (id % 7 === 0) {
    extraCss += `
      h1 { text-wrap: balance; }
      .hero-eq { font-style: italic; }
      .nav { border-bottom: 1px solid var(--line); }
    `;
  }
  if (id % 4 === 0) {
    extraCss += `
      .cta { letter-spacing: 0.02em; }
      .media { position: relative; overflow: hidden; }
      .media::after {
        content: '';
        position: absolute; inset: auto 10% 18% 10%; height: 1px;
        background: var(--ink); opacity: 0.15;
        animation: fade 1.2s ease both;
      }
    `;
  }
  if (id >= 41 && id <= 50) {
    extraCss += `
      @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
      .anim-rise { animation: slideIn 650ms ease both; }
    `;
  }
  if (id >= 51) {
    extraCss += `
      .brand-mark { font-weight: 600; }
      h1::first-letter { font-size: 1.08em; }
    `;
  }

  add({
    id,
    title,
    fonts,
    motionNote: id >= 41 && id <= 50 ? 'slide+fade' : 'rise+fade',
    css: `
      body { font-family: ${fontCssName(fonts[1])}; }
      h1, .brand-display { font-family: ${fontCssName(fonts[0])}; }
      ${layoutCss(layout, accent)}
      ${extraCss}
    `,
    body: layoutBody(layout, headline, lead, eq, fontCssName(fonts[0])),
  });
}

// ---------------------------------------------------------------------------
// Handcrafted heroes 16–30 (unique composition / type / accent each)
// ---------------------------------------------------------------------------

// 16 — Full-bleed soft graph plane, brand anchored bottom-left
add({
  id: 16,
  title: 'Graph plane bottom copy',
  fonts: ['spaceGrotesk', 'ibmMono'],
  motionNote: 'rise+drift+draw',
  css: `
    body { font-family: 'IBM Plex Mono', monospace; background: #f2f2ef; }
    .scene {
      min-height: 100vh; display: grid; grid-template-rows: auto 1fr;
      background:
        radial-gradient(ellipse 80% 50% at 70% 35%, #e4e4dc 0%, transparent 55%),
        linear-gradient(180deg, #f7f7f4, #ebebe6);
    }
    .scene svg { width: 100%; height: min(48vh, 420px); display: block; margin-top: auto; }
    .curve { fill: none; stroke: #1a1a1a; stroke-width: 1.5; stroke-dasharray: 400; animation: draw 1.6s ease both; }
    .grid-line { stroke: rgba(0,0,0,0.08); stroke-width: 1; }
    .copy { padding: 0 1.5rem 3rem; max-width: 640px; }
    .brand {
      font-family: 'Space Grotesk', sans-serif; font-weight: 700;
      font-size: clamp(2.8rem, 7vw, 4.4rem); letter-spacing: -0.045em; margin: 0 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .float-dot { animation: drift 3.5s ease-in-out infinite alternate; }
  `,
  body: `
    <div class="scene">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <svg viewBox="0 0 800 280" preserveAspectRatio="none" aria-hidden="true">
        <line class="grid-line" x1="0" y1="140" x2="800" y2="140" />
        <line class="grid-line" x1="400" y1="0" x2="400" y2="280" />
        <path class="curve" d="M40 220 C 160 220, 200 40, 320 90 S 520 240, 640 120 S 760 60, 780 80" />
        <circle class="float-dot" cx="640" cy="120" r="5" fill="#111" />
      </svg>
      <div class="copy">
        <h1 class="brand anim-rise">∂ Derivative Duel</h1>
        <p class="lead anim-rise-2">Plot your rating on a climbing curve. 1v1 calculus — first to three rounds.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge a friend</a>
        </div>
      </div>
    </div>
  `,
});

// 17 — Giant ∂ as dominant visual, copy in a slim right rail
add({
  id: 17,
  title: 'Giant mark rail',
  fonts: ['instrument', 'ibmPlex'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f8f8f6; }
    .wrap { min-height: 100vh; display: grid; grid-template-columns: 1.15fr 0.85fr; }
    @media (max-width: 820px) { .wrap { grid-template-columns: 1fr; } .mark-pane { min-height: 38vh; } }
    .mark-pane {
      display: grid; place-items: center; background: #111; color: #f5f5f0; overflow: hidden; position: relative;
    }
    .giant {
      font-family: 'Instrument Serif', serif; font-size: clamp(14rem, 42vw, 28rem);
      line-height: 0.75; margin: 0; opacity: 0.92; animation: pulseSoft 5s ease-in-out infinite;
    }
    .rail { padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; border-left: 1px solid var(--line); }
    @media (max-width: 820px) { .rail { border-left: none; border-top: 1px solid var(--line); } }
    .brand {
      font-family: 'Instrument Serif', serif; font-size: clamp(2.6rem, 5vw, 3.6rem);
      margin: auto 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 26rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <div class="wrap">
      <aside class="mark-pane anim-fade" aria-hidden="true"><p class="giant">∂</p></aside>
      <section class="rail">
        <nav class="nav" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">The mark is the product. Race an opponent through live differentiation.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Start a duel</a>
          <a class="cta-ghost" href="#">Daily challenge</a>
        </div>
      </section>
    </div>
  `,
});

// 18 — Horizontal band: brand left, equation ticker visual right
add({
  id: 18,
  title: 'Band + equation ticker',
  fonts: ['syne', 'jetbrains'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'JetBrains Mono', monospace; background: #f5f5f2; }
    .band {
      min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto;
    }
    .hero {
      display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 2rem; align-items: end;
      padding: 2rem 1.5rem; max-width: 1100px; margin: 0 auto; width: 100%;
    }
    @media (max-width: 800px) { .hero { grid-template-columns: 1fr; } }
    .brand {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(3rem, 8vw, 5rem);
      letter-spacing: -0.05em; line-height: 0.9; margin: 0 0 1rem;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; font-size: 0.95rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .ticker {
      min-height: 220px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
      background: #fff; display: flex; align-items: center; overflow: hidden; position: relative;
    }
    .ticker-track {
      display: flex; gap: 3rem; white-space: nowrap; padding: 0 1.5rem;
      animation: drift 4s ease-in-out infinite alternate; font-size: clamp(1.1rem, 2.5vw, 1.45rem);
    }
    .ticker-track span { opacity: 0.35; }
    .ticker-track span.on { opacity: 1; color: #111; }
  `,
  body: `
    <div class="band">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <main class="hero">
        <div>
          <h1 class="brand anim-rise">Derivative<br/>Duel</h1>
          <p class="lead anim-rise-2">Problems scroll past. You stop the right one first.</p>
          <div class="actions anim-rise-3">
            <a class="cta" href="#">Enter matchmaking</a>
            <a class="cta-ghost" href="#">Practice</a>
          </div>
        </div>
      </main>
      <div class="ticker anim-fade" aria-hidden="true">
        <div class="ticker-track">
          <span>f(x)=x⁵+2x³</span>
          <span class="on">d/dx [ln(3x)]</span>
          <span>y=cos(x²)</span>
          <span>f(x)=e^{2x}·x³</span>
        </div>
      </div>
    </div>
  `,
});

// 19 — Editorial folio: oversized brand wordmark stacked above a thin ink rule + problem
add({
  id: 19,
  title: 'Editorial folio rule',
  fonts: ['newsreader', 'dmSans'],
  motionNote: 'rise+fade',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f6f5f1; }
    .folio { max-width: 820px; margin: 0 auto; padding: 1.5rem 1.5rem 4rem; }
    .brand {
      font-family: 'Newsreader', serif; font-size: clamp(3.4rem, 9vw, 5.6rem);
      font-weight: 600; letter-spacing: -0.035em; line-height: 0.95; margin: 2.5rem 0 1.25rem;
    }
    .brand em { font-style: italic; font-weight: 400; }
    .rule {
      height: 2px; background: #111; width: 0; margin-bottom: 1.5rem;
      animation: growRule 900ms 200ms ease forwards;
    }
    @keyframes growRule { to { width: 100%; } }
    .lead { color: var(--muted); font-size: 1.1rem; line-height: 1.55; max-width: 32rem; margin: 0 0 1.75rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 3rem; }
    .problem {
      padding: 2rem 0 0; border-top: 1px solid var(--line);
      font-family: 'Newsreader', serif; font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-style: italic; color: #222;
    }
  `,
  body: `
    <div class="folio">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">guide</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative <em>Duel</em></h1>
      <div class="rule" aria-hidden="true"></div>
      <p class="lead anim-rise-2">A quiet page for a loud match. Differentiate faster than the person across from you.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play now</a>
        <a class="cta-ghost" href="#">View ELO board</a>
      </div>
      <p class="problem anim-fade" aria-hidden="true">Find f′ when f(x) = sin(x²)</p>
    </div>
  `,
});

// 20 — Asymmetric slate: copy top-left, tall equation column
add({
  id: 20,
  title: 'Asymmetric slate column',
  fonts: ['geist', 'ibmMono'],
  motionNote: 'rise+fade+pulse',
  css: `
    :root { --ink: #243447; --paper: #f3f5f7; --soft: #e7ebf0; }
    body { font-family: 'Geist', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .shell {
      min-height: 100vh; display: grid; grid-template-columns: 1.25fr 0.75fr;
    }
    @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
    .main { padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; }
    .brand {
      font-size: clamp(2.8rem, 6vw, 4.2rem); font-weight: 700; letter-spacing: -0.045em;
      margin: auto 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .col {
      background: var(--soft); display: grid; place-items: center; padding: 2rem 1rem;
      border-left: 1px solid var(--line); position: relative;
    }
    @media (max-width: 800px) { .col { min-height: 240px; border-left: none; border-top: 1px solid var(--line); } }
    .col .eq {
      font-family: 'IBM Plex Mono', monospace; font-size: clamp(1rem, 2.2vw, 1.25rem);
      writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: 0.04em;
      animation: pulseSoft 3.2s ease-in-out infinite;
    }
    @media (max-width: 800px) {
      .col .eq { writing-mode: horizontal-tb; transform: none; }
    }
  `,
  body: `
    <div class="shell">
      <div class="main">
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Slate-calm UI. Sharp problems. Live ELO after every round.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Queue ranked</a>
          <a class="cta-ghost" href="#">Invite friend</a>
        </div>
      </div>
      <aside class="col anim-fade" aria-hidden="true">
        <p class="eq">d/dx [ (2x+1)⁵ ]</p>
      </aside>
    </div>
  `,
});

// 21 — Centered brand with animated underline, forest soft wash visual
add({
  id: 21,
  title: 'Underline brand forest',
  fonts: ['fraunces', 'ibmPlex'],
  motionNote: 'rise+fade+draw',
  css: `
    :root { --ink: #1f3d2c; --paper: #f3f6f3; --soft: #e6eee8; }
    body { font-family: 'IBM Plex Sans', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .cta-ghost:hover { border-color: var(--ink); }
    .wrap { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 3rem; text-align: center; }
    .brand {
      font-family: 'Fraunces', serif; font-size: clamp(3rem, 8vw, 4.8rem);
      margin: 2.5rem 0 0.5rem; letter-spacing: -0.03em; display: inline-block; position: relative;
    }
    .brand::after {
      content: ''; position: absolute; left: 8%; right: 8%; bottom: 0.08em; height: 2px;
      background: var(--ink); transform: scaleX(0); transform-origin: left;
      animation: drawLine 800ms 350ms ease forwards;
    }
    @keyframes drawLine { to { transform: scaleX(1); } }
    .lead { color: #5a6b5f; line-height: 1.55; margin: 1.25rem auto 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .wash {
      margin-top: 3rem; min-height: 260px;
      background:
        radial-gradient(ellipse at 50% 80%, var(--soft) 0%, transparent 55%),
        linear-gradient(180deg, transparent, #e8efe9);
      display: grid; place-items: center; border-top: 1px solid #d5ddd6;
    }
    .wash .eq {
      font-family: 'Fraunces', serif; font-style: italic;
      font-size: clamp(1.5rem, 4vw, 2.2rem); opacity: 0.85;
    }
  `,
  body: `
    <nav class="nav anim-fade">
      <div class="brand-mark">∂</div>
      <div class="nav-links"><a href="#">faq</a><a href="#">login</a></div>
    </nav>
    <main class="wrap">
      <p class="brand-mark anim-rise" style="font-size:2.25rem;margin:0">∂</p>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Grow your rating like a quiet forest — one correct derivative at a time.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
    </main>
    <section class="wash anim-fade" aria-hidden="true">
      <p class="eq">f(x)=√(4x+1) → f′(x)</p>
    </section>
  `,
});

// 22 — Split duel: You vs Them scoreboard visual
add({
  id: 22,
  title: 'Duel scoreboard split',
  fonts: ['archivo', 'ibmMono'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'Archivo', sans-serif; background: #f7f7f5; }
    .page { min-height: 100vh; display: flex; flex-direction: column; }
    .copy { max-width: 720px; margin: 0 auto; padding: 1.5rem 1.5rem 2rem; width: 100%; }
    .brand {
      font-weight: 800; font-size: clamp(2.8rem, 7vw, 4.4rem); letter-spacing: -0.045em;
      margin: 2rem 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 32rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .board {
      margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line);
      min-height: 280px;
    }
    .side {
      display: grid; place-items: center; padding: 2rem 1rem; text-align: center;
      font-family: 'IBM Plex Mono', monospace;
    }
    .side.a { background: #fff; }
    .side.b { background: #111; color: #f2f2ee; }
    .side .label { font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; margin-bottom: 0.75rem; }
    .side .score { font-size: clamp(3rem, 8vw, 4.5rem); font-weight: 700; line-height: 1; }
    .side.a .score { animation: pulseSoft 2.8s ease-in-out infinite; }
    .vs {
      position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
      width: 2.5rem; height: 2.5rem; background: var(--paper); border: 1px solid var(--line);
      display: grid; place-items: center; font-size: 0.7rem; letter-spacing: 0.08em; font-weight: 600;
    }
    .board-wrap { position: relative; }
  `,
  body: `
    <div class="page">
      <div class="copy">
        <nav class="nav anim-fade" style="padding:0">
          <div class="brand-mark">∂ Derivative Duel</div>
          <div class="nav-links"><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">First to three. One problem. Two players. Zero partial credit.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Find opponent</a>
          <a class="cta-ghost" href="#">Private room</a>
        </div>
      </div>
      <div class="board-wrap anim-fade" aria-hidden="true">
        <div class="board">
          <div class="side a"><div><div class="label">You</div><div class="score">2</div></div></div>
          <div class="side b"><div><div class="label">Them</div><div class="score">1</div></div></div>
        </div>
        <div class="vs">VS</div>
      </div>
    </div>
  `,
});

// 23 — Narrow monochrome essay column with drifting ∂
add({
  id: 23,
  title: 'Narrow essay drift',
  fonts: ['literata', 'dmSans'],
  motionNote: 'rise+drift+fade',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #fafaf8; }
    .col { max-width: 460px; margin: 0 auto; padding: 2rem 1.25rem 4rem; position: relative; }
    .drift-mark {
      position: absolute; right: -0.5rem; top: 6rem;
      font-family: 'Literata', serif; font-size: 7rem; color: rgba(0,0,0,0.05);
      animation: drift 4.5s ease-in-out infinite alternate; pointer-events: none;
    }
    .brand {
      font-family: 'Literata', serif; font-size: clamp(2.6rem, 8vw, 3.5rem);
      margin: 2.5rem 0 1rem; letter-spacing: -0.03em; line-height: 1.05;
    }
    .lead { color: var(--muted); line-height: 1.65; margin: 0 0 1.75rem; }
    .actions { display: grid; gap: 0.6rem; }
    .cta, .cta-ghost { width: 100%; border-radius: 2px; }
    .visual {
      margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line);
      font-family: 'Literata', serif; font-size: 1.35rem; font-style: italic; color: #333;
    }
  `,
  body: `
    <div class="col">
      <div class="drift-mark" aria-hidden="true">∂</div>
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Read the problem once. Answer before they finish reading it twice.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Challenge a friend</a>
      </div>
      <p class="visual anim-fade" aria-hidden="true">y = tan(x) · x² — find dy/dx</p>
    </div>
  `,
});

// 24 — Top media: full-bleed axis grid, brand below
add({
  id: 24,
  title: 'Axis grid media top',
  fonts: ['ibmPlex', 'ibmMono'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f7f7f5; }
    .media {
      min-height: 46vh; border-bottom: 1px solid var(--line);
      background-color: #efefe9;
      background-image:
        linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
      background-size: 40px 40px;
      display: grid; place-items: center; position: relative;
    }
    .media svg { width: min(90%, 520px); height: auto; }
    .stroke {
      fill: none; stroke: #111; stroke-width: 2; stroke-linecap: round;
      stroke-dasharray: 280; animation: draw 1.4s ease both;
    }
    .copy { max-width: 680px; margin: 0 auto; padding: 2.25rem 1.5rem 4rem; }
    .brand {
      font-size: clamp(2.5rem, 6vw, 3.6rem); font-weight: 600; letter-spacing: -0.035em; margin: 0 0 0.75rem;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.92rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <nav class="nav anim-fade">
      <div class="brand-mark">∂ Derivative Duel</div>
      <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
    </nav>
    <section class="media anim-fade" aria-hidden="true">
      <svg viewBox="0 0 320 160" aria-hidden="true">
        <path class="stroke" d="M20 120 Q 80 120 110 70 T 200 50 T 300 30" />
      </svg>
    </section>
    <main class="copy">
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Grid up. Clock on. Outpace your opponent on f′(x).</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start duel</a>
        <a class="cta-ghost" href="#">How to play</a>
      </div>
    </main>
  `,
});

// 25 — Olive studio: brand as huge left stack, soft rectangle visual
add({
  id: 25,
  title: 'Olive stacked brand',
  fonts: ['syne', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    :root { --ink: #3a3f2b; --paper: #f6f5ec; --soft: #ecead9; }
    body { font-family: 'IBM Plex Sans', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .layout {
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    }
    @media (max-width: 800px) { .layout { grid-template-columns: 1fr; } }
    .left { padding: 1.5rem 1.75rem 3rem; display: flex; flex-direction: column; }
    .brand {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(3.2rem, 9vw, 5.5rem);
      letter-spacing: -0.055em; line-height: 0.88; margin: auto 0 1rem;
    }
    .lead { color: #6a6d5c; line-height: 1.55; margin: 0 0 1.75rem; max-width: 26rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .right {
      display: grid; place-items: center; padding: 2rem; background: var(--soft);
    }
    .block {
      width: min(100%, 280px); aspect-ratio: 3/4; background: #f6f5ec;
      border: 1px solid #c9c6b4; display: grid; place-items: center;
      animation: drift 4s ease-in-out infinite alternate;
    }
    .block .eq { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; text-align: center; padding: 1rem; }
  `,
  body: `
    <div class="layout">
      <div class="left">
        <nav class="nav anim-fade" style="padding:0">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Deriva-<br/>tive<br/>Duel</h1>
        <p class="lead anim-rise-2">Stacked type. Straight matches. Climb when the chain rule clicks under pressure.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play</a>
          <a class="cta-ghost" href="#">Learn</a>
        </div>
      </div>
      <aside class="right anim-fade" aria-hidden="true">
        <div class="block"><p class="eq">f(x)=x⁷−4x⁵<br/>find f′</p></div>
      </aside>
    </div>
  `,
});

// 26 — Countdown ring visual with jetbrains mono
add({
  id: 26,
  title: 'Countdown ring arena',
  fonts: ['jetbrains', 'spaceGrotesk'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'Space Grotesk', sans-serif; background: #f4f4f1; }
    .arena {
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 800px) { .arena { grid-template-columns: 1fr; } .ring-pane { order: -1; min-height: 40vh; } }
    .copy { padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; }
    .brand {
      font-weight: 700; font-size: clamp(2.6rem, 6vw, 3.8rem); letter-spacing: -0.04em;
      margin: auto 0 0.75rem;
    }
    .lead {
      font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--muted);
      line-height: 1.6; margin: 0 0 1.75rem; max-width: 28rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .ring-pane {
      background: #111; color: #f0f0ec; display: grid; place-items: center;
    }
    .ring-wrap { position: relative; width: 200px; height: 200px; }
    .ring-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .track { fill: none; stroke: rgba(255,255,255,0.12); stroke-width: 6; }
    .progress {
      fill: none; stroke: #f0f0ec; stroke-width: 6; stroke-linecap: round;
      stroke-dasharray: 283; stroke-dashoffset: 90;
      animation: draw 1.5s ease both, pulseSoft 2.5s ease-in-out 1.5s infinite;
    }
    .seconds {
      position: absolute; inset: 0; display: grid; place-items: center; transform: rotate(0);
      font-family: 'JetBrains Mono', monospace; font-size: 2.5rem; font-weight: 700;
    }
  `,
  body: `
    <div class="arena">
      <section class="copy">
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂ Derivative Duel</div>
          <div class="nav-links"><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">countdown.start() — answer before the ring closes.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </section>
      <aside class="ring-pane anim-fade" aria-hidden="true">
        <div class="ring-wrap">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="45" />
            <circle class="progress" cx="50" cy="50" r="45" />
          </svg>
          <div class="seconds">12</div>
        </div>
      </aside>
    </div>
  `,
});

// 27 — Rust accent hairline frame, instrument brand
add({
  id: 27,
  title: 'Rust hairline frame',
  fonts: ['instrument', 'dmSans'],
  motionNote: 'rise+fade+pulse',
  css: `
    :root { --ink: #5c2e1f; --paper: #f8f4f1; --soft: #f0e7e2; }
    body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: #1a1412; padding: 1rem; }
    .cta { background: var(--ink); }
    .cta-ghost { border-color: #d4c4bb; }
    .frame {
      border: 1px solid #d4c4bb; min-height: calc(100vh - 2rem);
      display: grid; grid-template-rows: auto 1fr auto; background: #fffaf7;
    }
    .inner { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem; width: 100%; display: flex; flex-direction: column; justify-content: center; }
    .brand {
      font-family: 'Instrument Serif', serif; font-size: clamp(3rem, 8vw, 4.8rem);
      margin: 0 0 1rem; letter-spacing: -0.03em; color: var(--ink);
    }
    .lead { color: #6e5a52; line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .footer-eq {
      border-top: 1px solid #d4c4bb; padding: 1.25rem 1.5rem; text-align: center;
      font-family: 'Instrument Serif', serif; font-style: italic; font-size: 1.25rem;
      background: var(--soft); color: var(--ink);
      animation: pulseSoft 3.5s ease-in-out infinite;
    }
  `,
  body: `
    <div class="frame anim-fade">
      <nav class="nav">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <main class="inner">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Warm paper. Cool head. Race the derivative before the timer cools you.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Enter a match</a>
          <a class="cta-ghost" href="#">Daily problem</a>
        </div>
      </main>
      <div class="footer-eq" aria-hidden="true">f(x)=e^{2x}·x³ → f′(x)</div>
    </div>
  `,
});

// 28 — Wide Geist: brand + CTA left, animated partial symbol mosaic right
add({
  id: 28,
  title: 'Partial mosaic wide',
  fonts: ['geist', 'ibmPlex'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f6f6f4; }
    .wide {
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; max-width: 1200px; margin: 0 auto;
    }
    @media (max-width: 800px) { .wide { grid-template-columns: 1fr; } }
    .copy { padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; }
    .brand {
      font-family: 'Geist', sans-serif; font-weight: 700;
      font-size: clamp(2.8rem, 5.5vw, 4rem); letter-spacing: -0.045em; margin: auto 0 0.75rem;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .mosaic {
      display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);
      gap: 1px; background: var(--line); min-height: 100%; border-left: 1px solid var(--line);
    }
    @media (max-width: 800px) { .mosaic { min-height: 240px; border-left: none; border-top: 1px solid var(--line); } }
    .cell {
      background: #fff; display: grid; place-items: center;
      font-family: 'Geist', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); color: #bbb;
    }
    .cell.on { color: #111; animation: pulseSoft 2.8s ease-in-out infinite; }
    .cell:nth-child(even) { background: #f0f0ec; }
  `,
  body: `
    <div class="wide">
      <section class="copy">
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">faq</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Nine cells of calm. One correct answer. A match that feels like focus, not noise.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </section>
      <aside class="mosaic anim-fade" aria-hidden="true">
        <div class="cell">∂</div><div class="cell">′</div><div class="cell on">∂</div>
        <div class="cell">d</div><div class="cell on">∂</div><div class="cell">x</div>
        <div class="cell on">∂</div><div class="cell">ƒ</div><div class="cell">∂</div>
      </aside>
    </div>
  `,
});

// 29 — Navy left rule manifesto with Archivo
add({
  id: 29,
  title: 'Navy manifesto rule',
  fonts: ['archivo', 'literata'],
  motionNote: 'rise+fade+draw',
  css: `
    :root { --ink: #152238; --paper: #f2f4f8; --soft: #e4e8f0; }
    body { font-family: 'Literata', serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); font-family: 'Archivo', sans-serif; }
    .cta-ghost { font-family: 'Archivo', sans-serif; }
    .wrap { max-width: 760px; margin: 0 auto; padding: 1.5rem 1.5rem 4rem; }
    .manifest {
      margin: 2.5rem 0 0; padding-left: 1.5rem; border-left: 3px solid var(--ink);
      position: relative;
    }
    .manifest::before {
      content: ''; position: absolute; left: -3px; top: 0; width: 3px; height: 0;
      background: #3d5a80; animation: growBar 1s ease forwards;
    }
    @keyframes growBar { to { height: 100%; } }
    .brand {
      font-family: 'Archivo', sans-serif; font-weight: 800;
      font-size: clamp(2.8rem, 7vw, 4.2rem); letter-spacing: -0.04em; margin: 0 0 1rem; line-height: 0.95;
    }
    .lead { color: #5a6575; line-height: 1.6; margin: 0 0 1.75rem; max-width: 32rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .eq-line {
      font-size: 1.35rem; color: var(--ink); opacity: 0.85; padding-top: 1.5rem;
      border-top: 1px solid #cfd6e0;
    }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">login</a></div>
      </nav>
      <div class="manifest">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">A manifesto for students who treat the chain rule like a sport.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Queue now</a>
          <a class="cta-ghost" href="#">Read the rules</a>
        </div>
        <p class="eq-line anim-fade" aria-hidden="true">Prove d/dx [ln(3x)] before they do.</p>
      </div>
    </div>
  `,
});

// 30 — Bottom action bar + floating equation plane
add({
  id: 30,
  title: 'Floating equation + bar',
  fonts: ['fraunces', 'geist'],
  motionNote: 'rise+drift+fade',
  css: `
    body {
      font-family: 'Geist', sans-serif; background: #f5f5f2;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .stage {
      flex: 1; display: flex; flex-direction: column; justify-content: center;
      padding: 2rem 1.5rem; max-width: 800px; margin: 0 auto; width: 100%;
    }
    .eq-plane {
      min-height: 200px; margin-bottom: 2.5rem;
      background:
        radial-gradient(circle at 40% 50%, #e8e8e0 0%, transparent 45%),
        linear-gradient(160deg, #efefe8, #f7f7f5);
      border: 1px solid var(--line); display: grid; place-items: center;
    }
    .eq-plane .eq {
      font-family: 'Fraunces', serif; font-size: clamp(1.8rem, 5vw, 2.8rem);
      animation: drift 3.8s ease-in-out infinite alternate;
    }
    .brand {
      font-family: 'Fraunces', serif; font-size: clamp(2.6rem, 6vw, 3.8rem);
      margin: 0 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0; max-width: 32rem; }
    .bar {
      border-top: 1px solid var(--line); background: #fff;
      padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center;
      gap: 1rem; flex-wrap: wrap;
    }
    .bar .brand-mini {
      font-family: 'Fraunces', serif; font-size: 1.25rem;
    }
    .actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  `,
  body: `
    <nav class="nav anim-fade">
      <div class="brand-mark">∂</div>
      <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
    </nav>
    <main class="stage">
      <div class="eq-plane anim-fade" aria-hidden="true">
        <p class="eq">f(x)=(2x+1)⁵</p>
      </div>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">The problem floats. Your answer shouldn't.</p>
    </main>
    <div class="bar anim-rise-3">
      <span class="brand-mini">∂ Derivative Duel</span>
      <div class="actions">
        <a class="cta" href="#">Play random</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
    </div>
  `,
});

// ---------------------------------------------------------------------------
// Handcrafted heroes 31–45 (unique composition / type / accent each)
// ---------------------------------------------------------------------------

// 31 — Diagonal wash: brand sits above a slanted equation plane
add({
  id: 31,
  title: 'Diagonal equation wash',
  fonts: ['syne', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f4f5f2; }
    .page { min-height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .copy { max-width: 640px; padding: 1.5rem 1.5rem 2rem; position: relative; z-index: 1; }
    .brand {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(2.8rem, 7vw, 4.4rem); letter-spacing: -0.05em;
      margin: 2rem 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .slash {
      margin-top: auto; min-height: min(42vh, 340px); position: relative;
      background: linear-gradient(165deg, #e8ebe4 0%, #f4f5f2 55%, #fff 100%);
      border-top: 1px solid var(--line);
    }
    .slash .eq {
      position: absolute; left: 8%; bottom: 28%;
      font-family: 'Syne', sans-serif; font-weight: 700;
      font-size: clamp(1.6rem, 4vw, 2.4rem); letter-spacing: -0.03em;
      transform: rotate(-8deg); animation: drift 4s ease-in-out infinite alternate;
    }
    .slash::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(0,0,0,0.03) 40.5%, transparent 41%);
      animation: fade 1.2s ease both;
    }
  `,
  body: `
    <div class="page">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Cut through the problem on a slant — 1v1 calculus with a calm edge.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </div>
      <div class="slash anim-fade" aria-hidden="true">
        <p class="eq">d/dx [ x⁷ − 4x⁵ ]</p>
      </div>
    </div>
  `,
});

// 32 — Polar / radial coordinate stage as dominant visual
add({
  id: 32,
  title: 'Polar grid stage',
  fonts: ['jetbrains', 'dmSans'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f6f7f8; }
    .shell { max-width: 880px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; }
    .hero {
      display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;
      min-height: calc(100vh - 6rem);
    }
    @media (max-width: 800px) { .hero { grid-template-columns: 1fr; } }
    .brand {
      font-family: 'JetBrains Mono', monospace; font-weight: 700;
      font-size: clamp(2.4rem, 5vw, 3.4rem); letter-spacing: -0.04em; margin: 0 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 26rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .polar {
      aspect-ratio: 1; width: 100%; max-width: 380px; margin: 0 auto;
      border-radius: 50%; border: 1px solid var(--line);
      background:
        radial-gradient(circle, transparent 28%, rgba(0,0,0,0.04) 28.5%, transparent 29%),
        radial-gradient(circle, transparent 48%, rgba(0,0,0,0.04) 48.5%, transparent 49%),
        radial-gradient(circle, transparent 68%, rgba(0,0,0,0.04) 68.5%, transparent 69%),
        #eef0f3;
      display: grid; place-items: center; position: relative;
    }
    .polar .dot {
      width: 10px; height: 10px; border-radius: 50%; background: #152238;
      animation: pulseSoft 2.4s ease-in-out infinite;
    }
    .polar .ray {
      position: absolute; width: 1px; height: 46%; top: 4%; left: 50%;
      background: rgba(21,34,56,0.25); transform-origin: bottom center;
      animation: drift 5s ease-in-out infinite alternate;
    }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0 0 1rem">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
      </nav>
      <div class="hero">
        <div>
          <h1 class="brand anim-rise">Derivative Duel</h1>
          <p class="lead anim-rise-2">Every answer moves the radius. Ranked matches in polar calm.</p>
          <div class="actions anim-rise-3">
            <a class="cta" href="#">Queue ranked</a>
            <a class="cta-ghost" href="#">Practice</a>
          </div>
        </div>
        <div class="polar anim-fade" aria-hidden="true">
          <div class="ray"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  `,
});

// 33 — Round timeline: three quiet ticks as the visual
add({
  id: 33,
  title: 'Three-round timeline',
  fonts: ['archivo', 'ibmMono'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'Archivo', sans-serif; background: #f7f6f3; }
    .wrap { max-width: 720px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; }
    .brand {
      font-weight: 800; font-size: clamp(2.8rem, 7vw, 4.2rem);
      letter-spacing: -0.045em; margin: 2.25rem 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 32rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 3rem; }
    .timeline {
      border-top: 1px solid var(--line); padding-top: 2rem;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;
      position: relative;
    }
    .timeline::before {
      content: ''; position: absolute; top: 2rem; left: 8%; right: 8%; height: 1px;
      background: #cfcfc8; z-index: 0;
    }
    .tick {
      text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted);
      position: relative; z-index: 1;
    }
    .tick .node {
      width: 12px; height: 12px; border-radius: 50%; background: #fff;
      border: 2px solid #111; margin: 0 auto 0.75rem;
    }
    .tick.on .node { background: #111; animation: pulseSoft 2s ease-in-out infinite; }
    .tick .eq { margin-top: 0.5rem; font-size: 0.85rem; letter-spacing: 0; text-transform: none; color: #333; }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Three rounds. One winner. A timeline you can feel in your pulse.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">Daily challenge</a>
      </div>
      <div class="timeline anim-fade" aria-hidden="true">
        <div class="tick"><div class="node"></div>Round 1<div class="eq">f′ done</div></div>
        <div class="tick on"><div class="node"></div>Round 2<div class="eq">live</div></div>
        <div class="tick"><div class="node"></div>Round 3<div class="eq">—</div></div>
      </div>
    </div>
  `,
});

// 34 — Layered translucent equations stacked as the hero visual
add({
  id: 34,
  title: 'Layered equation stack',
  fonts: ['instrument', 'geist'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'Geist', sans-serif; background: #f8f7f4; }
    .layout {
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 820px) { .layout { grid-template-columns: 1fr; } }
    .copy { padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; }
    .brand {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(2.8rem, 6vw, 4rem); margin: auto 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 26rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .stack {
      background: #efeee8; display: grid; place-items: center;
      border-left: 1px solid var(--line); padding: 2rem; position: relative; overflow: hidden;
    }
    @media (max-width: 820px) { .stack { min-height: 280px; border-left: none; border-top: 1px solid var(--line); } }
    .layer {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(1.4rem, 3vw, 2rem); position: absolute;
      color: rgba(17,17,17,0.12);
    }
    .layer.a { transform: translate(-12px, -28px); animation: drift 4s ease-in-out infinite alternate; }
    .layer.b { transform: translate(8px, 0); color: rgba(17,17,17,0.28); animation: drift 5s ease-in-out 0.4s infinite alternate; }
    .layer.c { transform: translate(18px, 32px); color: #111; animation: fade 900ms ease both; }
  `,
  body: `
    <div class="layout">
      <div class="copy">
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">guide</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Peel the layers. The true rate of change sits on top.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play now</a>
          <a class="cta-ghost" href="#">Invite friend</a>
        </div>
      </div>
      <aside class="stack anim-fade" aria-hidden="true">
        <span class="layer a">f(x)=e^{2x}·x³</span>
        <span class="layer b">f(x)=e^{2x}·x³</span>
        <span class="layer c">f′(x)=…</span>
      </aside>
    </div>
  `,
});

// 35 — Corner-pinned brand over expansive graph paper field
add({
  id: 35,
  title: 'Corner brand graph field',
  fonts: ['spaceGrotesk', 'ibmMono'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'IBM Plex Mono', monospace; background: #f2f3f0; }
    .field {
      min-height: 100vh;
      background-image:
        linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px);
      background-size: 32px 32px;
      display: flex; flex-direction: column;
    }
    .corner {
      margin-top: auto; padding: 2rem 1.5rem 3rem; max-width: 560px;
      background: linear-gradient(180deg, transparent, rgba(242,243,240,0.92) 18%);
    }
    .brand {
      font-family: 'Space Grotesk', sans-serif; font-weight: 700;
      font-size: clamp(2.6rem, 7vw, 4rem); letter-spacing: -0.045em; margin: 0 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.75rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .curve-wrap { position: absolute; inset: 12% 8% 35% 8%; pointer-events: none; }
    .field { position: relative; }
    .curve {
      fill: none; stroke: #1a1a1a; stroke-width: 1.75;
      stroke-dasharray: 500; animation: draw 1.8s ease both;
    }
  `,
  body: `
    <div class="field">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <svg class="curve-wrap" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
        <path class="curve" d="M20 240 C 140 240, 180 60, 300 100 S 480 260, 600 140 S 740 40, 780 70" />
      </svg>
      <div class="corner">
        <h1 class="brand anim-rise">∂ Derivative Duel</h1>
        <p class="lead anim-rise-2">Graph paper, full bleed. Your rating draws the next segment.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </div>
    </div>
  `,
});

// 36 — Terminal prompt with blinking caret as dominant visual
add({
  id: 36,
  title: 'Prompt caret terminal',
  fonts: ['jetbrains', 'ibmPlex'],
  motionNote: 'rise+fade+pulse',
  css: `
    :root { --ink: #1a2a1f; --paper: #f3f5f2; }
    body { font-family: 'IBM Plex Sans', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .shell { max-width: 680px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; }
    .brand {
      font-family: 'JetBrains Mono', monospace; font-weight: 700;
      font-size: clamp(2.2rem, 5.5vw, 3.2rem); letter-spacing: -0.04em; margin: 2rem 0 0.75rem;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .prompt {
      border: 1px solid #c8d0c9; background: #eef2ee; padding: 1.75rem 1.25rem;
      font-family: 'JetBrains Mono', monospace; font-size: clamp(1rem, 2.5vw, 1.25rem);
      min-height: 140px; display: flex; align-items: center;
    }
    .caret {
      display: inline-block; width: 0.55ch; height: 1.1em; background: var(--ink);
      margin-left: 2px; vertical-align: text-bottom;
      animation: pulseSoft 1.1s steps(1) infinite;
    }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">docs</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Type the derivative. Hit enter before they do. No partial credit.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Enter matchmaking</a>
        <a class="cta-ghost" href="#">Warm-up drills</a>
      </div>
      <div class="prompt anim-fade" aria-hidden="true">
        <span>&gt; prove d/dx [ ln(3x) ] <span class="caret"></span></span>
      </div>
    </div>
  `,
});

// 37 — Before → after transform: f(x) becomes f′(x)
add({
  id: 37,
  title: 'Before after transform',
  fonts: ['fraunces', 'dmSans'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f5f4f0; }
    .page { min-height: 100vh; display: flex; flex-direction: column; }
    .copy { max-width: 700px; margin: 0 auto; padding: 1.5rem 1.5rem 2rem; width: 100%; }
    .brand {
      font-family: 'Fraunces', serif; font-size: clamp(2.8rem, 7vw, 4.2rem);
      margin: 2rem 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 32rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .transform {
      margin-top: auto; display: grid; grid-template-columns: 1fr auto 1fr;
      align-items: center; gap: 1rem; padding: 2.5rem 1.5rem;
      border-top: 1px solid var(--line);
      background: linear-gradient(180deg, #ebeae4, #f5f4f0);
      min-height: 220px;
    }
    .transform .side {
      font-family: 'Fraunces', serif; font-size: clamp(1.3rem, 3.5vw, 1.9rem);
      text-align: center;
    }
    .transform .side.from { opacity: 0.45; }
    .transform .side.to { animation: drift 3.5s ease-in-out infinite alternate; }
    .arrow {
      font-size: 1.5rem; color: #555; animation: fade 1s 200ms ease both;
    }
  `,
  body: `
    <div class="page">
      <div class="copy">
        <nav class="nav anim-fade" style="padding:0">
          <div class="brand-mark">∂ Derivative Duel</div>
          <div class="nav-links"><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Watch the function change state. Be the first to name what it becomes.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </div>
      <div class="transform anim-fade" aria-hidden="true">
        <div class="side from">f(x)=cos(x²)</div>
        <div class="arrow">→</div>
        <div class="side to">f′(x)=…</div>
      </div>
    </div>
  `,
});

// 38 — Arc timer / countdown ring as the visual anchor
add({
  id: 38,
  title: 'Countdown arc ring',
  fonts: ['geist', 'ibmMono'],
  motionNote: 'rise+fade+draw',
  css: `
    :root { --ink: #243447; --paper: #f2f4f7; }
    body { font-family: 'Geist', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .shell {
      max-width: 900px; margin: 0 auto; padding: 1.5rem;
      min-height: 100vh; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 2rem; align-items: center;
    }
    @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
    .brand {
      font-size: clamp(2.6rem, 6vw, 3.8rem); font-weight: 700;
      letter-spacing: -0.045em; margin: 0 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .ring-wrap { display: grid; place-items: center; }
    .ring { width: min(100%, 280px); aspect-ratio: 1; }
    .ring circle.track { fill: none; stroke: #d5dbe3; stroke-width: 3; }
    .ring circle.arc {
      fill: none; stroke: var(--ink); stroke-width: 3; stroke-linecap: round;
      stroke-dasharray: 220; stroke-dashoffset: 70;
      transform: rotate(-90deg); transform-origin: center;
      animation: draw 1.6s ease both;
    }
    .ring .sec {
      font-family: 'IBM Plex Mono', monospace; font-size: 2.5rem; font-weight: 500;
      animation: pulseSoft 2s ease-in-out infinite;
    }
  `,
  body: `
    <div class="shell">
      <div>
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">The clock is quiet until it isn't. Race the arc, not the noise.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Find opponent</a>
          <a class="cta-ghost" href="#">Private room</a>
        </div>
      </div>
      <div class="ring-wrap anim-fade" aria-hidden="true">
        <svg class="ring" viewBox="0 0 100 100">
          <circle class="track" cx="50" cy="50" r="42" />
          <circle class="arc" cx="50" cy="50" r="42" />
          <text class="sec" x="50" y="56" text-anchor="middle" fill="#243447">12</text>
        </svg>
      </div>
    </div>
  `,
});

// 39 — Contour / level-curve landscape as atmosphere
add({
  id: 39,
  title: 'Contour landscape',
  fonts: ['literata', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    :root { --ink: #3a3f2b; --paper: #f5f5ec; --soft: #ecead9; }
    body { font-family: 'IBM Plex Sans', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .cta-ghost:hover { border-color: var(--ink); }
    .scene { min-height: 100vh; display: flex; flex-direction: column; }
    .copy { max-width: 640px; padding: 1.5rem 1.5rem 2rem; }
    .brand {
      font-family: 'Literata', serif; font-size: clamp(2.8rem, 7vw, 4.2rem);
      margin: 2rem 0 0.75rem; letter-spacing: -0.03em; line-height: 1;
    }
    .lead { color: #5c6150; line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .contours {
      margin-top: auto; min-height: min(40vh, 300px); background: var(--soft);
      border-top: 1px solid #d8d6c4; overflow: hidden; position: relative;
    }
    .contours svg { width: 100%; height: 100%; display: block; min-height: 260px; }
    .contours path {
      fill: none; stroke: var(--ink); stroke-width: 1; opacity: 0.35;
      animation: drift 6s ease-in-out infinite alternate;
    }
    .contours path:nth-child(2) { opacity: 0.5; animation-delay: 0.3s; }
    .contours path:nth-child(3) { opacity: 0.7; animation-delay: 0.6s; }
  `,
  body: `
    <div class="scene">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">faq</a><a href="#">login</a></div>
      </nav>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Level curves of skill. Climb by answering faster and cleaner.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">View ELO board</a>
        </div>
      </div>
      <div class="contours anim-fade" aria-hidden="true">
        <svg viewBox="0 0 800 260" preserveAspectRatio="none">
          <path d="M0 200 C 120 180, 200 220, 320 160 S 520 80, 640 120 S 760 180, 800 160" />
          <path d="M0 170 C 140 150, 220 190, 340 130 S 540 60, 660 100 S 760 150, 800 130" />
          <path d="M0 140 C 160 120, 240 160, 360 100 S 560 40, 680 80 S 760 120, 800 100" />
        </svg>
      </div>
    </div>
  `,
});

// 40 — Cascading type ladder: brand steps down the page
add({
  id: 40,
  title: 'Cascading type ladder',
  fonts: ['syne', 'newsreader'],
  motionNote: 'rise+fade',
  css: `
    body { font-family: 'Newsreader', serif; background: #f7f6f4; }
    .ladder { max-width: 760px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; }
    .steps { margin: 2rem 0 1.5rem; }
    .steps span {
      display: block; font-family: 'Syne', sans-serif; font-weight: 800;
      letter-spacing: -0.05em; line-height: 0.92; color: rgba(17,17,17,0.12);
    }
    .steps span:nth-child(1) { font-size: clamp(2.2rem, 6vw, 3.2rem); animation: rise 600ms ease both; }
    .steps span:nth-child(2) { font-size: clamp(2.8rem, 7.5vw, 4rem); margin-left: 1.5rem; color: rgba(17,17,17,0.28); animation: rise 700ms 80ms ease both; }
    .steps span:nth-child(3) {
      font-size: clamp(3.4rem, 9vw, 5.2rem); margin-left: 3rem; color: #111;
      animation: rise 800ms 160ms ease both;
    }
    .lead { color: var(--muted); font-size: 1.1rem; line-height: 1.55; margin: 0 0 1.75rem; max-width: 32rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .visual {
      padding-top: 1.5rem; border-top: 1px solid var(--line);
      font-family: 'Syne', sans-serif; font-weight: 700;
      font-size: clamp(1.2rem, 3vw, 1.6rem); letter-spacing: -0.02em;
    }
  `,
  body: `
    <div class="ladder">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="steps" aria-hidden="true">
        <span>Derivative Duel</span>
        <span>Derivative Duel</span>
        <span>Derivative Duel</span>
      </div>
      <h1 class="visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">Derivative Duel</h1>
      <p class="lead anim-rise-2">Descend the ladder of difficulty. Each rung is a harder derivative.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Climb ranked</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
      <p class="visual anim-fade" aria-hidden="true">∂ · f(x)=(2x+1)⁵</p>
    </div>
  `,
});

// 41 — Soft olive oval stage cradling a single equation
add({
  id: 41,
  title: 'Olive oval equation',
  fonts: ['instrument', 'ibmPlex'],
  motionNote: 'rise+fade+pulse',
  css: `
    :root { --ink: #2c3320; --paper: #f4f5ee; --soft: #e4e8d8; }
    body { font-family: 'IBM Plex Sans', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .wrap { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem 3rem; text-align: center; }
    .brand {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(3rem, 8vw, 4.8rem); margin: 1.5rem 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: #5a6350; line-height: 1.55; margin: 0 auto 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .oval {
      margin: 3rem auto 0; width: min(100%, 520px); aspect-ratio: 1.6;
      border-radius: 50%; background: var(--soft);
      display: grid; place-items: center;
      box-shadow: inset 0 0 0 1px rgba(44,51,32,0.08);
    }
    .oval .eq {
      font-family: 'Instrument Serif', serif; font-style: italic;
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      animation: pulseSoft 3.5s ease-in-out infinite;
    }
  `,
  body: `
    <nav class="nav anim-fade">
      <div class="brand-mark">∂</div>
      <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
    </nav>
    <main class="wrap">
      <p class="brand-mark anim-rise" style="font-size:2.2rem;margin:0">∂</p>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">One equation in a quiet oval. Two minds racing to differentiate it.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Play now</a>
        <a class="cta-ghost" href="#">Daily challenge</a>
      </div>
      <div class="oval anim-fade" aria-hidden="true">
        <p class="eq">y = tan(x) · x²</p>
      </div>
    </main>
  `,
});

// 42 — Minimal 3-axis wireframe as spatial math object
add({
  id: 42,
  title: 'Wireframe axes object',
  fonts: ['archivo', 'jetbrains'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'Archivo', sans-serif; background: #f6f6f4; }
    .grid {
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }
    .copy { padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; border-right: 1px solid var(--line); }
    @media (max-width: 800px) { .copy { border-right: none; } }
    .brand {
      font-weight: 800; font-size: clamp(2.6rem, 6vw, 3.8rem);
      letter-spacing: -0.05em; margin: auto 0 0.75rem; line-height: 0.95;
    }
    .lead {
      font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;
      color: var(--muted); line-height: 1.65; margin: 0 0 1.75rem; max-width: 26rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .axes {
      display: grid; place-items: center; background: #efefeb; padding: 2rem;
      min-height: 300px;
    }
    .axes svg { width: min(80%, 280px); height: auto; animation: drift 5s ease-in-out infinite alternate; }
    .axes line { stroke: #111; stroke-width: 1.5; }
    .axes text { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: #555; }
  `,
  body: `
    <div class="grid">
      <div class="copy">
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂ Derivative Duel</div>
          <div class="nav-links"><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Orient yourself. Then differentiate under pressure.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Queue ranked</a>
          <a class="cta-ghost" href="#">Practice</a>
        </div>
      </div>
      <aside class="axes anim-fade" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <line x1="100" y1="180" x2="100" y2="20" />
          <line x1="20" y1="140" x2="180" y2="60" />
          <line x1="40" y1="60" x2="160" y2="160" />
          <text x="105" y="18">y</text>
          <text x="182" y="58">x</text>
          <text x="164" y="172">z</text>
        </svg>
      </aside>
    </div>
  `,
});

// 43 — Proof strip / receipt of steps scrolling gently
add({
  id: 43,
  title: 'Proof strip scroll',
  fonts: ['ibmMono', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f7f7f5; }
    .shell { max-width: 640px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; }
    .brand {
      font-size: clamp(2.6rem, 6.5vw, 3.8rem); font-weight: 600;
      letter-spacing: -0.04em; margin: 2rem 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .strip {
      border: 1px solid var(--line); background: #fff; padding: 1.5rem 1.25rem;
      font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; line-height: 1.9;
      overflow: hidden; max-height: 200px; position: relative;
    }
    .strip-inner { animation: drift 4.5s ease-in-out infinite alternate; }
    .strip .dim { opacity: 0.4; }
    .strip .hi { color: #111; font-weight: 500; }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">guide</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Show your work at speed. The strip records every clean step.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">Invite friend</a>
      </div>
      <div class="strip anim-fade" aria-hidden="true">
        <div class="strip-inner">
          <div class="dim">1. f(x) = x⁵ + 2x³</div>
          <div class="dim">2. power rule on each term</div>
          <div class="hi">3. f′(x) = 5x⁴ + 6x²</div>
          <div class="dim">4. submit · round won</div>
        </div>
      </div>
    </div>
  `,
});

// 44 — Horizon line with a single climbing point
add({
  id: 44,
  title: 'Horizon climbing point',
  fonts: ['newsreader', 'geist'],
  motionNote: 'rise+fade+drift',
  css: `
    :root { --ink: #1e2a32; --paper: #eef2f4; }
    body { font-family: 'Geist', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); }
    .scene { min-height: 100vh; display: flex; flex-direction: column; }
    .sky {
      flex: 1; min-height: 42vh; position: relative;
      background: linear-gradient(180deg, #dce6ec 0%, var(--paper) 70%);
      border-bottom: 1px solid #b7c4cc;
    }
    .point {
      position: absolute; left: 62%; bottom: -5px; width: 10px; height: 10px;
      border-radius: 50%; background: var(--ink);
      animation: drift 3.2s ease-in-out infinite alternate;
    }
    .copy { padding: 2rem 1.5rem 3rem; max-width: 640px; }
    .brand {
      font-family: 'Newsreader', serif; font-size: clamp(2.8rem, 7vw, 4.2rem);
      margin: 0 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <div class="scene">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="sky anim-fade" aria-hidden="true">
        <div class="point"></div>
      </div>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">A clear horizon. Your rating is the point that keeps rising.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </div>
    </div>
  `,
});

// 45 — Focus lens over f → f′ (magnified math detail)
add({
  id: 45,
  title: 'Focus lens detail',
  fonts: ['fraunces', 'dmSans'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f5f5f2; }
    .shell {
      max-width: 920px; margin: 0 auto; padding: 1.5rem;
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center;
    }
    @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
    .brand {
      font-family: 'Fraunces', serif; font-size: clamp(2.6rem, 6vw, 3.8rem);
      margin: 0 0 0.75rem; letter-spacing: -0.03em;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .lens-stage {
      aspect-ratio: 1; max-width: 340px; margin: 0 auto; width: 100%;
      display: grid; place-items: center; position: relative;
      background:
        radial-gradient(circle at 50% 50%, #eaeae2 0%, #f5f5f2 62%);
    }
    .lens {
      width: 70%; aspect-ratio: 1; border-radius: 50%;
      border: 2px solid #111; display: grid; place-items: center;
      background: rgba(255,255,255,0.55);
      animation: pulseSoft 3s ease-in-out infinite;
    }
    .lens .eq {
      font-family: 'Fraunces', serif; font-size: clamp(1.1rem, 2.5vw, 1.45rem);
      text-align: center; line-height: 1.4;
    }
    .lens .eq small { display: block; opacity: 0.45; font-size: 0.85em; }
  `,
  body: `
    <div class="shell">
      <div>
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Zoom in on the rate of change. Outpace whoever is across from you.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Enter matchmaking</a>
          <a class="cta-ghost" href="#">Warm-up</a>
        </div>
      </div>
      <div class="lens-stage anim-fade" aria-hidden="true">
        <div class="lens">
          <p class="eq"><small>f(x)=√(4x+1)</small>f′(x)=…</p>
        </div>
      </div>
    </div>
  `,
});

// ---------------------------------------------------------------------------
// Handcrafted heroes 46–60 (matrix loop disabled — all 60 are unique)
// ---------------------------------------------------------------------------

// 46 — Soft slope-field dots with brand in the quiet center
add({
  id: 46,
  title: 'Slope field center',
  fonts: ['instrument', 'ibmPlex'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f4f4f0; }
    .scene {
      min-height: 100vh; display: flex; flex-direction: column;
      background:
        radial-gradient(ellipse 70% 55% at 50% 45%, #e8e8e0 0%, transparent 60%),
        #f4f4f0;
    }
    .field {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden;
      background-image:
        radial-gradient(circle at 12% 18%, rgba(17,17,17,0.07) 1.2px, transparent 1.4px),
        radial-gradient(circle at 28% 62%, rgba(17,17,17,0.06) 1px, transparent 1.2px),
        radial-gradient(circle at 48% 30%, rgba(17,17,17,0.07) 1.2px, transparent 1.4px),
        radial-gradient(circle at 70% 55%, rgba(17,17,17,0.05) 1px, transparent 1.2px),
        radial-gradient(circle at 86% 22%, rgba(17,17,17,0.06) 1.2px, transparent 1.4px),
        radial-gradient(circle at 18% 80%, rgba(17,17,17,0.05) 1px, transparent 1.2px);
      background-size: 100% 100%;
      animation: pulseSoft 5s ease-in-out infinite;
    }
    .hero {
      position: relative; flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      padding: 2rem 1.5rem 4rem; max-width: 640px; margin: 0 auto;
    }
    .brand {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(3rem, 8vw, 4.8rem); letter-spacing: -0.03em;
      margin: 0 0 0.85rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
  `,
  body: `
    <div class="scene" style="position:relative">
      <div class="field" aria-hidden="true"></div>
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <main class="hero">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Every point has a slope. Find it faster than the person across from you.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge a friend</a>
        </div>
      </main>
    </div>
  `,
});

// 47 — Long corridor vanishing into a limit / target
add({
  id: 47,
  title: 'Limit corridor',
  fonts: ['syne', 'dmSans'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f6f5f1; }
    .wrap { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 800px) { .wrap { grid-template-columns: 1fr; } .corridor { min-height: 40vh; order: -1; } }
    .copy { padding: 1.75rem 2rem 3rem; display: flex; flex-direction: column; }
    .brand {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(2.6rem, 6vw, 4rem); letter-spacing: -0.045em;
      margin: auto 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: auto; }
    .corridor {
      background: linear-gradient(180deg, #ebe8e0, #f6f5f1 70%);
      display: grid; place-items: center; position: relative; overflow: hidden;
    }
    .corridor svg { width: 72%; max-width: 320px; height: auto; }
    .corridor path {
      fill: none; stroke: #222; stroke-width: 1.4;
      stroke-dasharray: 200; animation: draw 1.5s ease both;
    }
    .corridor .dot {
      fill: #111; animation: fade 1s 0.6s ease both;
    }
  `,
  body: `
    <div class="wrap">
      <section class="copy">
        <nav class="nav" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Approach the answer as h goes to zero. Your opponent is racing the same limit.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Enter matchmaking</a>
          <a class="cta-ghost" href="#">Warm-up</a>
        </div>
      </section>
      <aside class="corridor anim-fade" aria-hidden="true">
        <svg viewBox="0 0 200 160">
          <path d="M20 140 L100 30 L180 140" />
          <path d="M50 140 L100 55 L150 140" />
          <path d="M75 140 L100 85 L125 140" />
          <circle class="dot" cx="100" cy="28" r="3.5" />
        </svg>
      </aside>
    </div>
  `,
});

// 48 — Twin ledger columns: problem left, answer right
add({
  id: 48,
  title: 'Twin ledger columns',
  fonts: ['newsreader', 'ibmMono'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Mono', monospace; background: #f7f6f2; color: #1a1a18; }
    .page { max-width: 880px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; min-height: 100vh; }
    .brand {
      font-family: 'Newsreader', serif;
      font-size: clamp(2.8rem, 7vw, 4.2rem); letter-spacing: -0.03em;
      margin: 2rem 0 0.75rem; line-height: 1;
    }
    .lead {
      font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;
      color: var(--muted); line-height: 1.65; margin: 0 0 1.75rem; max-width: 32rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .ledger {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
      border-top: 1px solid #cfcfc8; border-bottom: 1px solid #cfcfc8;
    }
    @media (max-width: 600px) { .ledger { grid-template-columns: 1fr; } }
    .col { padding: 1.5rem 1.25rem; }
    .col + .col { border-left: 1px solid #cfcfc8; }
    @media (max-width: 600px) { .col + .col { border-left: none; border-top: 1px solid #cfcfc8; } }
    .col .label { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: #888; margin: 0 0 0.75rem; }
    .col .eq { font-size: 1.05rem; line-height: 1.5; margin: 0; animation: drift 4s ease-in-out infinite alternate; }
    .col.answer .eq { font-family: 'Newsreader', serif; font-size: 1.35rem; }
  `,
  body: `
    <div class="page">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">guide</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Two columns. One clock. Close the gap before they do.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">Daily challenge</a>
      </div>
      <div class="ledger anim-fade" aria-hidden="true">
        <div class="col">
          <p class="label">Given</p>
          <p class="eq">f(x) = ln(3x² + 1)</p>
        </div>
        <div class="col answer">
          <p class="label">Find</p>
          <p class="eq">f′(x) = …</p>
        </div>
      </div>
    </div>
  `,
});

// 49 — Soft chalkboard wash with chalk-line equation
add({
  id: 49,
  title: 'Soft chalkboard wash',
  fonts: ['fraunces', 'geist'],
  motionNote: 'rise+fade+draw',
  css: `
    :root { --ink: #f2f0e8; --muted: #b8b4a8; --paper: #2a2f28; }
    body { font-family: 'Geist', sans-serif; background: var(--paper); color: var(--ink); }
    .cta { background: var(--ink); color: #2a2f28; }
    .cta:hover { background: #fff; color: #2a2f28; }
    .cta-ghost { border-color: #5a6156; color: var(--ink); }
    .cta-ghost:hover { border-color: var(--ink); background: rgba(255,255,255,0.04); }
    .nav-links { color: var(--muted); }
    .scene {
      min-height: 100vh; display: flex; flex-direction: column;
      background:
        radial-gradient(ellipse 90% 60% at 40% 30%, #343a32 0%, transparent 55%),
        linear-gradient(165deg, #2e332c, #242822);
    }
    .copy { padding: 0 1.5rem 2rem; max-width: 640px; }
    .brand {
      font-family: 'Fraunces', serif;
      font-size: clamp(2.8rem, 7vw, 4.4rem); letter-spacing: -0.03em;
      margin: 2rem 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .board {
      margin-top: auto; padding: 2.5rem 1.5rem 3.5rem;
      border-top: 1px solid #454b42;
    }
    .board svg { width: min(100%, 420px); height: 80px; display: block; }
    .board path {
      fill: none; stroke: #e8e4d8; stroke-width: 1.5;
      stroke-dasharray: 300; animation: draw 1.8s ease both;
    }
    .board .eq {
      font-family: 'Fraunces', serif; font-size: clamp(1.4rem, 3.5vw, 2rem);
      margin: 1rem 0 0; opacity: 0.85; animation: fade 1s 0.3s ease both;
    }
  `,
  body: `
    <div class="scene">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Chalk dust, clean steps, and a ticking clock. Differentiate under pressure.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play ranked</a>
          <a class="cta-ghost" href="#">Practice board</a>
        </div>
      </div>
      <div class="board anim-fade" aria-hidden="true">
        <svg viewBox="0 0 400 80"><path d="M10 55 C80 55, 90 20, 160 22 S240 60, 300 35 S360 18, 390 28"/></svg>
        <p class="eq">d/dx [ cos(x²) ]</p>
      </div>
    </div>
  `,
});

// 50 — Concentric rings suggesting radius / convergence
add({
  id: 50,
  title: 'Concentric rate rings',
  fonts: ['archivo', 'literata'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'Literata', serif; background: #f3f4f6; color: #152238; }
    .cta { background: #152238; }
    .shell {
      max-width: 960px; margin: 0 auto; padding: 1.5rem;
      min-height: 100vh; display: grid; grid-template-columns: 1.1fr 0.9fr;
      gap: 2rem; align-items: center;
    }
    @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } }
    .brand {
      font-family: 'Archivo', sans-serif; font-weight: 800;
      font-size: clamp(2.6rem, 6vw, 3.9rem); letter-spacing: -0.04em;
      margin: 0 0 0.75rem; line-height: 0.98;
    }
    .lead { color: #5a6570; line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .rings {
      aspect-ratio: 1; max-width: 360px; width: 100%; margin: 0 auto;
      display: grid; place-items: center; position: relative;
    }
    .rings span {
      position: absolute; border: 1px solid rgba(21,34,56,0.22); border-radius: 50%;
      animation: pulseSoft 4s ease-in-out infinite;
    }
    .rings span:nth-child(1) { width: 36%; aspect-ratio: 1; animation-delay: 0s; }
    .rings span:nth-child(2) { width: 58%; aspect-ratio: 1; animation-delay: 0.35s; }
    .rings span:nth-child(3) { width: 82%; aspect-ratio: 1; animation-delay: 0.7s; }
    .rings .core {
      position: relative; z-index: 1;
      font-family: 'Archivo', sans-serif; font-weight: 600; font-size: 1.5rem;
      animation: fade 900ms ease both;
    }
  `,
  body: `
    <div class="shell">
      <div>
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">ELO</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Instantaneous rate at the center. Expand your skill as the rings grow harder.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Queue ranked</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
      </div>
      <div class="rings anim-fade" aria-hidden="true">
        <span></span><span></span><span></span>
        <div class="core">∂</div>
      </div>
    </div>
  `,
});

// 51 — Instantaneous rate: vertical tick marks under a rising brand
add({
  id: 51,
  title: 'Instantaneous tick stage',
  fonts: ['spaceGrotesk', 'ibmMono'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Mono', monospace; background: #f5f5f2; }
    .stage { min-height: 100vh; display: flex; flex-direction: column; }
    .top { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 1.5rem 2rem; max-width: 720px; }
    .brand {
      font-family: 'Space Grotesk', sans-serif; font-weight: 700;
      font-size: clamp(2.8rem, 7vw, 4.4rem); letter-spacing: -0.045em;
      margin: 0 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); font-size: 0.92rem; line-height: 1.65; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .ticks {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 0.35rem; padding: 0 1.5rem 2.5rem; height: 140px;
      border-top: 1px solid var(--line);
      background: linear-gradient(180deg, #ecece6, #f5f5f2);
    }
    .ticks i {
      display: block; width: 2px; background: #222; opacity: 0.35;
      transform-origin: bottom; animation: rise 700ms ease both, drift 3.5s ease-in-out infinite alternate;
    }
    .ticks i:nth-child(odd) { height: 40%; }
    .ticks i:nth-child(3n) { height: 70%; opacity: 0.55; }
    .ticks i:nth-child(5n) { height: 95%; opacity: 0.85; animation-delay: 80ms, 0s; }
  `,
  body: `
    <div class="stage">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">rules</a><a href="#">login</a></div>
      </nav>
      <div class="top">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">The slope at a single instant. Read it cleanly, submit, and take the round.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">View leaderboard</a>
        </div>
      </div>
      <div class="ticks anim-fade" aria-hidden="true">
        ${Array.from({ length: 28 }, (_, i) => `<i style="animation-delay:${i * 30}ms,${(i % 5) * 0.15}s"></i>`).join('')}
      </div>
    </div>
  `,
});

// 52 — Quiet match clock as the sole visual anchor
add({
  id: 52,
  title: 'Quiet match clock',
  fonts: ['ibmPlex', 'jetbrains'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f8f7f4; }
    .shell {
      max-width: 560px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .clock-wrap {
      margin: 2.5rem auto 2rem; width: min(220px, 55vw); aspect-ratio: 1;
      border: 1px solid #cfcfc8; border-radius: 50%;
      display: grid; place-items: center; position: relative;
      background: #fff;
    }
    .clock-wrap::after {
      content: ''; position: absolute; width: 2px; height: 28%;
      background: #111; top: 22%; left: 50%; transform-origin: bottom center;
      transform: translateX(-50%) rotate(18deg);
      animation: pulseSoft 2.8s ease-in-out infinite;
    }
    .clock-face {
      font-family: 'JetBrains Mono', monospace; font-size: 1.35rem; font-weight: 500;
      letter-spacing: 0.04em; animation: fade 800ms ease both;
    }
    .brand {
      font-size: clamp(2.6rem, 7vw, 3.8rem); font-weight: 600;
      letter-spacing: -0.04em; margin: 0 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: auto; }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
      </nav>
      <div class="clock-wrap anim-rise" aria-hidden="true">
        <span class="clock-face">0:45</span>
      </div>
      <h1 class="brand anim-rise-2">Derivative Duel</h1>
      <p class="lead anim-rise-2">Forty-five seconds. One derivative. Whoever is cleaner wins the round.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">Invite friend</a>
      </div>
    </div>
  `,
});

// 53 — Secant line morphing into tangent (SVG draw)
add({
  id: 53,
  title: 'Secant into tangent',
  fonts: ['literata', 'dmSans'],
  motionNote: 'rise+draw+fade',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f4f3ef; }
    .wrap { min-height: 100vh; display: flex; flex-direction: column; }
    .viz {
      flex: 1; min-height: 42vh; display: grid; place-items: center;
      background: linear-gradient(180deg, #e6e4dc, #f4f3ef 75%);
      border-bottom: 1px solid var(--line);
    }
    .viz svg { width: min(92%, 480px); height: auto; }
    .curve { fill: none; stroke: #222; stroke-width: 1.6; stroke-dasharray: 280; animation: draw 1.4s ease both; }
    .secant { fill: none; stroke: #666; stroke-width: 1.2; stroke-dasharray: 160; animation: draw 1.2s 0.25s ease both; opacity: 0.55; }
    .copy { padding: 2rem 1.5rem 3rem; max-width: 640px; }
    .brand {
      font-family: 'Literata', serif;
      font-size: clamp(2.7rem, 7vw, 4rem); letter-spacing: -0.03em;
      margin: 0 0 0.75rem; line-height: 1.05;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">learn</a><a href="#">login</a></div>
      </nav>
      <div class="viz anim-fade" aria-hidden="true">
        <svg viewBox="0 0 400 180">
          <path class="curve" d="M20 140 C80 140, 100 40, 180 50 S280 150, 380 60" />
          <path class="secant" d="M90 95 L310 95" />
        </svg>
      </div>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">From secant to tangent — the race is how fast you close that gap.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Enter matchmaking</a>
          <a class="cta-ghost" href="#">Daily challenge</a>
        </div>
      </div>
    </div>
  `,
});

// 54 — Folio with wide left margin and quiet notation
add({
  id: 54,
  title: 'Folio margin notation',
  fonts: ['newsreader', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f7f5f0; }
    .folio {
      max-width: 820px; margin: 0 auto; min-height: 100vh;
      display: grid; grid-template-columns: 7rem 1fr; gap: 0;
      border-left: 1px solid #ddd8ce;
    }
    @media (max-width: 640px) { .folio { grid-template-columns: 1fr; border-left: none; } .margin { display: none; } }
    .margin {
      padding: 5rem 0.75rem 2rem; border-right: 1px solid #ddd8ce;
      font-family: 'Newsreader', serif; font-style: italic; font-size: 0.85rem;
      color: #8a8478; writing-mode: vertical-rl; transform: rotate(180deg);
      letter-spacing: 0.04em; animation: drift 5s ease-in-out infinite alternate;
    }
    .main { padding: 1.5rem 1.75rem 3rem; }
    .brand {
      font-family: 'Newsreader', serif;
      font-size: clamp(2.8rem, 7vw, 4.2rem); letter-spacing: -0.03em;
      margin: 2.5rem 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .note {
      margin-top: 3rem; padding-top: 1.25rem; border-top: 1px solid #ddd8ce;
      font-family: 'Newsreader', serif; font-size: 1.25rem; color: #3a3832;
      animation: fade 1s ease both;
    }
  `,
  body: `
    <div class="folio">
      <aside class="margin anim-fade" aria-hidden="true">f′(x) · round 2 · first to three</aside>
      <div class="main">
        <nav class="nav anim-fade" style="padding:0">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">guide</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">A quiet page for loud stakes. Show your work at competitive speed.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Challenge friend</a>
        </div>
        <p class="note" aria-hidden="true">If y = e<sup>2x</sup>, then dy/dx = …</p>
      </div>
    </div>
  `,
});

// 55 — Nested radical / nested parentheses visual wash
add({
  id: 55,
  title: 'Nested radical wash',
  fonts: ['fraunces', 'ibmMono'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'IBM Plex Mono', monospace; background: #f2f1ec; }
    .hero {
      min-height: 100vh; display: flex; flex-direction: column;
      position: relative; overflow: hidden;
    }
    .wash {
      position: absolute; inset: 0; display: grid; place-items: center;
      font-family: 'Fraunces', serif; font-size: clamp(4rem, 18vw, 11rem);
      color: rgba(20,20,18,0.05); pointer-events: none; letter-spacing: -0.04em;
      animation: pulseSoft 5s ease-in-out infinite;
    }
    .content { position: relative; z-index: 1; padding: 0 1.5rem 3rem; max-width: 640px; margin-top: auto; }
    .brand {
      font-family: 'Fraunces', serif;
      font-size: clamp(2.9rem, 7vw, 4.4rem); letter-spacing: -0.03em;
      margin: 0 0 0.75rem; line-height: 1;
    }
    .lead { color: var(--muted); font-size: 0.92rem; line-height: 1.65; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <div class="hero">
      <div class="wash" aria-hidden="true">√( )</div>
      <nav class="nav anim-fade">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="content">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Peel the layers. Chain rule, product rule, then submit before they finish nesting.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Queue ranked</a>
          <a class="cta-ghost" href="#">Warm-up</a>
        </div>
      </div>
    </div>
  `,
});

// 56 — Ranked ascent: three ascending steps as the visual
add({
  id: 56,
  title: 'Ranked ascent steps',
  fonts: ['syne', 'ibmPlex'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f5f6f4; color: #1f3d2c; }
    .cta { background: #1f3d2c; }
    .shell {
      max-width: 900px; margin: 0 auto; padding: 1.5rem;
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: end;
    }
    @media (max-width: 800px) { .shell { grid-template-columns: 1fr; align-items: stretch; } }
    .brand {
      font-family: 'Syne', sans-serif; font-weight: 800;
      font-size: clamp(2.6rem, 6vw, 3.8rem); letter-spacing: -0.045em;
      margin: 0 0 0.75rem; line-height: 0.95;
    }
    .lead { color: #5a6b5e; line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .steps {
      display: flex; align-items: flex-end; gap: 0.6rem; height: 220px; padding-bottom: 0.5rem;
    }
    .steps b {
      flex: 1; background: #dfe8e1; display: block;
      animation: rise 800ms ease both, drift 4s ease-in-out infinite alternate;
    }
    .steps b:nth-child(1) { height: 35%; }
    .steps b:nth-child(2) { height: 58%; animation-delay: 80ms, 0.2s; }
    .steps b:nth-child(3) { height: 88%; animation-delay: 160ms, 0.4s; background: #c5d4c9; }
  `,
  body: `
    <div class="shell">
      <div>
        <nav class="nav anim-fade" style="padding:0 0 2rem">
          <div class="brand-mark">∂</div>
          <div class="nav-links"><a href="#">ELO</a><a href="#">login</a></div>
        </nav>
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Win rounds. Climb ranks. Harder derivatives wait one step higher.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play ranked</a>
          <a class="cta-ghost" href="#">View board</a>
        </div>
      </div>
      <div class="steps anim-fade" aria-hidden="true">
        <b></b><b></b><b></b>
      </div>
    </div>
  `,
});

// 57 — Monospace duel prompt with blinking caret
add({
  id: 57,
  title: 'Monospace caret prompt',
  fonts: ['jetbrains', 'geist'],
  motionNote: 'rise+fade+pulse',
  css: `
    body { font-family: 'Geist', sans-serif; background: #f0f0ec; }
    .shell { max-width: 640px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; min-height: 100vh; }
    .brand {
      font-family: 'JetBrains Mono', monospace; font-weight: 700;
      font-size: clamp(2.2rem, 6vw, 3.2rem); letter-spacing: -0.04em;
      margin: 2.5rem 0 0.75rem; line-height: 1.1;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .prompt {
      font-family: 'JetBrains Mono', monospace; font-size: 0.95rem;
      padding: 1.25rem 0; border-top: 1px solid var(--line);
      color: #333; line-height: 1.7;
    }
    .prompt .line { opacity: 0.45; }
    .prompt .active { opacity: 1; }
    .caret {
      display: inline-block; width: 0.55ch; height: 1.05em; background: #111;
      vertical-align: text-bottom; margin-left: 2px;
      animation: pulseSoft 1.1s steps(1) infinite;
    }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">docs</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">Type the derivative. Hit enter. Rematch until the rating moves.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Open arena</a>
        <a class="cta-ghost" href="#">Challenge friend</a>
      </div>
      <div class="prompt anim-fade" aria-hidden="true">
        <div class="line">&gt; f(x) = x^5 + 2x^3</div>
        <div class="active">&gt; f'(x) = <span class="caret"></span></div>
      </div>
    </div>
  `,
});

// 58 — Soft sine curtain as full-bleed background plane
add({
  id: 58,
  title: 'Soft sine curtain',
  fonts: ['instrument', 'dmSans'],
  motionNote: 'rise+draw+fade',
  css: `
    body { font-family: 'DM Sans', sans-serif; background: #f6f5f1; }
    .scene {
      min-height: 100vh; position: relative; display: flex; flex-direction: column;
      overflow: hidden;
    }
    .curtain {
      position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
    }
    .curtain path {
      fill: none; stroke: rgba(17,17,17,0.12); stroke-width: 1.2;
      stroke-dasharray: 800; animation: draw 2s ease both;
    }
    .copy {
      position: relative; z-index: 1; margin-top: auto;
      padding: 2rem 1.5rem 3.5rem; max-width: 600px;
    }
    .brand {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(3rem, 8vw, 4.8rem); letter-spacing: -0.03em;
      margin: 0 0 0.75rem; line-height: 0.98;
    }
    .lead { color: var(--muted); line-height: 1.55; margin: 0 0 1.75rem; max-width: 28rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  `,
  body: `
    <div class="scene">
      <svg class="curtain anim-fade" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 400 Q150 280, 300 400 T600 400 T900 400 T1200 400" />
        <path d="M0 480 Q150 360, 300 480 T600 480 T900 480 T1200 480" />
        <path d="M0 560 Q150 440, 300 560 T600 560 T900 560 T1200 560" />
      </svg>
      <nav class="nav anim-fade" style="position:relative;z-index:1">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">leaderboard</a><a href="#">login</a></div>
      </nav>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Waves of problems. Read the slope, not the noise.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Play random</a>
          <a class="cta-ghost" href="#">Daily challenge</a>
        </div>
      </div>
    </div>
  `,
});

// 59 — Bracketed problem reveal with staggered lines
add({
  id: 59,
  title: 'Bracketed problem reveal',
  fonts: ['archivo', 'ibmMono'],
  motionNote: 'rise+fade+drift',
  css: `
    body { font-family: 'IBM Plex Mono', monospace; background: #f5f5f3; }
    .shell {
      max-width: 720px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; min-height: 100vh;
      display: flex; flex-direction: column;
    }
    .brand {
      font-family: 'Archivo', sans-serif; font-weight: 800;
      font-size: clamp(2.6rem, 7vw, 4rem); letter-spacing: -0.045em;
      margin: 2rem 0 0.75rem; line-height: 0.95;
    }
    .lead { color: var(--muted); font-size: 0.9rem; line-height: 1.65; margin: 0 0 1.75rem; max-width: 30rem; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
    .bracket {
      display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: stretch;
      margin-top: auto;
    }
    .brace {
      font-family: 'Archivo', sans-serif; font-size: 4.5rem; line-height: 1; color: #222;
      animation: fade 900ms ease both;
    }
    .lines { display: grid; gap: 0.65rem; padding: 0.5rem 0; }
    .lines p {
      margin: 0; font-size: 0.95rem; color: #333;
      animation: rise 700ms ease both, drift 4s ease-in-out infinite alternate;
    }
    .lines p:nth-child(2) { animation-delay: 100ms, 0.2s; }
    .lines p:nth-child(3) { animation-delay: 200ms, 0.4s; opacity: 0.55; }
  `,
  body: `
    <div class="shell">
      <nav class="nav anim-fade" style="padding:0">
        <div class="brand-mark">∂ Derivative Duel</div>
        <div class="nav-links"><a href="#">rules</a><a href="#">login</a></div>
      </nav>
      <h1 class="brand anim-rise">Derivative Duel</h1>
      <p class="lead anim-rise-2">One bracketed problem at a time. Expand, differentiate, finish first.</p>
      <div class="actions anim-rise-3">
        <a class="cta" href="#">Start a duel</a>
        <a class="cta-ghost" href="#">Practice</a>
      </div>
      <div class="bracket anim-fade" aria-hidden="true">
        <div class="brace">{</div>
        <div class="lines">
          <p>y = (2x + 1)<sup>5</sup></p>
          <p>find dy/dx</p>
          <p>submit · rematch</p>
        </div>
      </div>
    </div>
  `,
});

// 60 — Twin path fork: two routes, one correct derivative
add({
  id: 60,
  title: 'Twin path fork',
  fonts: ['geist', 'ibmMono'],
  motionNote: 'rise+fade+draw',
  css: `
    body { font-family: 'Geist', sans-serif; background: #f4f5f6; color: #1a1a1a; }
    .wrap { min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; }
    .copy { padding: 0 1.5rem; max-width: 640px; }
    .brand {
      font-size: clamp(2.8rem, 7vw, 4.2rem); font-weight: 700;
      letter-spacing: -0.045em; margin: 1.5rem 0 0.75rem; line-height: 0.98;
    }
    .lead {
      font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem;
      color: var(--muted); line-height: 1.65; margin: 0 0 1.75rem; max-width: 30rem;
    }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .fork {
      display: grid; place-items: center; padding: 1rem 1.5rem 3rem;
    }
    .fork svg { width: min(100%, 420px); height: auto; }
    .fork path {
      fill: none; stroke: #222; stroke-width: 1.5;
      stroke-dasharray: 220; animation: draw 1.5s ease both;
    }
    .fork path.dim { stroke: #999; stroke-width: 1.2; animation-delay: 0.2s; }
    .fork text {
      font-family: 'IBM Plex Mono', monospace; font-size: 11px; fill: #555;
      animation: fade 1s 0.5s ease both;
    }
  `,
  body: `
    <div class="wrap">
      <nav class="nav anim-fade">
        <div class="brand-mark">∂</div>
        <div class="nav-links"><a href="#">how it works</a><a href="#">login</a></div>
      </nav>
      <div class="copy">
        <h1 class="brand anim-rise">Derivative Duel</h1>
        <p class="lead anim-rise-2">Two paths look plausible. Only one derivative is right — and the clock is running.</p>
        <div class="actions anim-rise-3">
          <a class="cta" href="#">Enter matchmaking</a>
          <a class="cta-ghost" href="#">Challenge a friend</a>
        </div>
      </div>
      <div class="fork anim-fade" aria-hidden="true">
        <svg viewBox="0 0 400 160">
          <path d="M40 80 L160 80" />
          <path d="M160 80 Q220 80, 280 40 L360 40" />
          <path class="dim" d="M160 80 Q220 80, 280 120 L360 120" />
          <text x="300" y="32">f′ correct</text>
          <text x="300" y="144">trap</text>
        </svg>
      </div>
    </div>
  `,
});

// Matrix fill disabled — variants 1–60 are all handcrafted above.
// for (let id = 46; id <= 60; id++) addMatrixVariant(id);

function writeAll() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];

  for (const v of variants) {
    if (variants.filter((x) => x.id === v.id).length !== 1) {
      throw new Error(`Duplicate id ${v.id}`);
    }
    const html = shell(v);
    const file = `variant-${String(v.id).padStart(2, '0')}.html`;
    fs.writeFileSync(path.join(OUT_DIR, file), html, 'utf8');
    manifest.push({ id: v.id, file, title: v.title, fonts: v.fonts, motion: v.motionNote || 'rise+fade' });
  }

  if (manifest.length !== 60) {
    throw new Error(`Expected 60 variants, got ${manifest.length}`);
  }

  fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // Gallery index
  const cards = manifest
    .map(
      (m) => `
    <a class="card" href="pages/${m.file}">
      <div class="num">${String(m.id).padStart(2, '0')}</div>
      <div class="title">${m.title}</div>
      <div class="meta">${m.fonts.join(' + ')} · ${m.motion}</div>
    </a>`
    )
    .join('\n');

  const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Derivative Duel — 60 alt landings</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f7f7f5; color: #111; }
    header { padding: 2rem 1.5rem; border-bottom: 1px solid #ddd; }
    h1 { margin: 0 0 0.5rem; font-size: 1.75rem; }
    p { margin: 0; color: #555; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; padding: 1.25rem; }
    .card { display: block; padding: 1rem; background: #fff; border: 1px solid #ddd; color: inherit; text-decoration: none; }
    .card:hover { border-color: #111; }
    .num { font-size: 0.8rem; color: #777; }
    .title { font-weight: 600; margin: 0.35rem 0; }
    .meta { font-size: 0.75rem; color: #777; }
  </style>
</head>
<body>
  <header>
    <h1>∂ Derivative Duel — 60 alternative landings</h1>
    <p>Standalone HTML experiments. Similar minimal spirit, different composition / type / accent.</p>
  </header>
  <div class="grid">${cards}</div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'index.html'), index, 'utf8');
  console.log(`Wrote ${manifest.length} variants to ${OUT_DIR}`);
}

writeAll();
