"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { FrameworkStrip } from "@/components/FrameworkStrip";
import { ProjectCard } from "@/components/ProjectCard";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { useGSAP } from "@gsap/react";
import { gsap, checkReducedMotion } from "@/lib/gsap";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function Home() {
  const serviceGridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!serviceGridRef.current || checkReducedMotion()) return;

    const cards = serviceGridRef.current.querySelectorAll(".service-card");
    gsap.from(cards, {
      opacity: 0,
      y: 30,
      stagger: 0.06,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: serviceGridRef.current,
        start: "top 80%",
      },
    });
  }, { scope: serviceGridRef });

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Company Pitch & Core Pillars Teaser */}
      <section className="py-20 bg-[#060b14] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
                Full-Spectrum Portfolio
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mt-4">
                13 Core <span className="italic text-gradient-magenta">Service Pillars</span>
              </h2>
              <p className="text-sm text-gray-400 mt-3 font-light max-w-2xl">
                Engineered for resilience, high bandwidth, and 24/7 reliability. From physical CCTV hardware and structured cabling to AI computer vision and managed IT support.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-[#2563eb] border border-white/10 hover:border-[#2563eb] text-sm text-white font-medium transition-colors shrink-0"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Staggered Service Card Grid */}
          <div ref={serviceGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:text-white transition-colors"
            >
              + 7 More Service Pillars (Access Control, Boom Barriers, X-Ray, FDAS, Turnstiles) →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. DBOT Framework Horizontal Strip */}
      <FrameworkStrip />

      {/* 4. Proof of Work / Featured Case Studies */}
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

      {/* 5. Call-To-Action Banner */}
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
