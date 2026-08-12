"use client";

import React, { useRef } from "react";
import { teamWorkflow } from "@/content/team";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";
import { UserCheck, Headphones, Laptop, Wrench, ArrowRight, Clock, ShieldCheck } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  Headphones,
  Laptop,
  Wrench,
};

export function KeyPeopleFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || checkReducedMotion()) return;

    const cards = containerRef.current.querySelectorAll(".team-node-card");
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 bg-[#0a0610] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            Support Hierarchy
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
            Key People & <span className="italic text-gradient-magenta">Operational Model</span>
          </h2>
          <p className="text-sm text-gray-400 mt-3 font-light">
            From initial incident discovery to onsite engineering resolution. Our 4-stage escalation pipeline ensures rapid SLA resolution.
          </p>
        </div>

        {/* 4-Node Sequential Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamWorkflow.map((node, i) => {
            const IconComp = iconMap[node.icon] || ShieldCheck;
            return (
              <div
                key={node.id}
                className="team-node-card glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 relative flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3a2145] to-[#191024] border border-[#d92662]/40 flex items-center justify-center text-[#d92662] shadow-lg">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      Node 0{node.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-white mb-1">
                    {node.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#38bdf8] block mb-3">
                    {node.role}
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                    {node.description}
                  </p>

                  {/* Core Responsibilities */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-mono uppercase text-gray-500 block mb-1">
                      Responsibilities
                    </span>
                    {node.responsibilities.map((resp, idx) => (
                      <div key={idx} className="text-[11px] text-gray-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d92662] mt-1 shrink-0" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLA Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#d92662] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{node.sla}</span>
                  </div>
                  {i < teamWorkflow.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-gray-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
