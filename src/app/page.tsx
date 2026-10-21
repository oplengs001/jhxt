"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { FrameworkStrip } from "@/components/FrameworkStrip";
import { ProjectCard } from "@/components/ProjectCard";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";
import { ArrowRight, PhoneCall, Layers, ShieldCheck, Cpu } from "lucide-react";
import { TechPlaceholder } from "@/components/TechPlaceholder";
import { HomeClientRegistration } from "@/components/HomeClientRegistration";

export default function Home() {
  const serviceGridRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showAllPillars, setShowAllPillars] = useState<boolean>(true);

  const categories = [
    { id: "ALL", label: "All 13 Pillars", count: 13 },
    { id: "SECURITY", label: "CCTV & Security", slugs: ["surveillance-solutions", "cctv-ai-technology", "electronic-door-lock"] },
    { id: "INFRASTRUCTURE", label: "Cabling & Networks", slugs: ["cabling-solutions", "network-solution", "telephony-solution"] },
    { id: "PERIMETER", label: "Access & Gates", slugs: ["access-control", "parking-boom-barrier", "turnstile", "walkthrough-metal-detector", "xray-baggage-scanner"] },
    { id: "MANAGED", label: "Managed IT & Safety", slugs: ["managed-services", "fire-detection-alarm"] },
  ];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === "ALL") return true;
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat?.slugs?.includes(s.slug);
  });

  const displayedServices = showAllPillars || selectedCategory !== "ALL" 
    ? filteredServices 
    : filteredServices.slice(0, 6);

  useGSAP(() => {
    if (!serviceGridRef.current || checkReducedMotion()) return;

    const cards = serviceGridRef.current.querySelectorAll(".service-card");
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    }
  }, { scope: serviceGridRef, dependencies: [selectedCategory, showAllPillars] });

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. 13 Core Service Pillars Section with Filters & Image Placeholders */}
      <section className="py-20 bg-[#060b14] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
                Full-Spectrum Portfolio
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
                13 Core <span className="italic text-gradient-magenta">Service Pillars</span>
              </h2>
              <p className="text-sm text-gray-400 mt-3 font-light max-w-2xl">
                Engineered for resilience, high bandwidth, and 24/7 reliability. Each pillar includes full technical specs, CAD designs, and image galleries.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-[#2563eb] border border-white/10 hover:border-[#2563eb] text-sm text-white font-medium transition-colors shrink-0"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/10 pb-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/30 border border-[#2563eb]"
                      : "bg-[#0f192e] text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Staggered Service Card Grid with Rectangle Image Placeholders */}
          <div ref={serviceGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>

          {/* Toggle View All / Show Less button */}
          {selectedCategory === "ALL" && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setShowAllPillars(!showAllPillars)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-[#2563eb] border border-white/10 hover:border-[#2563eb] text-xs font-mono uppercase tracking-wider text-gray-200 hover:text-white transition-all cursor-pointer shadow-lg"
              >
                <Layers className="w-4 h-4" />
                {showAllPillars ? "Showing All 13 Pillars (Click to Collapse)" : "+ Show All 13 Pillars"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. 🖼️ Enterprise Architecture Infographics Showcase */}
      <section className="py-20 bg-[#040810] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
              Technical Schematics & Blueprints
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
              Enterprise <span className="italic text-gradient-magenta">Architecture Infographics</span>
            </h2>
            <p className="text-sm text-gray-400 mt-3 font-light">
              Visual schematics mapping out our end-to-end IT lifecycle methodology and converged security ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Infographic 1: DBOT Lifecycle Diagram Placeholder */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/30 text-[#38bdf8]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">DBOT Lifecycle Flowchart</h3>
                    <p className="text-[11px] text-gray-400 font-mono">Design → Build → Operate → Transfer</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded border border-[#38bdf8]/20">
                  INFOGRAPHIC 01
                </span>
              </div>

              <TechPlaceholder
                guidePath="/infographics/dbot-lifecycle.jpg"
                title="DBOT Methodology Blueprint"
                subtitle="Upload high-res diagram showing the 4 lifecycle execution phases."
                icon={ShieldCheck}
                ratio="16:9"
                dimensions="1200 × 600 px"
                tag="METHODOLOGY BLUEPRINT"
              />
            </div>

            {/* Infographic 2: Converged IT & Security Topology Placeholder */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#06b6d4]/20 border border-[#06b6d4]/30 text-[#38bdf8]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">Converged IT Topology Map</h3>
                    <p className="text-[11px] text-gray-400 font-mono">CCTV • Fiber LAN • AI Vision • Cloud SLA</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded border border-[#38bdf8]/20">
                  INFOGRAPHIC 02
                </span>
              </div>

              <TechPlaceholder
                guidePath="/infographics/system-architecture.jpg"
                title="Converged Security & IT Topology"
                subtitle="Upload network schematic connecting core switches, NVR, AI cameras, and gates."
                icon={Cpu}
                ratio="16:9"
                dimensions="1200 × 600 px"
                tag="TOPOLOGY BLUEPRINT"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. DBOT Framework Horizontal Strip */}
      <FrameworkStrip />

      {/* 5. Proof of Work / Featured Case Studies */}
      <section className="py-20 bg-[#060b14] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
              Verified Deployments
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
              Proof of Work <span className="italic text-gradient-magenta">& Case Studies</span>
            </h2>
            <p className="text-sm text-gray-400 mt-3 font-light">
              Real-world municipal command centers, barangay public safety networks, and commercial store installations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/5 hover:bg-[#38bdf8] border border-white/10 hover:border-[#38bdf8] text-sm text-white font-semibold transition-colors"
            >
              Explore Project Documentation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Client Onboarding & Registration */}
      <HomeClientRegistration />

      {/* 7. Call-To-Action Banner */}
      <section className="py-20 bg-gradient-to-r from-[#0f192e] via-[#1e3a8a] to-[#0f192e] relative overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8]">
            Ready to Upgrade Your Infrastructure?
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-3">
            Schedule a Free Site Survey & Engineering Assessment
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            Our certified engineers will analyze your cabling, surveillance, or network bottleneck and deliver a detailed DBOT proposal within 48 hours.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-sm shadow-xl shadow-[#2563eb]/30 hover:scale-105 transition-all"
            >
              <PhoneCall className="w-4 h-4" /> Get Your Custom Quote
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all"
            >
              Learn About JHXTES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
