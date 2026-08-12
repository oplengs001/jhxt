"use client";

import React, { useState, useRef } from "react";
import { pmbokStages } from "@/content/team";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";
import { CheckCircle, Layers, ArrowRight } from "lucide-react";

export function MethodologyWheel() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const activeStage = pmbokStages[activeStepIndex];

  useGSAP(() => {
    if (!sectionRef.current || checkReducedMotion()) return;

    gsap.from(wheelRef.current, {
      rotate: -90,
      scale: 0.85,
      opacity: 0,
      duration: 1.4,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 bg-[#060b14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            Project Delivery Standard
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
            PMBOK-Based <span className="italic text-gradient-magenta">Project Cycle</span>
          </h2>
          <p className="text-sm text-gray-400 mt-3 font-light">
            Our 6-step project execution cycle guarantees rigorous quality control, zero unexpected downtime, and transparent deliverable sign-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Circular Wheel Visualization */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              ref={wheelRef}
              className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-2 border-dashed border-white/20 p-6 flex items-center justify-center bg-radial-glow"
            >
              {/* Inner Central Hub */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#0f192e] border border-[#2563eb]/50 flex flex-col items-center justify-center text-center p-3 shadow-2xl z-20">
                <Layers className="w-6 h-6 text-[#38bdf8] mb-1" />
                <span className="text-xs font-bold text-white font-serif">PMBOK</span>
                <span className="text-[9px] text-[#94a3b8] font-mono">6 STAGES</span>
              </div>

              {/* 6 Outer Stage Nodes */}
              {pmbokStages.map((stage, idx) => {
                const angle = (idx * 360) / pmbokStages.length - 90;
                const radius = 145; // pixels
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);
                const isActive = activeStepIndex === idx;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStepIndex(idx)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all shadow-xl z-30 ${
                      isActive
                        ? "bg-[#2563eb] text-white scale-125 ring-4 ring-[#2563eb]/30 shadow-[#2563eb]/50"
                        : "bg-[#0f192e] text-gray-300 hover:bg-[#1e293b] border border-white/20 hover:scale-110"
                    }`}
                  >
                    <span>0{stage.step}</span>
                    <span className="text-[9px] font-normal truncate max-w-[48px]">
                      {stage.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Stage Inspector Card */}
          <div className="lg:col-span-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
                  Step 0{activeStage.step} of 6
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {activeStage.tagline}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-serif text-white mb-3">
                {activeStage.title} Phase
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
                {activeStage.description}
              </p>

              {/* Key Activities */}
              <div className="space-y-2 mb-6">
                <span className="text-xs uppercase font-mono tracking-wider text-gray-400 block">
                  Core Execution Activities
                </span>
                {activeStage.activities.map((act, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-200 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-[#38bdf8] shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>

              {/* Deliverable Signoff Badge */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Required Sign-Off Deliverable</span>
                  <span className="text-sm font-semibold text-[#38bdf8]">{activeStage.deliverable}</span>
                </div>
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev + 1) % pmbokStages.length)}
                  className="inline-flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-[#2563eb] px-4 py-2 rounded-full transition-colors font-medium"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
