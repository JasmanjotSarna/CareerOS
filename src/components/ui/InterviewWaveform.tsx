'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface InterviewWaveformProps {
  isActive?: boolean;
  mode?: 'listening' | 'speaking' | 'thinking' | 'idle';
  className?: string;
}

export function InterviewWaveform({
  isActive = true,
  mode = 'speaking',
  className
}: InterviewWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = canvas.parentElement?.clientWidth || 320;
    const height = 48;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerY = (height * dpr) / 2;
      const totalBars = 36;
      const barWidth = 3 * dpr;
      const spacing = (canvas.width - totalBars * barWidth) / (totalBars - 1);

      step += prefersReduced ? 0.02 : 0.08;

      let color = '6, 182, 212'; // cyan
      if (mode === 'listening') color = '16, 185, 129'; // emerald
      if (mode === 'thinking') color = '139, 92, 246'; // violet

      for (let i = 0; i < totalBars; i++) {
        const x = i * (barWidth + spacing);
        const distFromCenter = Math.abs(i - totalBars / 2) / (totalBars / 2);
        const bellCurve = Math.cos(distFromCenter * (Math.PI / 2));

        let amp = 0.15;
        if (isActive && mode === 'speaking') {
          amp = (Math.sin(step + i * 0.35) * 0.5 + 0.5) * bellCurve;
        } else if (isActive && mode === 'listening') {
          amp = (Math.cos(step * 1.5 + i * 0.5) * 0.6 + 0.4) * bellCurve;
        } else if (isActive && mode === 'thinking') {
          amp = (Math.sin(step * 0.5 + i * 0.2) * 0.3 + 0.3) * bellCurve;
        }

        const barHeight = Math.max(4 * dpr, amp * (height * dpr * 0.85));
        const y = centerY - barHeight / 2;

        ctx.fillStyle = `rgba(${color}, ${0.3 + amp * 0.7})`;
        ctx.shadowColor = `rgba(${color}, 0.5)`;
        ctx.shadowBlur = 8 * dpr;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isActive, mode, prefersReduced]);

  return (
    <div className={cn('relative w-full h-12 flex items-center justify-center overflow-hidden', className)}>
      <canvas ref={canvasRef} className="w-full h-12 block" />
    </div>
  );
}
