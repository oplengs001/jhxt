import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/content/services";
import { DiagonalLines } from "@/components/DiagonalLines";
import {
  Camera,
  Cable,
  Network,
  PhoneCall,
  Lock,
  BrainCircuit,
  Flame,
  ShieldCheck,
  Construction,
  Scan,
  Footprints,
  DoorClosed,
  Headphones,
  CheckCircle2,
  ChevronLeft,
  Phone
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Cable,
  Network,
  PhoneCall,
  Lock,
  BrainCircuit,
  Flame,
  ShieldCheck,
  Construction,
  Scan,
  Footprints,
  DoorClosed,
  Headphones,
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found — JHXTES" };
  return {
    title: `${service.title} — JHXTES IT Solutions`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const IconComp = iconMap[service.iconName] || ShieldCheck;

  return (
    <div className="pt-28 pb-20 bg-[#060b14] min-h-screen text-gray-200">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to 13 Service Pillars
        </Link>
      </div>

      {/* Header Banner - Split Layout (Icon left, Content right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <DiagonalLines variant="hero" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Icon Badge Column */}
            <div className="lg:col-span-3 flex flex-col items-start lg:items-center text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-[#0f192e] to-[#060b14] border border-[#2563eb]/50 flex items-center justify-center text-[#38bdf8] shadow-2xl shadow-[#2563eb]/20 mb-4">
                <IconComp className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
              {service.badge && (
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
                  {service.badge}
                </span>
              )}
            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-9 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
                {service.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white text-xs font-semibold shadow-lg shadow-[#2563eb]/30 hover:scale-105 transition-all"
                >
                  <Phone className="w-4 h-4" /> Request Quote for {service.shortTitle}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Key Features & Bullet Scope */}
          <div className="lg:col-span-7 space-y-8">
            {/* Scope of Deliverables */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold font-serif text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#38bdf8]" /> Scope of Deliverables & Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.bullets.map((bullet, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-xs text-gray-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Feature Cards */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold font-serif text-white mb-6 border-b border-white/10 pb-3">
                Engineering Highlights & Capabilities
              </h3>
              <div className="space-y-4">
                {service.keyFeatures.map((feat, i) => (
                  <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <h4 className="text-base font-bold font-serif text-[#38bdf8] mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Applications & Technical Specs */}
          <div className="lg:col-span-5 space-y-8">
            {/* Target Application Sector */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold font-serif text-white mb-4 border-b border-white/10 pb-3">
                Industry Applications
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.applications.map((app, i) => (
                  <span
                    key={i}
                    className="text-xs text-gray-200 bg-[#1e3a8a]/60 border border-white/10 px-3 py-1.5 rounded-full"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Specifications Table */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold font-serif text-white mb-4 border-b border-white/10 pb-3">
                Technical Specifications
              </h3>
              <div className="divide-y divide-white/10">
                {service.specs.map((spec, i) => (
                  <div key={i} className="py-3 flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-mono">{spec.label}</span>
                    <span className="font-semibold text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick CTA Box */}
            <div className="glass-panel p-8 rounded-3xl border border-[#2563eb]/30 bg-gradient-to-br from-[#1e3a8a]/80 to-[#0f192e] text-center space-y-4">
              <h4 className="text-lg font-bold font-serif text-white">Need Custom Engineering Specs?</h4>
              <p className="text-xs text-gray-300 font-light">
                Our technical team will draft a full bill of materials and CAD layout for your site.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full py-3 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs transition-colors shadow-lg shadow-[#2563eb]/30"
              >
                Contact Technical Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
