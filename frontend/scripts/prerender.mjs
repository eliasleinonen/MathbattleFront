// Build-time prerendering: renders the static public routes to real HTML so
// crawlers (including non-JS AI crawlers) get content without executing React.
// Runs after `vite build` + `vite build --ssr` (see the build script in package.json).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const frontendDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(frontendDir, 'dist');

const { render } = await import(join(distDir, 'server', 'entry-server.js'));

// Only routes whose initial render is meaningful for crawlers. Game routes
// (auth/session-bound) are intentionally excluded.
const routes = [
  '/',
  '/login',
  '/leaderboard',
  '/daily-challenge',
  '/play/random',
  '/play/friend',
  '/how-to-derivate',
  '/faq',
  '/about',
  '/privacy-policy',
  '/terms-and-services',
];

const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

// Keep the empty SPA shell for non-prerendered routes (game pages, unknown URLs).
// The Vercel catch-all rewrite targets this file so junk URLs don't get served
// prerendered homepage content.
writeFileSync(join(distDir, 'spa-shell.html'), template);

for (const route of routes) {
  const { html, head } = render(route);

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
