"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Printer,
  Calendar,
  Building,
  CheckCircle,
  FileText,
  Cpu,
  Layers,
} from "lucide-react";

export default function WarrantyCertificatesListPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/documents/warranty?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error("Failed to load warranty certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-400" /> Warranty Certificates & Completion Notes
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Official hardware supply warranty certificates, turnover completion forms, and device serial number asset registers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchCertificates()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/invoices/warranty/new"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> New Warranty Certificate
          </Link>
        </div>
      </div>

      {/* Search & KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Total Certificates</span>
          <div className="text-2xl font-bold text-white font-mono">{certificates.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Active Warranties</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {certificates.filter((c) => c.status === "Active" || c.status === "ACTIVE").length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-[#38bdf8] uppercase">Equipment Serial Assets</span>
          <div className="text-2xl font-bold text-[#38bdf8] font-mono">
            {certificates.reduce((sum, c) => sum + (Array.isArray(c.serials) ? c.serials.length : 0), 0)}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-purple-400 uppercase">Completion Forms (COC)</span>
          <div className="text-2xl font-bold text-purple-400 font-mono">
            {certificates.filter((c) => c.docNumberCOC).length}
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Ref No (e.g. WC-2026-1001), COC No, Project, Client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
        />
      </div>

      {/* Certificates Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Ref No / COC Doc</th>
                <th className="px-5 py-3.5">Client & Project</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5">Validity Period</th>
                <th className="px-5 py-3.5 text-center">Equipment / Serials</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && certificates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                    Loading warranty certificates...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No warranty certificates found. Click "New Warranty Certificate" to create one.
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => {
                  const itemCount = Array.isArray(cert.items) ? cert.items.length : 0;
                  const serialCount = Array.isArray(cert.serials) ? cert.serials.length : 0;

                  return (
                    <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white">
                        <div>{cert.refNumber}</div>
                        {cert.docNumberCOC && (
                          <div className="text-[10px] text-indigo-400 font-light mt-0.5">
                            COC: {cert.docNumberCOC}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{cert.client?.name}</div>
                        <div className="text-[11px] text-gray-400 font-light flex items-center gap-1 mt-0.5">
                          {cert.client?.company && <span>{cert.client.company} • </span>}
                          <span className="text-[#38bdf8]">{cert.projectName || "CCTV Hardware Supply"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-400">
                        {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs">
                        <div className="text-gray-300">{cert.coveragePeriod}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          Until {new Date(cert.validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-gray-300">
                          {itemCount} items • {serialCount} serials
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          cert.status === "Active" || cert.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/invoices/warranty/${cert.id}`}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="View Document"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/invoices/warranty/${cert.id}/print`}
                            target="_blank"
                            className="p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600/30 rounded-lg transition-colors"
                            title="Print / PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
