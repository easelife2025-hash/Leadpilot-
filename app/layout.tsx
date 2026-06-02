import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'LeadPilot AI - Intelligent Outreach',
  description: 'AI-driven lead management for modern SaaS.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
        {/* Animated Background Gradients */}
        <div className="pointer-events-none fixed inset-0 z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/20 blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-sky-300/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
