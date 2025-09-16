'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main
        role="main"
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        aria-labelledby="page-title"
      >
        <div className="w-full max-w-3xl mx-auto text-center">
          <div aria-hidden="true" className="mx-auto mb-8 h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-3xl" aria-hidden="true">😕</span>
          </div>
          <h1 id="page-title" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {t('Page not found')}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            {t('404_subtext')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center" aria-label="Call to action">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              aria-label={t('Go Home')}
            >
              {t('Go Home')}
            </Link>
            <a
              href="mailto:support@echogrow.ai"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              aria-label={t('Contact Support')}
            >
              {t('Contact Support')}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


