import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AppProvider } from '@/lib/context/AppContext';
import { WorkspaceProvider } from '@/lib/workspace/WorkspaceContext';
import { AIChatDrawer } from '@/components/ai/AIChatDrawer';
import CustomCursor from '@/components/effects/CustomCursor';

export const metadata: Metadata = {
  title: 'CareerOS — From Student to Job-Ready',
  description:
    'Find out where you stand for the role you want, see exactly what is missing, build the path to close the gap, and get ready for the real interview.',
  keywords: [
    'CareerOS',
    'Career Readiness',
    'College Placement',
    'ATS Resume Optimization',
    'AI Technical Interview',
    'Skill Gap Analysis',
    'Personalized Roadmap',
  ],
  openGraph: {
    title: 'CareerOS — From Student to Job-Ready',
    description:
      'CareerOS finds out where you stand for the role you want, shows exactly what is missing, builds the path to close it, and gets you ready for the real interview.',
    siteName: 'CareerOS',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('careeros-theme') || 'light';
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (_) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;1,7..72,400&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased transition-colors duration-200 selection:bg-[var(--signal)] selection:text-white">
        <ThemeProvider>
          <CustomCursor />
          <AppProvider>
            <WorkspaceProvider>
              {children}
              <AIChatDrawer />
            </WorkspaceProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
