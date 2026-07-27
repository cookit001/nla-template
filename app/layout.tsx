import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#131314',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nla-template.vercel.app'),
  title: 'NLA Templates',
  description: 'Fast, standardized legal templates for creators, founders, freelancers, and crypto-native teams.',
  openGraph: {
    title: 'NLA Templates',
    description: 'Fast, standardized legal templates for creators, founders, freelancers, and crypto-native teams.',
    url: 'https://nla-template.vercel.app',
    siteName: 'NLA Templates',
    images: ['/image.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NLA Templates',
    description: 'Fast, standardized legal templates for creators, founders, freelancers, and crypto-native teams.',
    images: ['/image.png'],
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
    'base:app_id': '6a656dc7281b6db318994c51',
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://nla-template.vercel.app/image.png',
    'fc:frame:post_url': 'https://nla-template.vercel.app/api/frame',
    'fc:frame:button:1': 'Open NLA Templates',
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
      <body className="min-h-screen bg-[#131314] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col items-center justify-start relative overflow-x-hidden w-full">
        {/* Ambient Gemini Background */}
        <div className="fixed top-[-15%] left-[40%] w-[300px] sm:w-[500px] h-[250px] bg-[#d4af37]/[0.05] blur-[120px] rounded-full pointer-events-none gemini-aura-blue z-0" />
        <div className="fixed bottom-[-15%] right-[-5%] w-[250px] sm:w-[400px] h-[300px] bg-[#a8c7fa]/[0.04] blur-[140px] rounded-full pointer-events-none gemini-aura-purple z-0" />
        
        {/* Main Application Shell Container */}
        <div className="w-full min-h-screen flex flex-col z-10 relative">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
