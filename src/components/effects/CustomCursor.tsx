"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer aura
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, select, [role="button"], .interactive-target, [data-cursor]'
      );

      if (interactive) {
        setIsHovering(true);
        const customText = interactive.getAttribute("data-cursor-text");
        if (customText) {
          setHoverText(customText);
        } else {
          setHoverText("");
        }
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Tiny sharp center point */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isHovering ? 0.4 : 1,
          scale: isClicking ? 0.6 : 1,
        }}
      />

      {/* Smooth trailing glow ring with cyber reticle */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 bg-cyan-500/5 backdrop-blur-[1px]"
        style={{
          x: smoothX,
          y: smoothY,
          width: isHovering ? (hoverText ? 80 : 54) : 28,
          height: isHovering ? (hoverText ? 80 : 54) : 28,
          borderColor: isHovering ? "rgba(139, 92, 246, 0.7)" : "rgba(6, 182, 212, 0.4)",
          backgroundColor: isHovering ? "rgba(139, 92, 246, 0.12)" : "rgba(6, 182, 212, 0.04)",
          boxShadow: isHovering
            ? "0 0 25px rgba(139, 92, 246, 0.35), inset 0 0 10px rgba(6, 182, 212, 0.2)"
            : "0 0 12px rgba(6, 182, 212, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {isHovering && hoverText && (
          <span className="text-[10px] font-mono tracking-wider font-semibold text-cyan-200 uppercase">
            {hoverText}
          </span>
        )}
        {/* Subtle crosshair notches */}
        {isHovering && !hoverText && (
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-1/2 h-1 w-[1px] -translate-x-1/2 bg-cyan-400/80" />
            <div className="absolute bottom-0 left-1/2 h-1 w-[1px] -translate-x-1/2 bg-cyan-400/80" />
            <div className="absolute top-1/2 left-0 h-[1px] w-1 -translate-y-1/2 bg-cyan-400/80" />
            <div className="absolute top-1/2 right-0 h-[1px] w-1 -translate-y-1/2 bg-cyan-400/80" />
          </div>
        )}
      </motion.div>
    </>
  );
}
