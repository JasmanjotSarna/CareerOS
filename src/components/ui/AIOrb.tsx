'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

export type AIOrbState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'processing' | 'evaluating';

interface AIOrbProps {
  state?: AIOrbState;
  readinessTrend?: number; // e.g. +8 or 0 or -2 (the orb's memory)
  size?: number; // in pixels (default 160)
  className?: string;
  onClick?: () => void;
}

export function AIOrb({
  state = 'idle',
  readinessTrend = 4,
  size = 160,
  className,
  onClick
}: AIOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = (size * dpr) / 2;
      const cy = (size * dpr) / 2;
      const baseRadius = (size * dpr) * 0.35;

      t += prefersReduced ? 0.005 : 0.025;

      // Color scheme based on state & memory
      let primaryColor = '6, 182, 212'; // cyan
      let secondaryColor = '139, 92, 246'; // violet
      let pulseSpeed = 1;

      if (state === 'listening') {
        primaryColor = '16, 185, 129'; // emerald
        secondaryColor = '6, 182, 212';
        pulseSpeed = 1.8;
      } else if (state === 'thinking') {
        primaryColor = '139, 92, 246'; // violet
        secondaryColor = '245, 158, 11'; // amber
        pulseSpeed = 2.4;
      } else if (state === 'speaking') {
        primaryColor = '6, 182, 212';
        secondaryColor = '139, 92, 246';
        pulseSpeed = 3.0;
      } else if (state === 'evaluating') {
        primaryColor = '245, 158, 11'; // amber
        secondaryColor = '239, 68, 68'; // danger/intensity
        pulseSpeed = 1.6;
      } else {
        // Idle state reflects memory of readiness trend!
        if (readinessTrend > 0) {
          primaryColor = '6, 182, 212';
          secondaryColor = '139, 92, 246';
          pulseSpeed = 1.0;
        } else {
          // Stalled / need attention: more concentrated amber-cyan core
          primaryColor = '245, 158, 11';
          secondaryColor = '6, 182, 212';
          pulseSpeed = 0.6;
        }
      }

      // Outer ethereal ambient glow
      const ambientRadius = baseRadius * (1.2 + Math.sin(t * pulseSpeed) * 0.1);
      const ambientGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ambientRadius);
      ambientGrad.addColorStop(0, `rgba(${primaryColor}, 0.25)`);
      ambientGrad.addColorStop(0.6, `rgba(${secondaryColor}, 0.08)`);
      ambientGrad.addColorStop(1, 'rgba(7, 10, 15, 0)');

      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, ambientRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core neural sphere
      const coreRadius = baseRadius * (0.85 + Math.sin(t * pulseSpeed * 1.5) * 0.05);
      const coreGrad = ctx.createRadialGradient(
        cx - coreRadius * 0.2, 
        cy - coreRadius * 0.2, 
        coreRadius * 0.1, 
        cx, 
        cy, 
        coreRadius
      );
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, `rgba(${primaryColor}, 0.95)`);
      coreGrad.addColorStop(0.8, `rgba(${secondaryColor}, 0.8)`);
      coreGrad.addColorStop(1, 'rgba(7, 10, 15, 0.4)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic orbital rings / activity particles
      const ringCount = state === 'thinking' || state === 'speaking' ? 3 : 2;
      for (let r = 0; r < ringCount; r++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (0.4 + r * 0.2) * (r % 2 === 0 ? 1 : -1));

        ctx.beginPath();
        ctx.ellipse(0, 0, coreRadius * (1.15 + r * 0.25), coreRadius * (0.45 + r * 0.15), Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r % 2 === 0 ? primaryColor : secondaryColor}, ${0.4 - r * 0.1})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();

        // Orb particle beacon
        const px = Math.cos(t * (2 + r)) * coreRadius * (1.15 + r * 0.25);
        const py = Math.sin(t * (2 + r)) * coreRadius * (0.45 + r * 0.15);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, readinessTrend, size, prefersReduced]);

  return (
    <div 
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:scale-105',
        className
      )}
      style={{ width: size, height: size }}
      title={`CareerOS AI Intelligence • State: ${state.toUpperCase()}`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block drop-shadow-[0_0_32px_rgba(6,182,212,0.3)]"
      />
    </div>
  );
}
