"use client";

import React, { useState, useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
}

const GLITCH_CHARS = "01#@!<>{}*&$%?+=-_/\\";

export default function GlitchText({
  text,
  className = "",
  triggerOnHover = true,
  speed = 35,
  as: Component = "span",
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);

    let iteration = 0;
    const maxIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsGlitching(false);
      }

      iteration += 1 / 2.5;
    }, speed);
  };

  useEffect(() => {
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }

      iteration += 1 / 2.5;
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <Component
      onMouseEnter={() => {
        if (triggerOnHover) startGlitch();
      }}
      className={`relative inline-block font-mono tracking-tight select-none cursor-default ${className}`}
    >
      {displayText}
    </Component>
  );
}
