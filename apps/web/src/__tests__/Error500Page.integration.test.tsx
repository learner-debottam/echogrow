import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Error500Page from '../../pages/500';

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

describe('Error500Page - Integration', () => {
  it("'Go Home' navigates to /", () => {
    render(<Error500Page />);
    const homeLink = screen.getByRole('link', { name: 'Go Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it("'Retry' reloads the page", () => {
    const reloadMock = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload: reloadMock,
    } as unknown as Location);
    render(<Error500Page />);
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);
    expect(reloadMock).toHaveBeenCalled();
  });
});


