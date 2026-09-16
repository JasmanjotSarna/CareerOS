import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { AIChatDrawer } from '@/components/ai/AIChatDrawer';
import CustomCursor from '@/components/effects/CustomCursor';

export const metadata: Metadata = {
  title: 'CareerOS — AI-Powered Career Readiness & Placement Platform',
  description: 'From Student to Job-Ready. CareerOS is the intelligence layer between university students and employment, continuously tracking target roles, skill gaps, resume quality, and placement readiness.',
  keywords: ['CareerOS', 'AI Career Readiness', 'Campus Placement', 'Job Suitability', 'ATS Resume', 'Technical Interview Prep'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080B12] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <CustomCursor />
        <AppProvider>
          {children}
          <AIChatDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
