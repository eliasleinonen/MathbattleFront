// @vitest-environment node
// Prerendering runs in plain Node (no DOM); helmet only fills the static
// context when no document exists, so these tests must not use jsdom.
import { describe, it, expect } from 'vitest';
import { render } from './entry-server';

describe('entry-server prerendering', () => {
  it('renders the FAQ route with full content and per-page head tags', () => {
    const { html, head } = render('/faq');
    expect(html).toContain('Frequently Asked Questions');
    expect(html).toContain('What is ELO rating?');
    expect(head).toContain('https://www.mathbattle.xyz/faq');
    expect(head).toContain('FAQ - Derivative Duel');
    expect(head).toContain('application/ld+json');
  });

  it('renders the homepage with the intro content visible', () => {
    const { html, head } = render('/');
    expect(html).toContain('Competitive derivative battles');
    expect(head).toContain('https://www.mathbattle.xyz/');
  });

  it('renders the derivative guide content', () => {
    const { html } = render('/how-to-derivate');
    expect(html).toContain('Power Rule');
    expect(html).toContain('Chain Rule');
  });

  it('renders unknown routes as a noindexed 404 page', () => {
    const { html, head } = render('/this-page-does-not-exist');
    expect(html).toContain('Page not found');
    expect(head).toContain('noindex');
  });

  it('marks the login route as noindex', () => {
    const { head } = render('/login');
    expect(head).toContain('noindex');
    expect(head).toContain('https://www.mathbattle.xyz/login');
  });
});
