"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Cpu, Radio, Network } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";
import { DiagonalLines } from "@/components/DiagonalLines";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || checkReducedMotion()) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.4"
      )
      .fromTo(
        paragraphRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-[#0e0914]"
    >
      {/* Background Radial Glow & Diagonal Hairline Motif */}
      <div className="absolute inset-0 bg-radial-glow opacity-80 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-radial-top opacity-50 pointer-events-none" />
      <DiagonalLines variant="hero" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div ref={badgeRef} className="inline-block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191024]/90 border border-[#d92662]/40 text-xs font-semibold tracking-wide text-gray-200 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d92662] animate-ping" />
            <span className="text-[#d92662] uppercase tracking-widest font-mono">Founded 2024</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">Digital Transformation Partner</span>
          </div>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight text-white max-w-5xl mx-auto leading-[1.15]"
        >
          Architecting Enterprise <br className="hidden sm:inline" />
          <span className="italic text-gradient-magenta font-normal">IT & Security Infrastructure</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={paragraphRef}
          className="mt-6 text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
        >
          From <span className="text-white font-medium">Surveillance Solutions</span> & AI Analytics to{" "}
          <span className="text-white font-medium">Structured Cabling</span>, Wireless Networks, and 24/7 Managed IT Services — powered by our certified <span className="text-[#d92662] font-semibold">DBOT Framework</span>.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#d92662] to-[#8b5cf6] text-white font-semibold text-sm shadow-xl shadow-[#d92662]/30 hover:scale-105 transition-all"
          >
            Explore 13 Service Pillars
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#191024] hover:bg-[#2d193a] border border-white/15 text-white font-semibold text-sm transition-all"
          >
            Request Engineering Quote
          </Link>
        </div>

        {/* Hero Highlights Pill Grid */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
        >
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d92662]/20 border border-[#d92662]/30 text-[#d92662]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-serif">13 Pillars</div>
              <div className="text-[11px] text-gray-400">Complete Hardware & Software</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#8b5cf6]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-serif">AI Vision</div>
              <div className="text-[11px] text-gray-400">ANPR, Thermal & People Count</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#38bdf8]">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-serif">DBOT Framework</div>
              <div className="text-[11px] text-gray-400">Design → Build → Operate → Transfer</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-serif">24/7 SLA Desk</div>
              <div className="text-[11px] text-gray-400">Help Desk & Onsite Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
