import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from '../../pages/auth/login';

describe('Login Page', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
