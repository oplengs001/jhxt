"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Truck,
  Sparkles
} from "lucide-react";

export function HomeClientRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredClient, setRegisteredClient] = useState<{
    id: string;
    name: string;
    company: string | null;
    email: string | null;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Contact or Representative name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register client");
      }

      setRegisteredClient(data.client);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register-client" className="py-24 bg-[#050912] relative border-b border-white/10 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context & Perks */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Client Onboarding Portal
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight">
              Register as a <span className="text-gradient-magenta italic">Corporate Client</span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              Add your enterprise details to immediately streamline project turnovers, official Warranty Certificates with serial registers, itemized Delivery Notes, and DBOT Performa Invoices.
            </p>

            {/* Quick Benefits List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Hardware Warranty Certificates</h4>
                  <p className="text-xs text-gray-400">1-Year standard coverage backed with indexed camera, HDD & NVR serial tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <Truck className="w-5 h-5 text-[#06b6d4] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Official Equipment Turnover Slips</h4>
                  <p className="text-xs text-gray-400">Comprehensive delivery notes and completion forms ready for corporate sign-off.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <FileText className="w-5 h-5 text-[#60a5fa] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Automated Performa Invoices & POs</h4>
                  <p className="text-xs text-gray-400">Multi-line technical item specs with real-time tax breakdown and digital export.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-[#091122]/80 backdrop-blur-xl">
              
              {registeredClient ? (
                /* Success View */
                <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-serif text-white">Client Successfully Registered!</h3>
                    <p className="text-sm text-gray-300 max-w-md mx-auto">
                      <strong className="text-white">{registeredClient.name}</strong> 
                      {registeredClient.company && <span> from <strong className="text-sky-300">{registeredClient.company}</strong></span>} is now saved in the JHXT portal.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Client ID:</span>
                      <span className="text-gray-200">{registeredClient.id.slice(0, 13)}...</span>
                    </div>
                    {registeredClient.email && (
                      <div className="flex justify-between text-gray-400">
                        <span>Email:</span>
                        <span className="text-gray-200">{registeredClient.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-semibold">Active in Directory</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                      href={`/invoices/clients?id=${registeredClient.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white text-xs font-semibold shadow-lg shadow-[#2563eb]/25 hover:opacity-95 transition-all"
                    >
                      <span>Open in Client Hub & Generate Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setRegisteredClient(null)}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
                    >
                      + Register Another Client
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold font-serif text-white">Add New Client Account</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Enter company and contact details below. You can immediately generate documents for this client afterwards.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Representative Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                        Client / Contact Person Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alvin Lizada / Authorized Representative"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white text-sm outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                        Company / Organization Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Wilmar Edible Oils Philippines Inc."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white text-sm outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white text-sm outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#38bdf8]" />
                        Phone / Mobile
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="09602506456"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white text-sm outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>

                    {/* Office / Site Address */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                        Site / Delivery Address
                      </label>
                      <textarea
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="12th Floor, LKG Tower, 6801 Ayala Ave, Makati City"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white text-sm outline-none transition-all placeholder:text-gray-500 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-400">
                      * Required field. Clients appear instantly in the portal directory.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white text-sm font-semibold shadow-xl shadow-[#2563eb]/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering Client...</span>
                        </>
                      ) : (
                        <>
                          <span>Add Client to Directory</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
