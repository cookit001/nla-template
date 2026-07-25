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
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col items-center justify-between relative overflow-x-hidden">
        {/* Ambient Glowing Background Meshes */}
        <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none ambient-glow-amber z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none ambient-glow-emerald z-0" />
        
        {/* Main Application Container */}
        <main className="w-full max-w-4xl min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
