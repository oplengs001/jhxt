import React from "react";
import Link from "next/link";
import { DiagonalLines } from "@/components/DiagonalLines";
import { KeyPeopleFlow } from "@/components/KeyPeopleFlow";
import {
  Wrench,
  CloudUpload,
  UserCheck,
  Globe,
  Headphones,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export const metadata = {
  title: "Managed IT Services & Outsourcing — JHXT",
  description: "Computer repair, server maintenance, backup & recovery, website development, onsite technician support, and 24/7 SLA help desk agreements.",
};

export default function ManagedServicesPage() {
  const managedPillars = [
    {
      icon: Wrench,
      title: "Computer & Hardware Repair",
      desc: "Component-level repair and preventative maintenance for desktop PCs, laptops, network switches, NVR recorders, and servers.",
    },
    {
      icon: CloudUpload,
      title: "Backup & Disaster Recovery",
      desc: "Automated local NAS mirroring and cloud backup solutions ensuring zero data loss and fast system restoration during cyber threats.",
    },
    {
      icon: UserCheck,
      title: "Full IT Outsourcing",
      desc: "Dedicated remote and onsite IT engineering team acting as your internal IT department at a fraction of full-time staff cost.",
    },
    {
      icon: Globe,
      title: "Website Dev & Maintenance",
      desc: "Custom web development, high-speed hosting, domain administration, SSL security, and continuous content & bug updates.",
    },
    {
      icon: Headphones,
      title: "24/7 Remote & Onsite Support",
      desc: "Multi-channel help desk with under 15-minute response times and guaranteed onsite technician dispatch for critical faults.",
    },
    {
      icon: FileCheck,
      title: "Maintenance Agreements (SLA)",
      desc: "Tailored monthly/annual IT SLA contracts covering hardware replacement warranties, scheduled checkups, and priority response.",
    },
  ];

  const slaPlans = [
    {
      name: "Essential Support SLA",
      target: "Small Businesses & Retail Outlets",
      response: "< 30 Mins Remote Desk",
      onsite: "Next Business Day",
      features: [
        "Business Hours Help Desk (8 AM - 6 PM)",
        "Quarterly Preventative Maintenance",
        "Anti-Virus & OS Security Patching",
        "Monthly Health Status Report"
      ],
      recommended: false
    },
    {
      name: "Enterprise SLA",
      target: "Corporate Headquarters & Mission-Critical",
      response: "< 15 Mins Immediate Triage",
      onsite: "< 2 Hours Emergency Dispatch",
      features: [
        "24/7/365 Uninterrupted Help Desk Access",
        "Dedicated Account Lead Engineer",
        "Automated Cloud Backup Mirroring",
        "Spare Unit Loaner Hardware Included",
        "Monthly Security & Penetration Audit"
      ],
      recommended: true
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#0e0914] min-h-screen space-y-16 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-12 bg-[#100a18] border-b border-white/10">
        <DiagonalLines variant="hero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
            24/7 Operational SLA
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-white mt-4">
            Managed IT <span className="italic text-gradient-magenta">Services & Support</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light">
            Keep your IT ecosystem running continuously without hiring expensive full-time in-house engineering staff.
          </p>
        </div>
      </section>

      {/* 6 Core Managed Service Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-serif text-white">
            Comprehensive Managed Services Portfolio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managedPillars.map((item, i) => {
            const IconComp = item.icon;
            return (
              <div key={i} className="glass-panel glass-panel-hover p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3a2145] to-[#191024] border border-[#d92662]/40 flex items-center justify-center text-[#d92662]">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white">{item.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SLA Tiers Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#d92662]">
            Guaranteed Response Times
          </span>
          <h2 className="text-3xl font-bold font-serif text-white mt-2">
            Service Level Agreements (SLA)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {slaPlans.map((plan, i) => (
            <div
              key={i}
              className={`glass-panel p-8 rounded-3xl border relative flex flex-col justify-between ${
                plan.recommended
                  ? "border-[#d92662] bg-gradient-to-br from-[#3a2145]/80 to-[#191024]"
                  : "border-white/10"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 right-6 text-[10px] font-bold font-mono uppercase bg-[#d92662] text-white px-3 py-1 rounded-full shadow-lg">
                  Most Popular Choice
                </span>
              )}

              <div>
                <h3 className="text-2xl font-bold font-serif text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-[#38bdf8] mb-6">{plan.target}</p>

                <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono">Remote Help Desk Response</span>
                    <span className="font-bold text-[#d92662]">{plan.response}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-mono">Onsite Field Response</span>
                    <span className="font-bold text-[#8b5cf6]">{plan.onsite}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-2">Included Coverage</span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className={`w-full py-3 rounded-full font-semibold text-xs text-center transition-colors shadow-lg ${
                  plan.recommended
                    ? "bg-[#d92662] hover:bg-[#b01c4d] text-white shadow-[#d92662]/30"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                Inquire About {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Support Team Workflow Flow */}
      <KeyPeopleFlow />
    </div>
  );
}
