"use client";

import { motion } from "framer-motion";

interface AIStreamingVisualizerProps {
  label?: string;
  sublabel?: string;
  variant?: "bars" | "pulse" | "minimal";
  className?: string;
}

export function AIStreamingVisualizer({
  label = "CareerOS Copilot is thinking...",
  sublabel = "Evaluating skills & real-time career benchmarks",
  variant = "bars",
  className = "",
}: AIStreamingVisualizerProps) {
  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-xs text-[var(--accent-primary)] ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]" />
        </span>
        <span className="font-medium">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[var(--accent-primary)]/25 bg-[var(--surface-secondary)]/80 backdrop-blur-md p-4 flex items-center gap-4 ${className}`}
    >
      {/* Animated visualizer bars */}
      <div className="flex items-center gap-1 h-7 px-1">
        {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((heightRatio, i) => (
          <motion.span
            key={i}
            className="w-1 bg-[var(--accent-primary)] rounded-full"
            animate={{
              scaleY: [heightRatio * 0.3, heightRatio, heightRatio * 0.4],
              opacity: [0.5, 1, 0.6],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
            style={{
              height: "100%",
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-[var(--text-primary)]">
            {label}
          </span>
          <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] rounded">
            LIVE AI
          </span>
        </div>
        {sublabel && (
          <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
