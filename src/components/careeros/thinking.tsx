'use client';

import React, { useEffect, useRef, useState } from 'react';

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function useTyped(text: string, active: boolean, speed = 18) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return text.slice(0, n);
}

export interface ReasoningStep {
  tag: string;
  title: string;
  out: string;
  conf: number;
}

const DEFAULT_STEPS: ReasoningStep[] = [
  { tag: 'PARSE', title: 'Reading resume', out: 'Found 6 roles • 4.2 yrs exp • 31 skill mentions', conf: 0.94 },
  { tag: 'EXTRACT', title: 'Normalising skills', out: 'React → frontend.react • SQL → data.sql • "led team of 4" → leadership', conf: 0.88 },
  { tag: 'MATCH', title: 'Mapping to roles', out: 'Product Engineer 0.82 • Frontend Lead 0.77 • Solutions Eng 0.61', conf: 0.82 },
  { tag: 'GAP', title: 'Weighing gaps', out: 'Missing: system design (high), TypeScript generics (med)', conf: 0.79 },
  { tag: 'PLAN', title: 'Drafting a 90-day plan', out: 'W1-3 system design • W4 ship portfolio project • W6 apply to 12', conf: 0.86 },
];

export function ThinkingTrace({
  steps = DEFAULT_STEPS,
  interactive = true,
}: {
  steps?: ReasoningStep[];
  interactive?: boolean;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!interactive) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (steps.length + 1)), 2600);
    return () => clearInterval(id);
  }, [interactive, steps.length]);

  const current = steps[Math.min(step, steps.length - 1)]!;
  const typed = useTyped(current.out, step < steps.length);
  const done = step === steps.length;

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] font-mono text-[12.5px] shadow-2xl"> {/* taste-skill-ignore */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-2.5 text-[var(--text-muted)]"> {/* taste-skill-ignore */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[var(--signal)] animate-pulse-dot" /> {/* taste-skill-ignore */}
            <span className="relative h-2 w-2 rounded-full bg-[var(--signal)]" />
          </span>
          <span className="text-white font-medium">careeros.reason()</span>
        </div>
        <span>{done ? 'complete' : `step ${step + 1}/${steps.length}`}</span>
      </div>
      <div className="relative h-px overflow-hidden bg-[var(--border-default)]"> {/* taste-skill-ignore */}
        <div className="absolute inset-y-0 w-1/4 bg-[var(--signal)] animate-scan" />
      </div>
      <ol className="space-y-1 p-4">
        {steps.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'idle';
          return (
            <li
              key={s.tag}
              className={`rounded-md px-3 py-2 transition-all duration-500 ${ /* taste-skill-ignore */
                state === 'active' ? 'bg-[var(--surface-tertiary)]' : ''
              } ${state === 'idle' ? 'opacity-30' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-16 shrink-0 text-[10.5px] tracking-widest font-bold ${
                    state === 'idle' ? 'text-[var(--text-muted)]' : 'text-[var(--signal)]'
                  }`}
                >
                  {state === 'done' ? '✓ ' : state === 'active' ? '› ' : '  '} {/* taste-skill-ignore */}
                  {s.tag}
                </span>
                <span className="text-[var(--text-primary)]">{s.title}</span>
                {state !== 'idle' && (
                  <span className="ml-auto text-[var(--text-muted)]">
                    {Math.round(s.conf * 100)}%
                  </span>
                )}
              </div>
              {state === 'active' && (
                <p className="caret mt-1.5 pl-[76px] text-[var(--text-muted)]">{typed}</p>
              )}
              {state === 'done' && (
                <p className="mt-1 truncate pl-[76px] text-[var(--text-muted)]/70">{s.out}</p>
              )}
            </li>
          );
        })}
      </ol>
      <div className="border-t border-[var(--border-default)] px-4 py-3"> {/* taste-skill-ignore */}
        <div className="mb-1.5 flex justify-between text-[var(--text-muted)]">
          <span>confidence</span>
          <span className="text-[var(--text-primary)]">
            {done ? '0.86' : current.conf.toFixed(2)}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-tertiary)]">
          <div
            className="h-full bg-[var(--signal)] transition-all duration-700" /* taste-skill-ignore */
            style={{ width: `${((done ? steps.length : step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const NODES = [
  { id: 'you', x: 60, y: 160, label: 'You' },
  { id: 'react', x: 220, y: 60, label: 'React' },
  { id: 'sql', x: 220, y: 160, label: 'SQL' },
  { id: 'lead', x: 220, y: 260, label: 'Leadership' },
  { id: 'pe', x: 420, y: 100, label: 'Product Eng.' },
  { id: 'fl', x: 420, y: 220, label: 'Frontend Lead' },
  { id: 'plan', x: 580, y: 160, label: 'Plan' },
];

const EDGES: [string, string][] = [
  ['you', 'react'],
  ['you', 'sql'],
  ['you', 'lead'],
  ['react', 'pe'],
  ['sql', 'pe'],
  ['react', 'fl'],
  ['lead', 'fl'],
  ['pe', 'plan'],
  ['fl', 'plan'],
];

export function ReasoningGraph() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const pos = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<
    string,
    (typeof NODES)[number]
  >;

  return (
    <div ref={ref} className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] p-4">
      <svg viewBox="0 0 640 320" className="w-full">
        {inView &&
          EDGES.map(([a, b], i) => {
            const p = pos[a]!,
              q = pos[b]!;
            const mx = (p.x + q.x) / 2;
            return (
              <path
                key={i}
                d={`M${p.x},${p.y} C${mx},${p.y} ${mx},${q.y} ${q.x},${q.y}`}
                className="draw-line fill-none stroke-[var(--signal)]/60"
                strokeWidth={1.2}
                style={{ animationDelay: `${i * 180}ms` }}
              />
            );
          })}
        {NODES.map((n, i) => (
          <g
            key={n.id}
            className={`transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0'}`} /* taste-skill-ignore */
            style={{ transitionDelay: `${i * 160}ms` }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={14}
              className="fill-[var(--signal)]/10 animate-pulse-dot" /* taste-skill-ignore */
              style={{
                transformOrigin: `${n.x}px ${n.y}px`,
                animationDelay: `${i * 200}ms`,
              }}
            />
            <circle cx={n.x} cy={n.y} r={5} className="fill-[var(--signal)]" />
            <text
              x={n.x}
              y={n.y + 30}
              textAnchor="middle"
              className="fill-[var(--text-primary)] font-mono text-[11px]" /* taste-skill-ignore */
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const GAPS = [
  { skill: 'System design', have: 34, need: 80 },
  { skill: 'TypeScript generics', have: 52, need: 75 },
  { skill: 'Stakeholder comms', have: 70, need: 78 },
  { skill: 'React architecture', have: 85, need: 80 },
];

export function SkillGap() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="space-y-5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] p-6">
      {GAPS.map((g, i) => (
        <div key={g.skill}>
          <div className="mb-2 flex justify-between font-mono text-xs"> {/* taste-skill-ignore */}
            <span className="text-[var(--text-primary)]">{g.skill}</span>
            <span className={g.have >= g.need ? 'text-[var(--signal)] font-medium' : 'text-[var(--text-muted)]'}>
              {g.have >= g.need ? 'covered' : `-${g.need - g.have}`}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-[var(--surface-tertiary)]">
            {inView && (
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--text-primary)] animate-fill"
                style={{ width: `${g.have}%`, animationDelay: `${i * 150}ms` }}
              />
            )}
            <div
              className="absolute -top-1 h-4 w-px bg-[var(--signal)]" /* taste-skill-ignore */
              style={{ left: `${g.need}%` }}
            />
          </div>
        </div>
      ))}
      <p className="font-mono text-[11px] text-[var(--text-muted)]"> {/* taste-skill-ignore */}
        ■ you • | target role requirement
      </p>
    </div>
  );
}

const QUERIES = [
  'find remote product eng roles',
  'rewrite resume for Linear',
  'prep me for system design',
];

export function CommandDemo() {
  const [q, setQ] = useState(0);
  const { ref, inView } = useReveal<HTMLDivElement>();
  const typed = useTyped(QUERIES[q]!, inView, 45);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setQ((v) => (v + 1) % QUERIES.length), 3600);
    return () => clearInterval(id);
  }, [inView]);

  const finished = typed.length === QUERIES[q]!.length;

  return (
    <div ref={ref} className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] shadow-2xl"> {/* taste-skill-ignore */}
      <div className="flex items-center gap-3 border-b border-[var(--border-default)] px-4 py-3.5 font-mono text-sm"> {/* taste-skill-ignore */}
        <span className="text-[var(--signal)]">⌘</span>
        <span className="caret text-[var(--text-primary)]">{typed}</span>
      </div>
      <ul className="p-2 text-sm">
        {['Search jobs', 'Open Resume Studio', 'Start interview session', 'Ask the coach'].map((r, i) => (
          <li
            key={r}
            className={`flex items-center justify-between rounded-md px-3 py-2 transition-all duration-300 ${ /* taste-skill-ignore */
              finished && i === q % 4
                ? 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            <span>{r}</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">↵</span> {/* taste-skill-ignore */}
          </li>
        ))}
      </ul>
    </div>
  );
}
