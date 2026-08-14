"use client";

import React, { useState } from "react";
import { FolderOpen, Sparkles, UploadCloud } from "lucide-react";

interface TechPlaceholderProps {
  /** Optional actual image source (if uploaded) */
  imageSrc?: string | null;
  /** File path guidance shown in the HUD badge (e.g. "/services/surveillance-solutions.jpg") */
  guidePath: string;
  /** Title shown on the HUD placeholder */
  title: string;
  /** Subtitle / guidance caption */
  subtitle?: string;
  /** Custom Icon component */
  icon?: React.ElementType;
  /** Aspect ratio */
  ratio?: "16:9" | "21:9" | "4:3";
  /** Dimensions guide text */
  dimensions?: string;
  /** Status tag text */
  tag?: string;
  className?: string;
}

export function TechPlaceholder({
  imageSrc,
  guidePath,
  title,
  subtitle,
  icon: IconComp,
  ratio = "16:9",
  dimensions = "800 × 450 px",
  tag,
  className = "",
}: TechPlaceholderProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasValidImage = Boolean(imageSrc && !imgError);

  // Height mappings based on ratio
  const ratioClasses =
    ratio === "21:9"
      ? "h-60 sm:h-72 lg:h-80"
      : ratio === "4:3"
      ? "h-48 sm:h-56"
      : "h-44 sm:h-48";

  return (
    <div
      className={`relative w-full ${ratioClasses} rounded-2xl overflow-hidden border border-[#2563eb]/25 bg-gradient-to-br from-[#0a1224] via-[#060c18] to-[#040810] group-hover:border-[#38bdf8]/50 transition-all duration-300 shadow-xl ${className}`}
    >
      {/* If real image is provided and hasn't errored */}
      {hasValidImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageSrc!}
          alt={title}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Cyber Blueprint HUD Placeholder (Always clean, no 404 flash) */}
      {(!hasValidImage || !imgLoaded) && (
        <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between text-center relative select-none">
          {/* Ambient Background Glows & Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:14px_14px] opacity-35 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-24 bg-[#2563eb]/15 rounded-full blur-2xl pointer-events-none" />

          {/* HUD Corner Tech Brackets */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#38bdf8]/50 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#38bdf8]/50 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#38bdf8]/50 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#38bdf8]/50 rounded-br-sm pointer-events-none" />

          {/* Top Bar: Status Tag & Spec */}
          <div className="relative z-10 w-full flex items-center justify-between text-[9px] font-mono text-gray-400">
            <span className="inline-flex items-center gap-1.5 text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-0.5 rounded-full border border-[#38bdf8]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              {tag || "ASSET PLACEHOLDER"}
            </span>
            <span className="text-gray-500 hidden sm:inline-block tracking-wider uppercase font-mono">
              {dimensions}
            </span>
          </div>

          {/* Center: Blueprint Icon & Title */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 my-auto">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#1e3a8a]/70 to-[#0f192e] border border-[#2563eb]/50 flex items-center justify-center text-[#38bdf8] shadow-lg shadow-[#2563eb]/20 group-hover:scale-105 group-hover:border-[#38bdf8] transition-all duration-300">
              {IconComp ? (
                <IconComp className="w-5 h-5 sm:w-5 sm:h-5 text-[#38bdf8]" />
              ) : (
                <UploadCloud className="w-5 h-5 sm:w-5 sm:h-5 text-[#38bdf8]" />
              )}
              <Sparkles
                className="w-3 h-3 text-[#38bdf8] absolute -top-1 -right-1 animate-spin"
                style={{ animationDuration: "6s" }}
              />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold font-serif text-white tracking-wide">
                {title}
              </h4>
              {subtitle && (
                <p className="text-[10px] text-gray-400 max-w-xs line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Bottom: File Upload Target Path Badge */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f192e]/90 border border-[#2563eb]/30 text-[10px] font-mono text-[#94a3b8] group-hover:border-[#38bdf8]/50 group-hover:text-white transition-colors max-w-full truncate">
              <FolderOpen className="w-3 h-3 text-[#38bdf8] shrink-0" />
              <span className="text-[#38bdf8] font-semibold">Drop in:</span>
              <span className="truncate text-gray-300 font-mono">public{guidePath}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
