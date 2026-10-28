import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { faqs, faqJsonLd } from './pages/FAQ';
import { dailyChallengeFaqs, dailyChallengeJsonLd } from './pages/DailyChallenge';

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

describe('Daily Challenge structured data', () => {
  it('builds WebApplication, FAQPage, and BreadcrumbList schemas covering every question', () => {
    expect(dailyChallengeJsonLd).toHaveLength(3);
    const [webApp, faq, breadcrumbs] = dailyChallengeJsonLd;
    expect(webApp['@type']).toBe('WebApplication');
    expect(webApp.name).toBe('Daily Derivative Challenge');
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(dailyChallengeFaqs.length);
    for (const [index, entry] of faq.mainEntity.entries()) {
      expect(entry['@type']).toBe('Question');
      expect(entry.name).toBe(dailyChallengeFaqs[index].question);
      expect(entry.acceptedAnswer.text).toBe(dailyChallengeFaqs[index].answer);
    }
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement).toHaveLength(2);
    expect(breadcrumbs.itemListElement[1].name).toBe('Daily Derivative');
  });
});
