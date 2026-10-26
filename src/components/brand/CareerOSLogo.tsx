"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { soundFX } from "@/components/effects/SoundFX";
import { cn } from "@/lib/utils";

interface CareerOSLogoProps {
  variant?: "full" | "icon" | "badge" | "capsule";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Overrides the image height, e.g. "h-6 sm:h-8". */
  imageClassName?: string;
  /** "auto" plates the logo only in dark mode; "always" is for permanent dark surfaces. */
  plate?: "auto" | "always" | "never";
  href?: string;
  showTagline?: boolean;
}

const HEIGHT_CLASSES = {
  xs: "h-5",
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
} as const;

const ICON_SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
} as const;

export default function CareerOSLogo({
  variant = "badge",
  size = "md",
  className = "",
  imageClassName,
  plate = "auto",
  href,
  showTagline = true,
}: CareerOSLogoProps) {
  const imageHeight = imageClassName ?? HEIGHT_CLASSES[size];

  const wordmark = (
    <Image
      src="/brand/careeros-logo.png"
      alt="CareerOS"
      width={762}
      height={262}
      className={cn("w-auto object-contain", imageHeight)}
      priority
    />
  );

  const content = (() => {
    switch (variant) {
      case "icon":
        return (
          <span className={cn("relative inline-flex flex-shrink-0 items-center justify-center", className)}>
            <Image
              src="/brand/careeros-icon-transparent.png"
              alt="CareerOS"
              width={ICON_SIZES[size]}
              height={ICON_SIZES[size]}
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          </span>
        );

      case "capsule":
      case "badge":
        return (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-2 py-1 transition-all duration-300",
              plate !== "never" &&
                "dark:border dark:border-black/10 dark:bg-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.28)]",
              plate === "always" &&
                "border border-black/10 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.28)]",
              className
            )}
          >
            {wordmark}
          </span>
        );

      case "full":
      default:
        return (
          <span className={cn("relative inline-flex flex-col items-start", className)}>
            <span
              className={cn(
                "rounded-xl p-2",
                plate !== "never" &&
                  "dark:border dark:border-black/10 dark:bg-white dark:shadow-md",
                plate === "always" && "border border-black/10 bg-white shadow-md"
              )}
            >
              {wordmark}
            </span>
            {showTagline && (
              <span className="pt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                From Student to Job-Ready.
              </span>
            )}
          </span>
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
        aria-label="CareerOS home"
        className="inline-flex shrink-0 items-center rounded-lg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
