"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { soundFX } from "@/components/effects/SoundFX";

interface CareerOSLogoProps {
  variant?: "full" | "icon" | "badge" | "capsule";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
  showTagline?: boolean;
}

export default function CareerOSLogo({
  variant = "badge",
  size = "md",
  className = "",
  href,
  showTagline = true,
}: CareerOSLogoProps) {
  // Height configurations preserving exact proportions
  const sizeMap = {
    xs: { h: 24, w: 82, iconSize: 24 },
    sm: { h: 30, w: 103, iconSize: 30 },
    md: { h: 38, w: 130, iconSize: 38 },
    lg: { h: 48, w: 165, iconSize: 48 },
    xl: { h: 64, w: 220, iconSize: 64 },
  };

  const { h, w, iconSize } = sizeMap[size];

  const content = (() => {
    switch (variant) {
      case "icon":
        return (
          <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
            <Image
              src="/brand/careeros-icon-transparent.png"
              alt="CareerOS Icon"
              width={iconSize}
              height={iconSize}
              className="object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        );

      case "capsule":
      case "badge":
        return (
          <div
            className={`inline-flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.2)] backdrop-blur-sm border border-slate-200 transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] ${className}`}
          >
            <Image
              src="/brand/careeros-logo.png"
              alt="CareerOS — From Student to Job-Ready"
              width={w}
              height={h}
              className="object-contain"
              priority
            />
          </div>
        );

      case "full":
      default:
        return (
          <div className={`relative inline-flex flex-col items-start ${className}`}>
            <div className="rounded-xl bg-white p-2 shadow-md border border-slate-200">
              <Image
                src="/brand/careeros-logo.png"
                alt="CareerOS — From Student to Job-Ready"
                width={w * 1.5}
                height={h * 1.5}
                className="object-contain"
                priority
              />
            </div>
            {showTagline && (
              <span className="text-[11px] font-mono text-slate-400 pt-1 tracking-wider uppercase font-semibold">
                From Student to Job-Ready.
              </span>
            )}
          </div>
        );
    }
  })();

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={() => soundFX.playHover()}
        onClick={() => soundFX.playClick()}
        data-cursor-text="HOME"
        className="inline-flex items-center transition-opacity hover:opacity-95 cursor-pointer"
      >
        {content}
      </Link>
    );
  }

  return content;
}
