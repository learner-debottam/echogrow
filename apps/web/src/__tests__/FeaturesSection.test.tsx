import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeaturesSection from '../components/FeaturesSection';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FeaturesSection Component', () => {
  it('renders section heading', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('Powerful Features for')).toBeInTheDocument();
    expect(screen.getByText('Social Media Success')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText(/Everything you need to create, schedule, and analyze content/)).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('AI Caption Generation')).toBeInTheDocument();
    expect(screen.getByText('Smart Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Multi-Language Support')).toBeInTheDocument();
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument();
    expect(screen.getByText('Smart Repurposing')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText(/Generate engaging captions automatically/)).toBeInTheDocument();
    expect(screen.getByText(/Schedule posts across multiple platforms/)).toBeInTheDocument();
    expect(screen.getByText(/Track performance metrics/)).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<FeaturesSection />);
    
    expect(screen.getByText('Ready to Transform Your Social Media?')).toBeInTheDocument();
    expect(screen.getByText('Join thousands of creators and businesses growing their audience with AI-powered content.')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<FeaturesSection />);
    
    const startTrialButton = screen.getByLabelText('Start your free trial');
    const viewPricingButton = screen.getByLabelText('View pricing plans');
    
    expect(startTrialButton).toBeInTheDocument();
    expect(viewPricingButton).toBeInTheDocument();
    expect(startTrialButton).toHaveAttribute('href', '/auth/signup');
    expect(viewPricingButton).toHaveAttribute('href', '/pricing');
  });

  it('has proper accessibility attributes', () => {
    render(<FeaturesSection />);
    
    const featuresSection = screen.getByRole('region');
    expect(featuresSection).toBeInTheDocument();
    expect(featuresSection).toHaveAttribute('aria-labelledby', 'features-heading');
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'features-heading');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-features-class';
    render(<FeaturesSection className={customClass} />);
    
    const featuresSection = screen.getByRole('region');
    expect(featuresSection).toHaveClass(customClass);
  });

  it('renders feature icons (svg present)', () => {
    render(<FeaturesSection />);
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('has proper hover effects on feature cards', () => {
    render(<FeaturesSection />);
    
    const featureCards = screen.getAllByText(/AI Caption Generation|Smart Scheduling|Analytics Dashboard/);
    featureCards.forEach(card => {
      const parentCard = card.closest('div');
      expect(parentCard).toHaveClass('hover:scale-105');
    });
  });
});
