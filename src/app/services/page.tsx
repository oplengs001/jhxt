"use client";

import React, { useState } from "react";
import { services } from "@/content/services";
import { ServiceCard } from "@/components/ServiceCard";
import { DiagonalLines } from "@/components/DiagonalLines";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("all");

  const badges = [
    "all",
    "Enterprise Security",
    "Infrastructure Backbone",
    "High-Speed Connectivity",
    "Voice & Contact Center",
    "Smart Access Control",
    "Intelligent Video",
    "Life Safety",
    "Perimeter Security",
    "Traffic Management",
    "Inspection Tech",
    "Personal Security",
    "Crowd Control",
    "24/7 Outsourcing",
  ];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bullets.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBadge =
      selectedBadge === "all" || s.badge?.toLowerCase() === selectedBadge.toLowerCase();

    return matchesSearch && matchesBadge;
  });

  return (
    <div className="pt-28 pb-20 space-y-12 bg-[#060b14] min-h-screen">
      {/* Header Banner */}
      <section className="relative py-12 bg-[#0a1120] border-b border-white/10">
        <DiagonalLines variant="hero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            Comprehensive Solutions Catalog
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-white mt-4">
            13 Core <span className="italic text-gradient-magenta">Service Pillars</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light">
            Explore our end-to-end hardware, cabling, networking, AI vision, life safety, and 24/7 managed IT services.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. CCTV, Fiber, AI, Gate, FDAS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f192e] border border-white/15 rounded-full pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div className="relative">
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                className="w-full sm:w-auto bg-[#0f192e] border border-white/15 rounded-full px-5 py-3 text-sm text-gray-200 focus:outline-none focus:border-[#2563eb] cursor-pointer appearance-none pr-10"
              >
                {badges.map((b) => (
                  <option key={b} value={b} className="bg-[#0f192e] text-white">
                    {b === "all" ? "All Categories" : b}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No service pillars found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedBadge("all");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#2563eb] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
