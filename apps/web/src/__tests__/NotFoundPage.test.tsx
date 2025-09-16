import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from '../../pages/404';

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

describe('NotFoundPage (404) - Unit', () => {
  it('renders heading text', () => {
    render(<NotFoundPage />);
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<NotFoundPage />);
    expect(screen.getByRole('link', { name: 'Go Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact Support' })).toBeInTheDocument();
  });
});


