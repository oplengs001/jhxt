"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";
import { frameworkStages } from "@/content/team";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function FrameworkStrip() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || checkReducedMotion()) return;

    const stages = containerRef.current.querySelectorAll(".framework-node");
    const progressLine = containerRef.current.querySelector(".progress-line-inner");

    if (progressLine) {
      gsap.fromTo(
        progressLine,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 0.8,
          },
        }
      );
    }

    gsap.from(stages, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 relative overflow-hidden bg-[#040810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            Lifecycle Engineering Model
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
            The JHXTES <span className="italic text-gradient-magenta">DBOT Framework</span>
          </h2>
          <p className="text-sm text-gray-400 mt-3 font-light">
            Design → Build → Operate → Transfer. Our end-to-end methodology guarantees accountability from initial blueprinting to post-handover ownership.
          </p>
        </div>

        {/* Horizontal Progress Timeline */}
        <div className="relative">
          {/* Progress Bar Track */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-white/10 -z-0">
            <div className="progress-line-inner h-full bg-gradient-to-r from-[#2563eb] via-[#0284c7] to-[#38bdf8] origin-left scale-x-0 transition-transform" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {frameworkStages.map((stage, i) => (
              <div
                key={stage.id}
                className="framework-node glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 relative flex flex-col justify-between"
              >
                <div>
                  {/* Big Letter Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-lg shadow-[#2563eb]/20">
                      {stage.letter}
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                      Stage 0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-white mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#38bdf8] mb-3">
                    {stage.subtitle}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                    {stage.description}
                  </p>
                </div>

                {/* Key Outcomes List */}
                <div className="pt-4 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 block mb-2">
                    Key Outcomes
                  </span>
                  {stage.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>

                {/* Connecting Arrow for Large Screens */}
                {i < frameworkStages.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#0f192e] border border-white/20 items-center justify-center text-[#38bdf8] z-20 shadow-md">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
