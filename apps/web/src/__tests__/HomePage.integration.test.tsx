import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../app/page';

// Mock all components
vi.mock('../components/Header', () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock('../components/HeroSection', () => ({
  default: () => <div data-testid="hero-section">Hero Section Component</div>,
}));

vi.mock('../components/FeaturesSection', () => ({
  default: () => <div data-testid="features-section">Features Section Component</div>,
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer Component</div>,
}));

describe('HomePage Integration Tests', () => {
  it('renders all main components', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('features-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    render(<HomePage />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    const pageContainer = main.parentElement;
    expect(pageContainer).toHaveClass('min-h-screen', 'bg-white');
  });

  it('renders components in correct order', () => {
    render(<HomePage />);
    
    const header = screen.getByTestId('header');
    const hero = screen.getByTestId('hero-section');
    const features = screen.getByTestId('features-section');
    const footer = screen.getByTestId('footer');
    
    // Check that components are in the correct order
    expect(header.compareDocumentPosition(hero)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(hero.compareDocumentPosition(features)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(features.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('has proper accessibility structure', () => {
    render(<HomePage />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Check that main content is properly structured
    expect(main).toHaveAttribute('role', 'main');
  });
});
