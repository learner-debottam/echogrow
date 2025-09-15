import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Signup from '../../pages/auth/signup';

describe('Signup Page', () => {
  it('renders signup form', () => {
    render(<Signup />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
});
