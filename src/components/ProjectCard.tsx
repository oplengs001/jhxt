"use client";

import React from "react";
import { CaseStudy } from "@/lib/types";
import { MapPin, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: CaseStudy;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between group h-full">
      <div>
        {/* Category & Location Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-semibold text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            {project.category}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
              {project.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
              {project.year}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold font-serif text-white group-hover:text-gradient-magenta transition-colors mb-3">
          {project.title}
        </h3>

        {/* Highlight Callout */}
        <p className="text-xs text-[#94a3b8] italic mb-4 border-l-2 border-[#2563eb] pl-3 py-0.5">
          "{project.highlightText}"
        </p>

        {/* Summary */}
        <p className="text-xs text-gray-300 leading-relaxed mb-6 font-light">
          {project.summary}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
          {project.metrics.map((metric, i) => (
            <div key={i}>
              <div className="text-lg font-bold font-serif text-white">{metric.value}</div>
              <div className="text-[10px] text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Deliverables */}
        <div className="space-y-2 mb-6">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
            Scope & Infrastructure Delivered
          </span>
          {project.deliverables.map((deliv, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
              <span>{deliv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {project.mapCoordinates && (
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>GPS Coordinates: {project.mapCoordinates}</span>
          <span className="text-[#38bdf8] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
            Verified Site <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}
    </div>
  );
}
