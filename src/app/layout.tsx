import React from 'react';
import './globals.css';

export const metadata = {
  title: 'NLA & PARTNERS • In Boilerplate We Trust',
  description: 'Deterministic legal template generator Farcaster Mini App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between antialiased selection:bg-amber-500 selection:text-slate-950">
        <main className="w-full max-w-lg min-h-screen flex flex-col px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
