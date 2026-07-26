import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nla-template.vercel.app'),
  title: 'NLA & Partners — Free NDA Generator | Deterministic Legal Templates',
  description:
    'Generate standardized, SHA-256 verified Non-Disclosure Agreements in seconds. Multi-jurisdiction support for Delaware, UK, Singapore, Nigeria, EU & more. Built for web3 teams, startups, and enterprise on Farcaster, Base, X, and the open web.',
  keywords: [
    'NDA generator',
    'free NDA template',
    'non-disclosure agreement',
    'legal template generator',
    'NDA boilerplate',
    'SHA-256 verified NDA',
    'multi-jurisdiction NDA',
    'Delaware NDA',
    'Singapore NDA',
    'UK NDA',
    'Nigeria NDA',
    'EU NDA',
    'web3 legal',
    'Farcaster mini app',
    'Base ecosystem',
    'startup NDA',
    'enterprise NDA',
    'NLA Partners',
    '9Realms Studios',
    '$NLA',
    'deterministic legal',
    'crypto NDA',
  ],
  authors: [{ name: '9Realms Studios' }, { name: 'NLA & Partners' }],
  creator: '9Realms Studios',
  publisher: 'NLA & Partners',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NLA & Partners',
    title: 'NLA & Partners — Free NDA Generator | In Boilerplate We Trust',
    description:
      'Generate standardized, SHA-256 verified Non-Disclosure Agreements in seconds. Multi-jurisdiction support for Delaware, UK, Singapore, Nigeria, EU & more.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'NLA & Partners — In Boilerplate We Trust — Deterministic NDA Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NLA & Partners — Free NDA Generator',
    description:
      'Generate standardized, SHA-256 verified NDAs in seconds. Multi-jurisdiction. Built for web3 teams, startups & enterprise.',
    images: ['/og-image.svg'],
    creator: '@9realms',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://nla-template.vercel.app',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/og-image.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col items-center justify-start relative overflow-x-hidden w-full">
        {/* Ambient Background — Subtle, Not Overdone */}
        <div className="fixed top-[-15%] left-[40%] w-[300px] sm:w-[500px] h-[250px] bg-[#e2b714]/[0.06] blur-[120px] rounded-full pointer-events-none ambient-glow-amber z-0" />
        <div className="fixed bottom-[-15%] right-[-5%] w-[250px] sm:w-[400px] h-[300px] bg-emerald-500/[0.04] blur-[140px] rounded-full pointer-events-none ambient-glow-emerald z-0" />
        
        {/* Main Responsive Application Container */}
        <main className="w-full max-w-lg min-h-screen flex flex-col px-4 sm:px-6 py-5 sm:py-8 z-10 relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
