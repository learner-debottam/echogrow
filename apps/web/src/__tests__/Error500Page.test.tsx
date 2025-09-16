import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Error500Page from '../../pages/500';

// Mock Header and Footer to isolate the page
vi.mock('../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

// Mock react-i18next for stable text
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Error500Page - Unit', () => {
  it('renders heading and subtext', () => {
    render(<Error500Page />);
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByText('500_subtext')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<Error500Page />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go Home' })).toBeInTheDocument();
  });

  it('retry button triggers reload', () => {
    const reloadMock = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload: reloadMock,
    } as unknown as Location);
    render(<Error500Page />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(reloadMock).toHaveBeenCalled();
  });
});
