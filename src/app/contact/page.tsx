"use client";

import React, { useState } from "react";
import { DiagonalLines } from "@/components/DiagonalLines";
import { services } from "@/content/services";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceCategory: services[0].title,
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: data.message });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          serviceCategory: services[0].title,
          message: "",
        });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Something went wrong." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#0e0914] min-h-screen space-y-12 text-gray-200">
      {/* Header Banner */}
      <section className="relative py-12 bg-[#100a18] border-b border-white/10">
        <DiagonalLines variant="hero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#d92662] bg-[#d92662]/10 px-3 py-1 rounded-full border border-[#d92662]/20">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-white mt-4">
            Contact Us & <span className="italic text-gradient-magenta">Request a Quote</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light">
            Have a project in mind or need emergency technical SLA support? Speak directly with our lead engineering team.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Form + Company Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-bold font-serif text-white mb-2">
                Engineering Quote Request Form
              </h2>
              <p className="text-xs text-gray-400 mb-8 font-light">
                Fill out the details below and our team will prepare a formal bill of materials within 24-48 hours.
              </p>

              {statusMessage && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 ${
                    statusMessage.type === "success"
                      ? "bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981]"
                      : "bg-[#d92662]/20 border border-[#d92662]/40 text-[#d92662]"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Juan Dela Cruz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#191024] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d92662]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="juan@company.ph"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#191024] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d92662]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+63 917 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#191024] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d92662]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corporation / LGU"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#191024] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d92662]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Primary Service Pillar Needed
                  </label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    className="w-full bg-[#191024] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d92662] cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.slug} value={s.title} className="bg-[#191024] text-white">
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Project Details & Site Notes *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your site location, camera count, cabling distance, or SLA requirement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#191024] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d92662]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d92662] to-[#8b5cf6] text-white font-semibold text-sm shadow-xl shadow-[#d92662]/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Quote Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-xl font-bold font-serif text-white border-b border-white/10 pb-3">
                Company Headquarters
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#d92662]/20 border border-[#d92662]/30 text-[#d92662] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Operating Hubs</span>
                    <span className="text-gray-300">Tarlac City, Central Luzon & Metro Manila Operational Facilities, Philippines</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#8b5cf6] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Phone Lines</span>
                    <span className="text-gray-300">+63 (045) 900-JHXT / +63 917-123-JHXT</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-[#38bdf8] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Email Enquiries</span>
                    <span className="text-gray-300">info@jhxt-itsolutions.ph</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">24/7 SLA Help Desk</span>
                    <span className="text-gray-300">Round-the-clock remote hotline for contracted SLA accounts.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Map / Command Center Card */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#3a2145]/60 to-[#191024] space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#38bdf8] tracking-widest block">Deployment Zone</span>
              <h4 className="text-lg font-bold font-serif text-white">Central Luzon Operations Base</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Our field technical team provides rapid response within 2 hours across Tarlac, Pampanga, Bulacan, Nueva Ecija, and Metro Manila.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
