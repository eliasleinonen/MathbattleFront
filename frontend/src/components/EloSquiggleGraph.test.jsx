import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import EloSquiggleGraph from './EloSquiggleGraph';
import { DEFAULT_ELO } from '../utils/eloSquiggle';

describe('EloSquiggleGraph', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not show the elo until hovered', () => {
    render(<EloSquiggleGraph elo={DEFAULT_ELO} className="h-40 w-full" />);
    expect(screen.getByRole('img', { name: `Rating curve at ${DEFAULT_ELO} elo` })).toBeDefined();
    expect(screen.queryByText(String(DEFAULT_ELO))).toBeNull();
  });

  it('shows the same current elo at any hover point along the graph', () => {
    render(<EloSquiggleGraph elo={1642} className="h-40 w-full" />);
    const graph = screen.getByRole('img', { name: 'Rating curve at 1642 elo' });

    graph.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 400,
      height: 160,
      right: 400,
      bottom: 160,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(graph, { clientX: 40, clientY: 40 });
    expect(screen.getByText('1642')).toBeDefined();

    fireEvent.pointerMove(graph, { clientX: 360, clientY: 90 });
    expect(screen.getByText('1642')).toBeDefined();

    fireEvent.pointerLeave(graph);
    expect(screen.queryByText('1642')).toBeNull();
  });
});
