import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props and aria-label', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status', { name: /loading/i });
    expect(status).toBeTruthy();
  });
});
