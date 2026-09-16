'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string; // e.g. "rgba(6, 182, 212, 0.12)"
  className?: string;
  interactive?: boolean;
}

export function GlowCard({
  children,
  glowColor = 'rgba(6, 182, 212, 0.12)',
  className,
  interactive = true,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative rounded-2xl bg-[#0B0F16] border border-white/[0.08] overflow-hidden transition-all duration-300',
        interactive && 'hover:border-white/[0.18] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
        className
      )}
      {...props}
    >
      {/* Subtle cursor tracking bloom (Active Theory rack-focus illumination) */}
      {interactive && !prefersReduced && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 60%)`
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
