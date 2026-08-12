"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";

interface DiagonalLinesProps {
  className?: string;
  variant?: "hero" | "divider" | "card";
  color?: string;
}

export function DiagonalLines({
  className = "",
  variant = "hero",
  color = "rgba(148, 163, 184, 0.25)"
}: DiagonalLinesProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!containerRef.current || checkReducedMotion()) return;

    const paths = containerRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      if (variant === "hero") {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.out",
          delay: 0.3,
        });
      } else {
        gsap.to(path, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 40%",
            scrub: 0.8,
          },
        });
      }
    });
  }, { scope: containerRef });

  if (variant === "hero") {
    return (
      <svg
        ref={containerRef}
        className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <path
          d="M -100 200 L 1540 700"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M -100 240 L 1540 740"
          stroke="rgba(37, 99, 235, 0.35)"
          strokeWidth="1"
        />
        <path
          d="M 1200 -50 L 300 950"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M 1240 -50 L 340 950"
          stroke="rgba(56, 189, 248, 0.3)"
          strokeWidth="0.75"
        />
      </svg>
    );
  }

  return (
    <svg
      ref={containerRef}
      className={`w-full h-16 pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 60"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M 0 30 L 1200 30"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M 150 10 L 450 50 M 750 10 L 1050 50"
        stroke="rgba(37, 99, 235, 0.4)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
