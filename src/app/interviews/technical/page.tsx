'use client';

import React from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { StudentSidebar } from '@/components/navigation/StudentSidebar';
import { LiveInterviewStudio } from '@/components/interview/LiveInterviewStudio';
import { useApp } from '@/lib/context/AppContext';

export default function TechnicalInterviewPage() {
  const { activeTargetRole } = useApp();

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6">
        <StudentSidebar />

        <main className="flex-1 py-8 md:px-8 overflow-hidden">
          <LiveInterviewStudio 
            type="technical" 
            roleTitle={activeTargetRole.title} 
          />
        </main>
      </div>
    </div>
  );
}
