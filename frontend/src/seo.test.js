import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { faqs, faqJsonLd } from './pages/FAQ';

const rootDir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(rootDir, '..', 'public');

describe('sitemap.xml', () => {
  const sitemap = readFileSync(join(publicDir, 'sitemap.xml'), 'utf-8');

  const indexablePaths = [
    '/',
    '/daily-challenge',
    '/play/random',
    '/play/friend',
    '/leaderboard',
    '/how-to-derivate',
    '/faq',
    '/about',
    '/privacy-policy',
    '/terms-and-services',
  ];

  it.each(indexablePaths)('contains %s', (path) => {
    expect(sitemap).toContain(`<loc>https://www.mathbattle.xyz${path}</loc>`);
  });

  it('does not list the noindex login page', () => {
    expect(sitemap).not.toContain('/login');
  });
});

describe('robots.txt', () => {
  const robots = readFileSync(join(publicDir, 'robots.txt'), 'utf-8');

  it('references the sitemap', () => {
    expect(robots).toContain('Sitemap: https://www.mathbattle.xyz/sitemap.xml');
  });

  it('blocks non-content routes', () => {
    expect(robots).toContain('Disallow: /api/');
    expect(robots).toContain('Disallow: /game/');
    expect(robots).toContain('Disallow: /set-username');
  });
});

describe('FAQ structured data', () => {
  it('builds a FAQPage schema covering every question', () => {
    expect(faqJsonLd['@type']).toBe('FAQPage');
    expect(faqJsonLd.mainEntity).toHaveLength(faqs.length);
    for (const [index, entry] of faqJsonLd.mainEntity.entries()) {
      expect(entry['@type']).toBe('Question');
      expect(entry.name).toBe(faqs[index].question);
      expect(entry.acceptedAnswer.text).toBe(faqs[index].answer);
    }
  });
});
