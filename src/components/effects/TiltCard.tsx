"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltAngle?: number;
  showGlare?: boolean;
  onClick?: () => void;
  dataCursorText?: string;
}

export default function TiltCard({
  children,
  className = "",
  glowColor = "rgba(6, 182, 212, 0.4)",
  tiltAngle = 12,
  showGlare = true,
  onClick,
  dataCursorText,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates relative to center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spot light position coordinates in %
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Spring physics for smooth tilt
  const springConfig = { damping: 20, stiffness: 260 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAngle, -tiltAngle]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAngle, tiltAngle]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / rect.width - 0.5;
    const normalizedY = mouseY / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    setGlarePos({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative w-full"
    >
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        data-cursor-text={dataCursorText}
        className={`relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-xl transition-colors duration-300 ${
          isHovered ? "border-cyan-500/40" : ""
        } ${className}`}
      >
        {/* Dynamic mouse-following specular glare */}
        {showGlare && (
          <div
            className="pointer-events-none absolute -inset-px z-10 rounded-2xl opacity-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.75 : 0,
              background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 60%)`,
            }}
          />
        )}

        {/* Ambient border gradient line */}
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.4 : 0,
            boxShadow: `inset 0 0 20px ${glowColor}`,
          }}
        />

        {/* Content with 3D depth pop */}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-20">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
