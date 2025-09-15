import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import I18nProvider from '../components/I18nProvider';
import QueryProvider from '../components/QueryProvider';

export const metadata: Metadata = {
  title: 'EchoGrow',
  description: 'Grow your audience smartly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <I18nProvider>{children}</I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
