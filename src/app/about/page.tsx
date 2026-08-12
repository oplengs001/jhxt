import React from "react";
import Metadata from "next";
import { FrameworkStrip } from "@/components/FrameworkStrip";
import { MethodologyWheel } from "@/components/MethodologyWheel";
import { KeyPeopleFlow } from "@/components/KeyPeopleFlow";
import { DiagonalLines } from "@/components/DiagonalLines";
import { ShieldCheck, Award, Target, Users, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About JHXT — Framework, Methodology & Team Structure",
  description: "Learn about JHXT Information Technology Solutions, our DBOT lifecycle framework, PMBOK project execution cycle, and 4-tier support team model.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 space-y-0">
      {/* About Hero Header */}
      <section className="relative py-16 bg-[#0e0914] overflow-hidden border-b border-white/10">
        <DiagonalLines variant="hero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#d92662] bg-[#d92662]/10 px-3 py-1 rounded-full border border-[#d92662]/20">
            Who is JHXT
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-white mt-4">
            Digital Transformation <br />
            <span className="italic text-gradient-magenta">Technology Partner</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Founded in 2024, JHXT is an end-to-end information technology solutions provider delivering high-performance software, physical security systems, structured cabling, IP networking, and managed IT services across the Philippines.
          </p>
        </div>
      </section>

      {/* Core Company Values & Stats */}
      <section className="py-20 bg-[#0a0610]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#d92662]/20 border border-[#d92662]/30 text-[#d92662] flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">Our Core Mission</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                To bridge complex IT hardware and intelligent software systems into dependable, secure, and easily managed digital infrastructure for commercial and public sector enterprises.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#8b5cf6] flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">Standardization</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                We strictly enforce TIA/EIA cabling rules, NFPA fire standards, UL10C door security compliance, and PMBOK project management guidelines on every deployment.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-2">Service Guarantee</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                Backed by a multi-tiered help desk, remote L2/L3 engineers, and onsite emergency dispatch teams committed to guaranteed SLA response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DBOT Framework Section */}
      <FrameworkStrip />

      {/* PMBOK Methodology Section */}
      <MethodologyWheel />

      {/* Key People / Team Support Model */}
      <KeyPeopleFlow />
    </div>
  );
}
