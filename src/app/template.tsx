"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || checkReducedMotion()) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return <div ref={containerRef}>{children}</div>;
}
