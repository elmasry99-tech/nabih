import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Nabih — Advanced Electrical Intelligence Interface',
  description:
    'ESP32-based Non-Intrusive Load Monitoring system. Real-time appliance disaggregation, power quality analysis, and cost estimation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      {/* Inline script prevents flash of wrong theme before React hydrates */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('nabih-theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-body)' }}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
