'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { useTranslation } from 'react-i18next';

export default function Error500Page() {
  const { t } = useTranslation();

  const handleRetry = () => {
    // Avoid blocking; triggers a soft reload for SPA, full reload fallback
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main
        role="main"
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        aria-labelledby="page-title-500"
      >
        <div className="w-full max-w-3xl mx-auto text-center">
          <div aria-hidden="true" className="mx-auto mb-8 h-24 w-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-3xl" aria-hidden="true">🚧</span>
          </div>
          <h1 id="page-title-500" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {t('Something went wrong')}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {t('500_subtext')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center" aria-label="Call to action">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              aria-label={t('Retry')}
            >
              {t('Retry')}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              aria-label={t('Go Home')}
            >
              {t('Go Home')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


