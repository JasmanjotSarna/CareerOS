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
import { cn } from '@/lib/utils';

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
    triggerIntervention(id, 'AI Intervention Sent: 1-on-1 counseling booked and remedial tasks assigned.');
    setDispatchedId(id);
    setTimeout(() => setDispatchedId(null), 2500);
  };

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <FacultySidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#202938]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Cohort Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Student Directory & Interventions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live placement candidate registry for JECRC University (842 students tracked).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting Placement Report CSV for 842 students...')}
              className="px-3.5 py-2 rounded-xl bg-[#161e2e] border border-[#202938] hover:bg-[#202938] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="p-4 rounded-2xl bg-[#111722] border border-[#202938] space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student name or roll number..."
                className="w-full pl-9 pr-3 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Branch Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b} value={b}>Branch: {b}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r} value={r}>Role: {r}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d111a] border border-[#202938] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>Status: {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Showing <strong>{filteredStudents.length}</strong> matching candidates</span>
            {selectedStatus === 'At-Risk' && (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Showing At-Risk Candidates (&lt;40% Readiness)
              </span>
            )}
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-[#111722] border border-[#202938] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0d111a] border-b border-[#202938] text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Main Gap</th>
                  <th className="py-3 px-4">Days to Drive</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Intervention / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202938]">
                {filteredStudents.map((student) => {
                  const statusStyles = {
                    'Ready': 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40',
                    'Developing': 'bg-cyan-950/70 text-cyan-400 border-cyan-500/40',
                    'At-Risk': 'bg-rose-950/70 text-rose-400 border-rose-500/40',
                  }[student.status];

                  return (
                    <tr key={student.id} className="hover:bg-[#161e2e]/50 transition-colors">
                      {/* Student Name */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/faculty/students/${student.id}`}
                          className="font-bold text-white hover:text-cyan-400 block transition-colors"
                        >
                          {student.name}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-mono">{student.rollNumber}</span>
                      </td>

                      {/* Branch */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{student.branch}</td>

                      {/* Target Role */}
                      <td className="py-3.5 px-4 text-slate-300">{student.targetRole}</td>

                      {/* Readiness */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-white">{student.overallReadiness}%</span>
                          <div className="w-12 h-1.5 bg-[#080b12] rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                student.overallReadiness >= 75 ? 'bg-emerald-400' : student.overallReadiness >= 50 ? 'bg-cyan-400' : 'bg-rose-500'
                              )}
                              style={{ width: `${student.overallReadiness}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Main Gap */}
                      <td className="py-3.5 px-4 text-slate-400 max-w-[180px] truncate" title={student.mainGap}>
                        {student.mainGap}
                      </td>

                      {/* Days to Drive */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {student.daysToDrive} days
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', statusStyles)}>
                          {student.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {student.requiresIntervention ? (
                          <button
                            onClick={() => handleDispatch(student.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            {dispatchedId === student.id ? 'Dispatched ✓' : 'Intervene'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic pr-2">On Track</span>
                        )}

                        <Link
                          href={`/faculty/students/${student.id}`}
                          className="inline-flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg bg-[#161e2e] text-slate-300 hover:text-white hover:bg-[#202938] text-[11px] font-semibold transition-colors"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FacultyStudentsPage() {
  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col">
      <TopNav />
      <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading placement cohort...</div>}>
        <FacultyStudentsContent />
      </Suspense>
    </div>
  );
}
