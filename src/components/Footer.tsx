"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { services } from "@/content/services";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/invoices")) {
    return null;
  }
  return (
    <footer className="bg-[#03060c] border-t border-white/10 pt-16 pb-12 relative overflow-hidden text-gray-400 text-sm">
      {/* Glow ambient background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-t from-[#1e3a8a]/20 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand Pitch */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-[#2563eb]/40 shadow-md shadow-[#2563eb]/20">
                <Image
                  src="/icon.jpg"
                  alt="JHXTES Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold tracking-wider font-serif text-white">
                JHXTES <span className="text-[#38bdf8]">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Your end-to-end digital transformation partner. Empowering enterprises, commercial outlets, and municipal local governments with surveillance, structured cabling, IP networking, AI vision, and 24/7 managed IT services.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" /> Founded 2024
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb]" /> DBOT Framework
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#06b6d4]" /> PMBOK Methodology
              </span>
            </div>
          </div>

          {/* Column 2: Core Pillars (Part 1) */}
          <div className="space-y-3">
            <h4 className="text-white font-serif text-base font-semibold border-b border-white/10 pb-2">
              Security & AI
            </h4>
            <ul className="space-y-2 text-xs">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1 group"
                  >
                    <span>{service.shortTitle}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#38bdf8] transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Pillars (Part 2) */}
          <div className="space-y-3">
            <h4 className="text-white font-serif text-base font-semibold border-b border-white/10 pb-2">
              Infrastructure & Access
            </h4>
            <ul className="space-y-2 text-xs">
              {services.slice(6, 13).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1 group"
                  >
                    <span>{service.shortTitle}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#38bdf8] transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-serif text-base font-semibold border-b border-white/10 pb-2">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>Central Luzon & Metro Manila Operational Centers, Philippines</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2563eb] shrink-0" />
                <span>+63 (045) 900-JHXTES / +63 917-123-JHXTES</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#06b6d4] shrink-0" />
                <span>info@jhxt-itsolutions.ph</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block w-full text-center py-2 px-3 rounded-lg bg-white/5 hover:bg-[#2563eb] border border-white/10 hover:border-[#2563eb] text-xs text-white transition-colors font-medium"
              >
                24/7 SLA Help Desk Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} JHXTES Information Technology Solutions. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              About
            </Link>
            <Link href="/services" className="hover:text-gray-300 transition-colors">
              13 Pillars
            </Link>
            <Link href="/projects" className="hover:text-gray-300 transition-colors">
              Case Studies
            </Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
