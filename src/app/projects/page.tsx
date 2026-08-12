import React from "react";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { DiagonalLines } from "@/components/DiagonalLines";
import { MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Projects & Proof of Work — JHXT Case Studies",
  description: "Explore real-world IT and security deployments by JHXT: Tarlac City Command Center, Barangay CCTV Networks, and Commercial Store installations.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-28 pb-20 bg-[#0e0914] min-h-screen space-y-12">
      {/* Header Banner */}
      <section className="relative py-12 bg-[#100a18] border-b border-white/10">
        <DiagonalLines variant="hero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            Case Studies & Proof of Work
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-white mt-4">
            Deployed Infrastructure <span className="italic text-gradient-magenta">Projects</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light">
            Proven track record in municipal public safety command centers, local barangay outdoor CCTV deployments, and multi-branch retail store setups.
          </p>
        </div>
      </section>

      {/* Projects Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
