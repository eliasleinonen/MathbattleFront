/**
 * Screenshot every alt landing page (desktop + mobile).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PAGES = path.join(ROOT, 'pages');
const OUT = path.join(ROOT, 'screenshots');
const ARTIFACTS = '/opt/cursor/artifacts/alt-screenshots';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function startStaticServer() {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const filePath = path.join(ROOT, rel);
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  const { server, port } = await startStaticServer();
  const base = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/usr/local/bin/google-chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  const results = [];

  try {
    for (const entry of manifest) {
      for (const vp of viewports) {
        const page = await browser.newPage();
        await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
        const url = `${base}/pages/${entry.file}`;
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        // Let font + entrance animations settle
        await new Promise((r) => setTimeout(r, 900));
        const fileName = `variant-${String(entry.id).padStart(2, '0')}-${vp.name}.png`;
        const dest = path.join(OUT, fileName);
        const art = path.join(ARTIFACTS, fileName);
        await page.screenshot({ path: dest, fullPage: false });
        fs.copyFileSync(dest, art);
        await page.close();
        results.push({ id: entry.id, viewport: vp.name, file: fileName, title: entry.title });
        process.stdout.write(`captured ${fileName}\n`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(results, null, 2));

  // Build visual report HTML
  const rows = manifest
    .map((m) => {
      const d = `variant-${String(m.id).padStart(2, '0')}-desktop.png`;
      const mob = `variant-${String(m.id).padStart(2, '0')}-mobile.png`;
      return `
      <section class="row">
        <header>
          <h2>${String(m.id).padStart(2, '0')} — ${m.title}</h2>
          <p>${m.fonts.join(' + ')} · ${m.motion}</p>
        </header>
        <div class="shots">
          <figure>
            <img src="${d}" alt="Variant ${m.id} desktop" width="720" />
            <figcaption>desktop</figcaption>
          </figure>
          <figure>
            <img src="${mob}" alt="Variant ${m.id} mobile" width="240" />
            <figcaption>mobile</figcaption>
          </figure>
        </div>
      </section>`;
    })
    .join('\n');

  const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Alt landing screenshots — Derivative Duel</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #111; color: #f5f5f0; }
    header.top { padding: 2rem 1.5rem; border-bottom: 1px solid #333; }
    h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
    .row { padding: 1.5rem; border-bottom: 1px solid #2a2a2a; }
    .row h2 { margin: 0 0 0.25rem; font-size: 1.1rem; }
    .row p { margin: 0 0 1rem; color: #999; font-size: 0.85rem; }
    .shots { display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-start; }
    figure { margin: 0; background: #1a1a1a; padding: 0.5rem; }
    figcaption { font-size: 0.75rem; color: #888; margin-top: 0.35rem; }
    img { display: block; max-width: 100%; height: auto; background: #fff; }
  </style>
</head>
<body>
  <header class="top">
    <h1>∂ Derivative Duel — 60 alt landing screenshots</h1>
    <p>Desktop (1440×900) and mobile (390×844) captures for each variant.</p>
  </header>
  ${rows}
</body>
</html>`;

  fs.writeFileSync(path.join(OUT, 'report.html'), reportHtml, 'utf8');
  fs.copyFileSync(path.join(OUT, 'report.html'), path.join(ARTIFACTS, 'report.html'));

  // Also copy all pngs already done; write markdown report for PR
  const md = [
    '# Derivative Duel — 60 alternative landing pages',
    '',
    'Standalone HTML experiments in `/alt/pages`. Similar minimal math-game spirit to the current home, with different layout, type, accent, and motion.',
    '',
    `Generated **${manifest.length}** variants. Screenshots: desktop + mobile (${results.length} images).`,
    '',
  ];
  for (const m of manifest) {
    const d = `variant-${String(m.id).padStart(2, '0')}-desktop.png`;
    const mob = `variant-${String(m.id).padStart(2, '0')}-mobile.png`;
    md.push(`## ${String(m.id).padStart(2, '0')} — ${m.title}`);
    md.push('');
    md.push(`Fonts: ${m.fonts.join(', ')} · Motion: ${m.motion}`);
    md.push('');
    md.push(`![Variant ${m.id} desktop](./${d})`);
    md.push('');
    md.push(`![Variant ${m.id} mobile](./${mob})`);
    md.push('');
  }
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), md.join('\n'), 'utf8');
  fs.copyFileSync(path.join(OUT, 'REPORT.md'), path.join(ARTIFACTS, 'REPORT.md'));

  console.log(`Done. ${results.length} screenshots written to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
