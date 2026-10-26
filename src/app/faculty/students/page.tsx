'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Users, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  Send,
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { TopNav } from '@/components/navigation/TopNav';
import { FacultySidebar } from '@/components/navigation/FacultySidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressRing';
import { soundFX } from '@/components/effects/SoundFX';

function FacultyStudentsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') === 'at-risk' ? 'At-Risk' : 'All';

  const { facultyStudents, triggerIntervention } = useApp();

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilter);
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  const branches = ['All', 'CSE', 'CSE (AI & ML)', 'Information Technology', 'ECE'];
  const roles = ['All', 'Software Engineer — SDE-1', 'Data Analyst', 'Machine Learning Engineer', 'Cloud & DevOps Engineer'];
  const statuses = ['All', 'Ready', 'Developing', 'At-Risk'];

  const filteredStudents = facultyStudents.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) || 
      student.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || student.branch === selectedBranch;
    const matchesRole = selectedRole === 'All' || student.targetRole === selectedRole;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesRole && matchesStatus;
  });

  const handleDispatch = (id: string) => {
    soundFX.playClick();
    triggerIntervention(id, 'AI Intervention Sent: 1-on-1 counseling booked and remedial tasks assigned.');
    setDispatchedId(id);
    setTimeout(() => setDispatchedId(null), 2500);
    soundFX.playSuccess();
  };

  return (
    <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-6">
      <FacultySidebar />

      <main className="min-w-0 flex-1 py-8 md:px-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>COHORT MANAGEMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Directory & Registry
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Live placement candidate registry ({facultyStudents.length} candidates tracked).
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert('Exporting Placement Report CSV...')}
          >
            Export Report CSV
          </Button>
        </div>

        {/* Search & Filters */}
        <Card className="p-4 bg-[var(--surface-primary)] border border-[var(--border-default)]">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-[var(--text-dim)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate by name or roll number..."
                className="w-full pl-9 pr-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full p-2 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b} value={b} className="bg-[var(--surface-primary)] text-white">
                    {b === 'All' ? 'All Engineering Branches' : b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-[var(--surface-primary)] text-white">
                    {s === 'All' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Candidate Table */}
        <div className="space-y-3">
          {filteredStudents.map((st) => (
            <Card
              key={st.id}
              className="p-4 bg-[var(--surface-primary)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{st.name}</h4>
                  <span className="text-[10px] font-mono text-[var(--text-dim)]">({st.rollNumber})</span>
                  <Badge variant={st.status === 'Ready' ? 'success' : st.status === 'At-Risk' ? 'momentum' : 'indigo'}>
                    {st.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {st.branch} • Target: <strong className="text-white">{st.targetRole}</strong> • ATS: {st.resumeAtsScore}%
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Readiness</span>
                  <span className="text-base font-mono font-bold text-cyan-400">{st.overallReadiness}%</span>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDispatch(st.id)}
                  disabled={dispatchedId === st.id}
                >
                  {dispatchedId === st.id ? 'Sent!' : 'Intervene'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function FacultyStudentsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <TopNav />
      <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-cyan-400">Loading Directory...</div>}>
        <FacultyStudentsContent />
      </Suspense>
    </div>
  );
}
