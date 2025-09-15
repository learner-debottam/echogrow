import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from '../components/Header';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock LanguageSelector
vi.mock('../components/LanguageSelector', () => ({
  default: () => <div data-testid="language-selector">Language Selector</div>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo and brand name', () => {
    render(<Header />);
    
    expect(screen.getByText('EchoGrow')).toBeInTheDocument();
    expect(screen.getByLabelText('EchoGrow - Home')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders authentication links', () => {
    render(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    render(<Header />);
    
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
    
    // Initially mobile menu should be closed
    expect(screen.queryByText('Home')).toBeInTheDocument(); // Desktop nav visible
    
    // Click mobile menu button
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should be open (we can't easily test visibility without more complex setup)
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-header-class';
    render(<Header className={customClass} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(customClass);
  });

  it('closes mobile menu when navigation link is clicked', () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileMenuButton);
    
    // Find mobile navigation link (this would be in the mobile menu)
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    
    // Menu should be closed
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
