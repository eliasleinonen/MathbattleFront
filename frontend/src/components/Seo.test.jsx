import { describe, it, expect, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Seo, { SITE_URL } from './Seo';

const renderSeo = (props) =>
  render(
    <HelmetProvider>
      <Seo {...props} />
    </HelmetProvider>
  );

const getMeta = (selector) => document.head.querySelector(selector);

describe('Seo', () => {
  afterEach(cleanup);

  it('sets the document title', async () => {
    renderSeo({ title: 'Test Page | Derivative Duel', description: 'Test description', path: '/test' });
    await waitFor(() => {
      expect(document.title).toBe('Test Page | Derivative Duel');
    });
  });

  it('renders a page-specific canonical URL', async () => {
    renderSeo({ title: 'Leaderboard', description: 'Top players', path: '/leaderboard' });
    await waitFor(() => {
      const canonical = getMeta('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical.getAttribute('href')).toBe(`${SITE_URL}/leaderboard`);
    });
  });

  it('does not add a trailing duplicate slash for the homepage', async () => {
    renderSeo({ title: 'Home', description: 'Home page', path: '/' });
    await waitFor(() => {
      const canonical = getMeta('link[rel="canonical"]');
      expect(canonical.getAttribute('href')).toBe(`${SITE_URL}/`);
    });
  });

  it('renders description, Open Graph, and Twitter tags', async () => {
    renderSeo({ title: 'FAQ', description: 'Common questions', path: '/faq' });
    await waitFor(() => {
      expect(getMeta('meta[name="description"]').getAttribute('content')).toBe('Common questions');
      expect(getMeta('meta[property="og:title"]').getAttribute('content')).toBe('FAQ');
      expect(getMeta('meta[property="og:url"]').getAttribute('content')).toBe(`${SITE_URL}/faq`);
      expect(getMeta('meta[property="og:image"]').getAttribute('content')).toBe(`${SITE_URL}/og-image.png`);
      expect(getMeta('meta[name="twitter:card"]').getAttribute('content')).toBe('summary_large_image');
    });
  });

  it('omits the robots noindex tag by default', async () => {
    renderSeo({ title: 'Home', description: 'Home page', path: '/' });
    await waitFor(() => {
      expect(getMeta('link[rel="canonical"]')).not.toBeNull();
    });
    expect(getMeta('meta[name="robots"]')).toBeNull();
  });

  it('adds a robots noindex tag when noindex is set', async () => {
    renderSeo({ title: 'Sign In', description: 'Login page', path: '/login', noindex: true });
    await waitFor(() => {
      expect(getMeta('meta[name="robots"]').getAttribute('content')).toBe('noindex');
    });
  });

  it('renders JSON-LD as a script tag', async () => {
    const jsonLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Derivative Duel' };
    renderSeo({ title: 'Home', description: 'Home page', path: '/', jsonLd });
    await waitFor(() => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      expect(JSON.parse(script.textContent)).toEqual(jsonLd);
    });
  });
});
