import React from 'react';
import './globals.css';

export const metadata = {
  title: 'NLA & PARTNERS • In Boilerplate We Trust',
  description: 'Deterministic legal template generator Farcaster Mini App powered by 9Realms Studios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col items-center justify-start relative overflow-x-hidden w-full">
        {/* Ambient Background Glow Effects */}
        <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none ambient-glow-amber z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none ambient-glow-emerald z-0" />
        
        {/* Main Responsive Application Container */}
        <main className="w-full max-w-xl min-h-screen flex flex-col px-3 sm:px-6 py-4 sm:py-8 z-10 relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
