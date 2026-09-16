"use client";

import React from "react";
import { motion } from "framer-motion";

interface MarqueeItem {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  badge?: string;
}

interface KineticMarqueeProps {
  items: MarqueeItem[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}

export default function KineticMarquee({
  items,
  speed = 28,
  reverse = false,
  className = "",
}: KineticMarqueeProps) {
  // Duplicate array to create seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden py-3 select-none ${className}`}>
      {/* Left/right smooth gradient mask */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-[#080b12] to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-[#080b12] to-transparent" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="group flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-900/60 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]"
          >
            {item.icon && <span className="text-base">{item.icon}</span>}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200 tracking-wide">
                {item.label}
              </span>
              {item.sublabel && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.sublabel}
                </span>
              )}
            </div>
            {item.badge && (
              <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan-300">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
