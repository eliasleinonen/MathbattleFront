// Build-time prerendering: renders the static public routes to real HTML so
// crawlers (including non-JS AI crawlers) get content without executing React.
// Runs after `vite build` + `vite build --ssr` (see the build script in package.json).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PRERENDER_ROUTES } from '../src/prerender-routes.js';

const frontendDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(frontendDir, 'dist');

const { render } = await import(join(distDir, 'server', 'entry-server.js'));

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// String.replace silently no-ops on a missing marker, which would ship pages
// without content or head tags; fail the build instead.
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) {
    throw new Error(`prerender: ${marker} marker missing from dist/index.html`);
  }
}

// Keep the empty SPA shell for non-prerendered routes (game pages, unknown URLs).
// The Vercel catch-all rewrite targets this file so junk URLs don't get served
// prerendered homepage content. Strip the placeholder comment so the client
// entry sees a truly empty #root and takes the createRoot path.
writeFileSync(join(distDir, 'spa-shell.html'), template.replace('<!--app-html-->', ''));

for (const route of PRERENDER_ROUTES) {
  const { html, head } = render(route);

  if (!head.includes('<title')) {
    throw new Error(`prerender: ${route} rendered without a title - is its Seo component missing?`);
  }

  const page = template
    // The Seo component provides the per-page title; drop the static fallback
    .replace(/<title>[\s\S]*?<\/title>\n?/, '')
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);

  // Flat <route>.html files: Vercel's cleanUrls serves /faq from faq.html
  const outFile =
    route === '/' ? join(distDir, 'index.html') : join(distDir, `${route.slice(1)}.html`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, page);
  console.log(`prerendered ${route} -> ${outFile.replace(frontendDir + '/', '')}`);
}

// The server bundle is only needed during this script; keep it out of the deploy
rmSync(join(distDir, 'server'), { recursive: true, force: true });
