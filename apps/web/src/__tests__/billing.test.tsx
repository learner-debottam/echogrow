import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BillingPage from '../../pages/billing';

describe('BillingPage', () => {
  it('renders billing page and plan buttons', () => {
    render(<BillingPage />);
    expect(screen.getByText(/Billing & Subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly/i)).toBeInTheDocument();
    expect(screen.getByText(/Yearly/i)).toBeInTheDocument();
  });
});
