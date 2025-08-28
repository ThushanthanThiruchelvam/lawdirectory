'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Head from 'next/head';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang={isClient ? i18n.language : 'en'}>
      <Head>
        <title>Professional Portfolio</title>
      </Head>
      <body className={inter.className}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </I18nextProvider>
      </body>
      {process.env.GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}