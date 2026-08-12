"use client";

import React from "react";
import Link from "next/link";
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
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { ServicePillar } from "@/lib/types";

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

interface ServiceCardProps {
  service: ServicePillar;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName] || ShieldCheck;

  return (
    <div className="service-card glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Background Subtle Gradient Accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d92662]/10 rounded-full blur-2xl group-hover:bg-[#d92662]/20 transition-all pointer-events-none" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3a2145] to-[#191024] border border-[#d92662]/40 flex items-center justify-center text-[#d92662] group-hover:scale-110 transition-transform shadow-lg">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            0{index + 1}
          </span>
        </div>

        {/* Title & Badge */}
        {service.badge && (
          <span className="inline-block mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#d92662] bg-[#d92662]/10 px-2.5 py-0.5 rounded-full border border-[#d92662]/20">
            {service.badge}
          </span>
        )}
        <h3 className="text-xl font-bold font-serif text-white group-hover:text-gradient-magenta transition-colors mb-2">
          {service.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          {service.summary}
        </p>

        {/* Bullet List (pill-shaped rows from deck) */}
        <ul className="space-y-1.5 mb-6">
          {service.bullets.slice(0, 4).map((bullet, i) => (
            <li
              key={i}
              className="text-[11px] text-gray-300 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d92662] shrink-0" />
              <span className="truncate">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#8fa7b3] group-hover:text-white transition-colors">
        <span>Explore Specifications</span>
        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#d92662] flex items-center justify-center transition-colors">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Full Card Link overlay */}
      <Link href={`/services/${service.slug}`} className="absolute inset-0 z-10" aria-label={service.title} />
    </div>
  );
}
