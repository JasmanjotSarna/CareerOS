'use client';

import React from 'react';

export function InstitutionalBridge() {
  const pillars = [
    {
      acronym: 'BET',
      title: 'Business English Training',
      traditional: 'Classroom grammar drills, verbal tests, and group discussion sessions.',
      careeros: 'Continuous AI acoustic speech assessment, real-time filler word monitoring, and STAR framework interview simulations.',
      differentiator: 'Personalises delivery pacing for each student without replacing university faculty instruction.',
    },
    {
      acronym: 'CBT',
      title: 'Computer Based Training',
      traditional: 'Scheduled aptitude exams, multiple-choice questions, and periodic DSA coding tests.',
      careeros: 'Adaptive problem sequencing, automatic identification of edge-case bugs, and real-time code complexity analysis.',
      differentiator: 'Pins individual weaknesses to specific syllabus modules so test prep becomes deterministic.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="max-w-2xl">
        <h3 className="text-3xl sm:text-4xl font-serif text-[#26251e] dark:text-[#edece8] leading-tight">
          Personalised on top of university training.
        </h3>
        <p className="mt-3 text-base text-[#3f3e37] dark:text-[#cbc9c1] leading-relaxed">
          CareerOS does not replace JECRC University&apos;s BET, CBT, or faculty mentorship. It connects with them, identifying precise individual gaps and sequencing each student&apos;s journey to placement readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: The BET & CBT Dual Engine */}
        <div className="lg:col-span-7 space-y-6">
          {pillars.map((p) => (
            <div
              key={p.acronym}
              className="p-6 md:p-8 rounded-2xl bg-[#d3d2ce] dark:bg-[#24231f] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold tracking-tight text-[#2456d6] dark:text-[#4a7cf6]">
                  {p.acronym}
                </span>
                <span className="text-sm px-3 py-1 rounded bg-[#cac9c4] dark:bg-[#2d2c27] font-medium text-[#26251e] dark:text-[#edece8]">
                  Syllabus Alignment
                </span>
              </div>
              <h4 className="text-xl font-bold text-[#26251e] dark:text-[#edece8] leading-snug">
                {p.title}
              </h4>
              <div className="space-y-3 text-sm">
                <p className="text-[#5f5d55] dark:text-[#a6a49c]">
                  <strong className="text-[#26251e] dark:text-[#edece8]">Campus Baseline: </strong>
                  {p.traditional}
                </p>
                <p className="text-[#26251e] dark:text-[#edece8] leading-relaxed">
                  <strong className="text-[#2456d6] dark:text-[#4a7cf6]">CareerOS Layer: </strong>
                  {p.careeros}
                </p>
              </div>
              <div className="pt-2 text-sm text-[#5f5d55] dark:text-[#a6a49c]">
                {p.differentiator}
              </div>
            </div>
          ))}
        </div>

        {/* Right 5 Columns: Archival Picture & Placement Cell Integration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl overflow-hidden bg-[#d3d2ce] dark:bg-[#24231f] p-4">
            <img
              src="/assets/images/four-elephants-with-western-travellers-and-attendants.jpg"
              alt="Archival painting of Jaipur travellers and attendants, 1860s, Metropolitan Museum of Art"
              className="w-full h-56 object-cover rounded-xl"
              width={440}
              height={224}
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c] mt-3 px-1">
              Jaipur heritage archive. Met Museum CC0 collection.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-[#d3d2ce] dark:bg-[#24231f] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tracking-tight text-[#2456d6] dark:text-[#4a7cf6]">
                TPO
              </span>
              <span className="text-sm px-3 py-1 rounded bg-[#cac9c4] dark:bg-[#2d2c27] font-medium text-[#26251e] dark:text-[#edece8]">
                Placement Office
              </span>
            </div>
            <h4 className="text-xl font-bold text-[#26251e] dark:text-[#edece8]">
              Faculty & Placement Officer Portal
            </h4>
            <p className="text-sm text-[#3f3e37] dark:text-[#cbc9c1] leading-relaxed">
              Provides departmental placement heads with predictive readiness indicators across all 1,240 students before company recruitment rosters are finalized.
            </p>
            <div className="pt-2 text-sm text-[#2456d6] dark:text-[#4a7cf6] font-medium">
              Eliminates spreadsheet friction with verified cryptographic proof of readiness.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
