import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSection from '../components/HeroSection';

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

describe('HeroSection Component', () => {
  it('renders main headline', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('Grow Your Audience')).toBeInTheDocument();
    expect(screen.getByText('Smartly with AI')).toBeInTheDocument();
  });

  it('renders subheadline', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/EchoGrow uses AI to help you create viral content/)).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<HeroSection />);
    
    const getStartedButton = screen.getByLabelText('Get started with EchoGrow');
    const learnMoreButton = screen.getByLabelText('Learn more about EchoGrow features');
    
    expect(getStartedButton).toBeInTheDocument();
    expect(learnMoreButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/auth/signup');
    expect(learnMoreButton).toHaveAttribute('href', '/features');
  });

  it('renders trust indicators', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('No credit card required')).toBeInTheDocument();
    expect(screen.getByText('14-day free trial')).toBeInTheDocument();
    expect(screen.getByText('Cancel anytime')).toBeInTheDocument();
  });

  it('renders hero demo section', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('AI-Powered Dashboard')).toBeInTheDocument();
    expect(screen.getByText('See your content performance and AI insights in real-time')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HeroSection />);
    
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-hero-class';
    render(<HeroSection className={customClass} />);
    
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toHaveClass(customClass);
  });

  it('has proper focus management for CTA buttons', () => {
    render(<HeroSection />);
    
    const getStartedButton = screen.getByLabelText('Get started with EchoGrow');
    const learnMoreButton = screen.getByLabelText('Learn more about EchoGrow features');
    
    // Check that buttons have proper focus styles
    expect(getStartedButton).toHaveClass('focus:outline-none');
    expect(learnMoreButton).toHaveClass('focus:outline-none');
  });
});
