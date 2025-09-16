import '@testing-library/jest-dom';
import React from 'react';

// Provide React globally for tests using automatic JSX
// @ts-ignore
global.React = React;

// Provide default envs for Supabase usage in client-side pages during tests
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_123';

// Mock i18next for components that rely on useTranslation().i18n.language
vi.mock('react-i18next', async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en', changeLanguage: () => {} } }),
  };
});


