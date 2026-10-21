"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { normalizeSerials, countColumnSerials } from "@/lib/serials";

export default function PrintWarrantyCertificatePage() {
  const params = useParams();
  const id = params?.id as string;

  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/warranty/${id}`)
      .then((res) => res.json())
      .then((data) => setCert(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500 font-sans">Preparing print preview...</div>;
  }

  if (!cert) {
    return <div className="p-8 text-center text-sm text-slate-500 font-sans">Document not found</div>;
  }

  const items = Array.isArray(cert.items) ? cert.items : [];
  const { subtitle, columns, rows } = normalizeSerials(cert.serials);
  const columnCounts = countColumnSerials(columns, rows);

  const formattedDate = new Date(cert.issueDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedValidStart = new Date(cert.issueDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedValidEnd = new Date(cert.validUntil).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:py-0 print:bg-white text-slate-900 font-sans">
      {/* Floating print actions toolbar (hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 px-4 flex items-center justify-between no-print">
        <Link
          href={`/invoices/warranty/${cert.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificate
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* ======================================================== */}
      {/* PAGE 1: OFFICIAL WARRANTY CERTIFICATE */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-14 shadow-lg print:shadow-none print:p-8 space-y-6 page-break mb-8 print:mb-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-slate-900">
              JHXT INFORMATION TECHNOLOGY SOLUTIONS
            </h1>
            <p className="text-[11px] font-mono tracking-wider text-blue-700 font-semibold uppercase">
              SECURITY SYSTEMS & TECHNICAL SERVICES
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold tracking-tight text-blue-900 uppercase">
              WARRANTY CERTIFICATE
            </h2>
            <p className="text-[11px] text-slate-500 font-light">
              Official Hardware Supply Warranty
            </p>
          </div>
        </div>

        {/* 2 Information Boxes */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-800">
              SERVICE PROVIDER
            </span>
            <div className="font-bold text-slate-900">JHXT Information Technology Solutions</div>
            <div className="text-slate-600">Email: {cert.providerEmail}</div>
            <div className="text-slate-600">Phone: {cert.providerPhone}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-800">
              CLIENT DETAILS & REFERENCE
            </span>
            <div className="font-bold text-slate-900">{cert.client?.company || cert.client?.name}</div>
            {cert.client?.address && (
              <div className="text-slate-600 leading-tight">{cert.client.address}</div>
            )}
            <div className="text-slate-700 font-mono text-[11px] pt-1">
              Ref No: <strong className="text-slate-900">{cert.refNumber}</strong> | Date: {formattedDate}
            </div>
          </div>
        </div>

        {/* Blue Warranty Banner */}
        <div className="bg-[#1e3a8a] text-white py-2 px-4 rounded text-center text-xs font-bold uppercase font-mono tracking-wider">
          1-YEAR STANDARD HARDWARE WARRANTY (VALID: {formattedValidStart.toUpperCase()} – {formattedValidEnd.toUpperCase()})
        </div>

        {/* Item & Equipment Table */}
        <div>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 uppercase font-mono text-[11px]">
                <th className="p-2.5">ITEM & EQUIPMENT DESCRIPTION</th>
                <th className="p-2.5 text-center w-20">QTY</th>
                <th className="p-2.5 text-center w-36">COVERAGE PERIOD</th>
                <th className="p-2.5 text-center w-24">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {items.map((it: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-medium">{it.description}</td>
                  <td className="p-2.5 text-center font-mono">{it.quantity} {it.unit || "Pc"}</td>
                  <td className="p-2.5 text-center">{it.coverage || "1 Year Standard"}</td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {it.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Terms & Conditions */}
        <div className="text-xs space-y-1.5 pt-2 text-slate-700">
          <h4 className="font-bold text-slate-900 uppercase font-mono text-[11px]">
            WARRANTY TERMS & CONDITIONS:
          </h4>
          <ul className="space-y-1 pl-4 list-disc text-[11px] leading-relaxed">
            <li>
              <strong>Coverage:</strong> JHXT Information Technology Solutions guarantees that all supplied hardware equipment listed above is free from manufacturing and operational defects for one (1) year.
            </li>
            <li>
              <strong>Service Remedy:</strong> Defective components will be repaired or replaced with equivalent units free of charge upon technical verification and evaluation.
            </li>
            <li>
              <strong>Exclusions:</strong> Warranty does not cover damages resulting from power surges, lightning, natural disasters, unauthorized tampering, physical damage, or third-party modifications.
            </li>
          </ul>
        </div>

        {/* Signature Blocks */}
        <div className="grid grid-cols-2 gap-12 pt-8 text-xs">
          <div className="border-t border-slate-300 pt-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-4">
              ISSUED BY
            </span>
            <div className="font-bold text-slate-900">{cert.issuedByName || "JAY HENDRIX TOLEDO"}</div>
            <div className="text-slate-600">JHXT Information Technology Solutions</div>
            <div className="text-slate-500 text-[10px]">Date: {formattedDate}</div>
          </div>

          <div className="border-t border-slate-300 pt-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-4">
              ACKNOWLEDGED BY
            </span>
            <div className="font-bold text-slate-900">{cert.clientRepName || "Authorized Representative"}</div>
            <div className="text-slate-600">{cert.client?.company || cert.client?.name}</div>
            <div className="text-slate-500 text-[10px]">Date: {formattedDate}</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PAGE 2: COMPLETION FORM / OFFICIAL DELIVERY & TURNOVER */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-14 shadow-lg print:shadow-none print:p-8 space-y-6 page-break mb-8 print:mb-0">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-b border-slate-200 pb-2">
          <span>JHXT Information Technology Solutions — Warranty Certificate</span>
          <span>Page 1 of 2</span>
        </div>

        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tight text-slate-900">
              JHXT INFORMATION TECHNOLOGY SOLUTIONS
            </h1>
            <p className="text-[11px] font-mono tracking-wider text-blue-700 font-semibold uppercase">
              SECURITY SYSTEMS & TECHNICAL SERVICES
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold tracking-tight text-blue-900 uppercase">
              COMPLETION FORM
            </h2>
            <p className="text-[11px] text-slate-500 font-light">
              Official Delivery & Turnover Certificate
            </p>
          </div>
        </div>

        {/* 2 Info Boxes */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-800">
              SERVICE PROVIDER
            </span>
            <div className="font-bold text-slate-900">JHXT Information Technology Solutions</div>
            <div className="text-slate-600">Email: {cert.providerEmail}</div>
            <div className="text-slate-600">Phone: {cert.providerPhone}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-blue-800">
              PROJECT & CLIENT DETAILS
            </span>
            <div className="text-slate-800">Project: <strong>{cert.projectName || "CCTV Hardware Supply"}</strong></div>
            <div className="text-slate-800">Client: <strong>{cert.client?.company || cert.client?.name}</strong></div>
            {cert.client?.address && (
              <div className="text-slate-600 text-[11px]">Location: {cert.client.address}</div>
            )}
            <div className="text-slate-700 font-mono text-[11px] pt-1">
              Doc No: <strong className="text-slate-900">{cert.docNumberCOC || cert.refNumber}</strong>
            </div>
          </div>
        </div>

        {/* Blue Banner */}
        <div className="bg-[#1e3a8a] text-white py-2 px-4 rounded text-left text-xs font-bold uppercase font-mono tracking-wider">
          CERTIFICATE OF DELIVERY & TURNOVER
        </div>

        {/* Supplied Equipment Schedule */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono uppercase font-bold text-slate-800">
            SUPPLIED EQUIPMENT SCHEDULE:
          </h4>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 uppercase font-mono text-[11px]">
                <th className="p-2.5 text-center w-12">NO.</th>
                <th className="p-2.5">EQUIPMENT DESCRIPTION</th>
                <th className="p-2.5 text-center w-28">QUANTITY</th>
                <th className="p-2.5 text-center w-32">CONDITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {items.map((it: any, idx: number) => (
                <tr key={idx}>
                  <td className="p-2.5 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="p-2.5 font-medium">{it.description}</td>
                  <td className="p-2.5 text-center font-mono">{it.quantity} {it.unit || "Pc"}</td>
                  <td className="p-2.5 text-center text-slate-700">{it.condition || "Brand New"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Turnover & Acceptance Statement */}
        <div className="p-4 rounded border-l-4 border-blue-900 bg-slate-50 text-xs space-y-1 text-slate-800">
          <h4 className="font-bold uppercase font-mono text-[11px] text-blue-900">
            TURNOVER & ACCEPTANCE STATEMENT:
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-700">
            This document certifies that JHXT Information Technology Solutions has officially delivered and turned over all the hardware items specified above to <strong>{cert.client?.company || cert.client?.name}</strong> on <strong>{formattedDate}</strong>. All items have been inspected, received in complete quantity, and accepted as brand new and in good condition by the client representative.
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-8 text-xs">
          <div className="border-t border-slate-300 pt-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-4">
              DELIVERED & TURNED OVER BY
            </span>
            <div className="font-bold text-slate-900">{cert.issuedByName || "JAY HENDRIX TOLEDO"}</div>
            <div className="text-slate-600">{cert.issuedByTitle || "Lead Technical Representative"}</div>
            <div className="text-slate-500 text-[10px]">JHXT Information Technology Solutions</div>
            <div className="text-slate-500 text-[10px]">Date: {formattedDate}</div>
          </div>

          <div className="border-t border-slate-300 pt-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-4">
              ACCEPTED & RECEIVED BY
            </span>
            <div className="font-bold text-slate-900">{cert.clientRepName || "Client Authorized Representative"}</div>
            <div className="text-slate-600">{cert.client?.company || cert.client?.name}</div>
            <div className="text-slate-500 text-[10px]">Date: {formattedDate}</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PAGE 3: DEVICE SERIAL NUMBER INVENTORY */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-14 shadow-lg print:shadow-none print:p-8 space-y-6 page-break mb-8 print:mb-0">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <h1 className="text-2xl font-bold font-serif tracking-tight text-slate-900 uppercase">
            DEVICE SERIAL NUMBER INVENTORY
          </h1>
          <p className="text-xs font-mono tracking-wider text-slate-600 uppercase font-semibold">
            {subtitle}
          </p>
        </div>

        {/* KPI Boxes - Dynamically rendered for each custom device column */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-mono">
          {columns.map((col, idx) => {
            const borderColors = [
              "border-blue-600",
              "border-emerald-600",
              "border-purple-600",
              "border-indigo-600",
              "border-amber-600",
              "border-teal-600",
            ];
            const borderClass = borderColors[idx % borderColors.length];
            return (
              <div key={col.id} className={`p-3 border-l-4 ${borderClass} bg-slate-50 space-y-1`}>
                <div className="text-[10px] uppercase text-slate-500 font-bold truncate" title={col.label}>
                  {col.label}
                </div>
                <div className="text-2xl font-bold text-slate-900">{columnCounts[col.id] || 0}</div>
              </div>
            );
          })}
        </div>

        {/* Cross-Reference Serial Number Table */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono uppercase font-bold text-slate-800">
            CROSS-REFERENCE SERIAL NUMBER TABLE
          </h4>
          <table className="w-full text-left text-xs border border-slate-300 font-mono">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px]">
                <th className="p-2 text-center w-10">#</th>
                {columns.map((col) => (
                  <th key={col.id} className="p-2">{col.label.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 text-[11px]">
              {rows.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2 text-center text-slate-500 font-bold">{idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col.id} className="p-2 font-medium">{row[col.id] || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Received By */}
        <div className="pt-16 pb-4">
          <div className="max-w-xs ml-auto text-right space-y-1">
            <div className="text-base font-bold text-slate-900 font-serif">Received By:</div>
            <div className="border-b-2 border-slate-800 h-8"></div>
            <div className="text-[10px] text-slate-500 font-mono pt-1">Authorized Client Representative Signature</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-200 pt-3">
          <span>{subtitle}</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
