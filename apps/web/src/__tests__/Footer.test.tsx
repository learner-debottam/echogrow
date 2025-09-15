import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Footer from '../components/Footer';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders company logo and name', () => {
    render(<Footer />);
    
    expect(screen.getByText('EchoGrow')).toBeInTheDocument();
  });

  it('renders company description', () => {
    render(<Footer />);
    
    expect(screen.getByText(/AI-powered social media management platform/)).toBeInTheDocument();
  });

  it('renders newsletter subscription form', () => {
    render(<Footer />);
    
    expect(screen.getByText('Stay Updated')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address for newsletter')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();
  });

  it('handles newsletter subscription', async () => {
    render(<Footer />);
    
    const emailInput = screen.getByLabelText('Email address for newsletter');
    const subscribeButton = screen.getByLabelText('Subscribe to newsletter');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
    });
  });

  it('renders footer link sections', () => {
    render(<Footer />);
    
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    expect(screen.getByLabelText('Follow us on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow us on LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Follow us on GitHub')).toBeInTheDocument();
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} EchoGrow. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('GDPR')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-footer-class';
    render(<Footer className={customClass} />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(customClass);
  });

  it('validates email input', () => {
    render(<Footer />);
    
    const emailInput = screen.getByLabelText('Email address for newsletter');
    const subscribeButton = screen.getByLabelText('Subscribe to newsletter');
    
    // Try to submit without email
    fireEvent.click(subscribeButton);
    
    // Button should be disabled or form should not submit
    expect(emailInput).toBeRequired();
  });

  it('shows loading state during subscription', async () => {
    render(<Footer />);
    
    const emailInput = screen.getByLabelText('Email address for newsletter');
    const subscribeButton = screen.getByLabelText('Subscribe to newsletter');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);
    
    // Button should show loading state
    expect(subscribeButton).toBeDisabled();
  });
});
