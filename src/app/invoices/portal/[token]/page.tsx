"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Shield, Printer, CheckCircle, Clock, AlertTriangle, FileText, Building, Mail, Phone } from "lucide-react";

export default function ClientPortalInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/portal/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invoice link invalid or expired.");
        return res.json();
      })
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const formatPHP = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format((cents || 0) / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center p-4 text-gray-400 text-xs">
        <FileText className="w-6 h-6 animate-pulse text-[#38bdf8] mr-2" /> Loading Client Invoice Portal...
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 max-w-md w-full text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold font-serif text-white">Invoice Not Found</h2>
          <p className="text-xs text-gray-400 font-light">{error || "This invoice link is no longer active."}</p>
        </div>
      </div>
    );
  }

  const totalPaid = invoice.payments?.reduce((s: number, p: any) => s + p.amountPaid, 0) || 0;
  const remainingBalance = Math.max(0, invoice.totalAmt - totalPaid);

  return (
    <div className="min-h-screen bg-[#060b14] text-gray-100 p-4 sm:p-8 font-sans">
      {/* Top Banner Branding */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#06b6d4] flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-white">JHXT Client Portal</h1>
            <p className="text-[11px] text-[#38bdf8] font-mono">Invoice #{invoice.invoiceNumber}</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all"
        >
          <Printer className="w-4 h-4" /> Download / Print
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 space-y-8 shadow-2xl">
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div>
            <span className="text-[11px] text-gray-400 font-mono uppercase">Payment Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  invoice.status === "PAID"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : invoice.status === "PARTIAL"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {invoice.status}
              </span>
              <span className="text-xs text-gray-400">
                Due Date: <strong className="text-white">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</strong>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-gray-400 font-mono uppercase">Balance Remaining</span>
            <div className="text-2xl font-bold font-mono text-[#38bdf8]">
              {formatPHP(remainingBalance)}
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Prepared For:</span>
            <div className="text-base font-bold text-white">{invoice.client?.name}</div>
            {invoice.client?.company && <div className="text-gray-300">{invoice.client.company}</div>}
            {invoice.client?.address && <div className="text-gray-400">{invoice.client.address}</div>}
          </div>

          <div className="space-y-1 text-left md:text-right font-mono">
            <span className="text-gray-400 uppercase text-[10px]">Issued By:</span>
            <div className="text-sm font-bold text-white">JHXT IT SOLUTIONS</div>
            <div className="text-gray-400">Tarlac City, Philippines</div>
            <div className="text-gray-400">Email: info@jhxt.com</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase text-gray-400">Billed Services</h3>
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-mono uppercase">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {invoice.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-white">{item.description}</td>
                    <td className="px-4 py-3 text-center font-mono">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatPHP(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white">
                      {formatPHP(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Notes */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-white/10 pt-6 text-xs">
          <div className="space-y-2 max-w-md">
            <span className="font-semibold text-white font-serif">Payment Notes & Instructions:</span>
            <p className="text-gray-400 font-light leading-relaxed">
              {invoice.notes || "Please settle payments directly with JHXT management."}
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2 font-mono">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span className="text-white">{formatPHP(invoice.subtotalAmt)}</span>
            </div>
            {invoice.discountAmt > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Discount:</span>
                <span>-{formatPHP(invoice.discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-400">
              <span>VAT / Tax ({invoice.taxPercent}%):</span>
              <span className="text-white">+{formatPHP(invoice.taxAmt)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2">
              <span>Total Amount:</span>
              <span className="text-[#38bdf8]">{formatPHP(invoice.totalAmt)}</span>
            </div>
          </div>
        </div>

        {/* Verified Payment Log */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="border-t border-white/10 pt-6 space-y-3">
            <h3 className="text-xs uppercase font-mono text-emerald-400 tracking-wider font-semibold">
              Verified Received Payments
            </h3>
            <div className="space-y-2">
              {invoice.payments.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{formatPHP(p.amountPaid)}</span> via{" "}
                    <span className="text-emerald-400 font-medium">{p.method}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-[11px]">
                    {format(new Date(p.paymentDate), "MMM dd, yyyy")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
