import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from '../../pages/404';

// Mock next/link to render anchor elements
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock i18n to return keys and i18n info
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en', changeLanguage: () => {} } }),
}));

describe('NotFoundPage (404) - Integration', () => {
  it("'Go Home' navigates to /", () => {
    render(<NotFoundPage />);
    const homeLink = screen.getByRole('link', { name: 'Go Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it("'Contact Support' opens mailto link", () => {
    render(<NotFoundPage />);
    const supportLink = screen.getByRole('link', { name: 'Contact Support' });
    expect(supportLink).toHaveAttribute('href', 'mailto:support@echogrow.ai');
  });
});


