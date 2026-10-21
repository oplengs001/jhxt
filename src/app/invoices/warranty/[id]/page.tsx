"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Printer,
  ArrowLeft,
  Calendar,
  Building,
  CheckCircle,
  FileText,
  Cpu,
  Mail,
  Phone,
  Layers,
  MapPin,
  Clock,
  Trash2,
} from "lucide-react";
import { normalizeSerials, countColumnSerials } from "@/lib/serials";

export default function WarrantyCertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/warranty/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Certificate not found");
        return res.json();
      })
      .then((data) => setCert(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this warranty certificate?")) return;
    try {
      const res = await fetch(`/api/documents/warranty/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/invoices/warranty");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 max-w-5xl mx-auto">
        Loading warranty certificate...
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 max-w-5xl mx-auto space-y-3">
        <p>Warranty certificate not found.</p>
        <Link href="/invoices/warranty" className="text-[#38bdf8] hover:underline">
          ← Back to Warranty List
        </Link>
      </div>
    );
  }

  const items = Array.isArray(cert.items) ? cert.items : [];
  const { subtitle, columns, rows } = normalizeSerials(cert.serials);
  const columnCounts = countColumnSerials(columns, rows);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/warranty"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white tracking-tight font-mono">
                {cert.refNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {cert.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Client: <span className="text-white font-medium">{cert.client?.name}</span>
              {cert.client?.company && <span> ({cert.client.company})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/invoices/warranty/${cert.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-xs shadow-md transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" /> Print / Official PDF
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete Certificate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Display Sheet */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 space-y-8">
        {/* Document Header Letterhead */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="text-lg font-bold font-serif text-white tracking-tight">
              JHXT INFORMATION TECHNOLOGY SOLUTIONS
            </div>
            <div className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
              SECURITY SYSTEMS & TECHNICAL SERVICES
            </div>
            <div className="text-xs text-gray-400 font-light mt-2 space-y-0.5">
              <div>Email: {cert.providerEmail}</div>
              <div>Phone: {cert.providerPhone}</div>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="text-xl font-bold font-serif text-white uppercase tracking-tight">
              WARRANTY CERTIFICATE
            </div>
            <div className="text-xs text-indigo-400 font-medium">Official Hardware Supply Warranty</div>
            <div className="text-xs font-mono text-gray-300 mt-2">
              Ref No: <span className="text-white font-bold">{cert.refNumber}</span>
            </div>
            <div className="text-xs font-mono text-gray-400">
              Date: {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Client & Project Details Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold tracking-wider">
              CLIENT DETAILS & REFERENCE
            </span>
            <div className="font-bold text-white text-sm">{cert.client?.name}</div>
            {cert.client?.company && <div className="text-gray-300 font-medium">{cert.client.company}</div>}
            {cert.client?.address && <div className="text-gray-400 font-light mt-1">{cert.client.address}</div>}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold tracking-wider">
              PROJECT & COMPLETION REFERENCE
            </span>
            <div className="font-bold text-white text-sm">{cert.projectName || "CCTV Hardware Supply"}</div>
            {cert.docNumberCOC && (
              <div className="font-mono text-gray-300">
                Completion Doc No: <span className="text-[#38bdf8] font-bold">{cert.docNumberCOC}</span>
              </div>
            )}
            <div className="text-gray-400 font-light">
              Warranty Coverage: <span className="text-white font-medium">{cert.coveragePeriod}</span>
            </div>
          </div>
        </div>

        {/* Blue Banner */}
        <div className="p-3 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs uppercase tracking-wider text-center shadow-lg">
          {cert.coveragePeriod.toUpperCase()} (VALID: {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()} – {new Date(cert.validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()})
        </div>

        {/* Supplied Equipment Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase text-gray-400 tracking-wider font-semibold">
            Covered Equipment Schedule
          </h3>
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono">
                <tr>
                  <th className="px-4 py-3">Item & Equipment Description</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-center">Coverage Period</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {items.map((it: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">{it.description}</td>
                    <td className="px-4 py-3 text-center font-mono">{it.quantity} {it.unit || "Pc"}</td>
                    <td className="px-4 py-3 text-center">{it.coverage || "1 Year Standard"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {it.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Serial Number Inventory Section */}
        {rows.length > 0 && (
          <div className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Device Serial Number Inventory ({rows.length} units registered)
                </h3>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {columns.map((col) => (
                  <span
                    key={col.id}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono"
                  >
                    {col.label}: <strong className="text-white">{columnCounts[col.id] || 0}</strong>
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono">
                  <tr>
                    <th className="px-3 py-2.5 text-center w-12">#</th>
                    {columns.map((col) => (
                      <th key={col.id} className="px-4 py-2.5">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-mono text-[11px]">
                  {rows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="px-3 py-2 text-center text-gray-500">{idx + 1}</td>
                      {columns.map((col) => (
                        <td key={col.id} className="px-4 py-2 text-gray-200">
                          {row[col.id] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="border-t border-white/10 pt-6 space-y-2 text-xs text-gray-400">
          <span className="font-semibold text-gray-300 uppercase font-mono tracking-wider">
            Warranty Terms & Conditions:
          </span>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed font-light">
            <li>
              <strong className="text-gray-300">Coverage:</strong> JHXT Information Technology Solutions guarantees that all supplied hardware equipment listed above is free from manufacturing and operational defects for one (1) year.
            </li>
            <li>
              <strong className="text-gray-300">Service Remedy:</strong> Defective components will be repaired or replaced with equivalent units free of charge upon technical verification and evaluation.
            </li>
            <li>
              <strong className="text-gray-300">Exclusions:</strong> Warranty does not cover damages resulting from power surges, lightning, natural disasters, unauthorized tampering, physical damage, or third-party modifications.
            </li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/10 pt-8 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono text-gray-400">ISSUED & DELIVERED BY</span>
            <div className="font-bold text-white text-sm">{cert.issuedByName || "JAY HENDRIX TOLEDO"}</div>
            <div className="text-gray-400">{cert.issuedByTitle || "Lead Technical Representative"}</div>
            <div className="text-gray-500 text-[10px]">JHXT Information Technology Solutions</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono text-gray-400">ACKNOWLEDGED & RECEIVED BY</span>
            <div className="font-bold text-white text-sm">{cert.clientRepName || "Authorized Representative"}</div>
            <div className="text-gray-400">{cert.client?.company || cert.client?.name}</div>
            <div className="text-gray-500 text-[10px]">Client Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
