import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import EloSquiggleGraph from './EloSquiggleGraph';
import { DEFAULT_ELO } from '../utils/eloSquiggle';

describe('EloSquiggleGraph', () => {
  afterEach(() => {
    cleanup();
  });

  it('always shows the tip elo for guests', () => {
    render(<EloSquiggleGraph elo={DEFAULT_ELO} className="h-40 w-full" />);
    expect(screen.getByRole('img', { name: `Rating curve at ${DEFAULT_ELO} elo` })).toBeDefined();
    expect(screen.getByText(String(DEFAULT_ELO))).toBeDefined();
  });

  it('shows the profile elo on the tip', () => {
    render(<EloSquiggleGraph elo={2100} className="h-40 w-full" />);
    expect(screen.getByRole('img', { name: 'Rating curve at 2100 elo' })).toBeDefined();
    expect(screen.getByText('2100')).toBeDefined();
  });
});
