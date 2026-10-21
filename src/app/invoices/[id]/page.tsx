"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileText,
  ArrowLeft,
  Printer,
  ExternalLink,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Save,
  Send,
  X,
  CreditCard,
  Building,
  Mail,
  Phone,
  Copy,
  Check,
} from "lucide-react";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) {
        throw new Error("Invoice not found");
      }
      const data = await res.json();
      setInvoice(data);

      // Pre-fill remaining balance in payment modal
      const totalPaid = data.payments?.reduce((s: number, p: any) => s + p.amountPaid, 0) || 0;
      const remaining = Math.max(0, data.totalAmt - totalPaid);
      setPaymentAmount((remaining / 100).toFixed(2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchInvoice();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(paymentAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    setRecordingPayment(true);
    try {
      const res = await fetch(`/api/invoices/${id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPaid: parsed,
          method: paymentMethod,
          reference: paymentRef,
          notes: paymentNotes,
        }),
      });

      if (res.ok) {
        setShowPaymentModal(false);
        setPaymentRef("");
        setPaymentNotes("");
        fetchInvoice();
      }
    } catch (err) {
      console.error("Payment recording failed:", err);
    } finally {
      setRecordingPayment(false);
    }
  };

  const copyPortalLink = () => {
    if (!invoice?.portalToken) return;
    const url = `${window.location.origin}/invoices/portal/${invoice.portalToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPHP = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format((cents || 0) / 100);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400 text-xs">
        <FileText className="w-6 h-6 animate-pulse mx-auto mb-2 text-[#38bdf8]" />
        Loading invoice details...
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-12 text-center text-red-400 text-xs">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        {error || "Invoice not found"}
        <div className="mt-4">
          <Link href="/invoices" className="text-[#38bdf8] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalPaid = invoice.payments?.reduce((s: number, p: any) => s + p.amountPaid, 0) || 0;
  const remainingBalance = Math.max(0, invoice.totalAmt - totalPaid);
  const portalUrl = `/invoices/portal/${invoice.portalToken}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white tracking-tight font-mono">
                {invoice.invoiceNumber}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                  invoice.status === "PAID"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : invoice.status === "PARTIAL"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : invoice.status === "SENT"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : invoice.status === "CANCELLED"
                    ? "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Client: <span className="text-white font-medium">{invoice.client?.name}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status !== "PAID" && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              <CreditCard className="w-4 h-4" /> Record Payment
            </button>
          )}

          {invoice.status === "DRAFT" && (
            <button
              onClick={() => handleUpdateStatus("SENT")}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all"
            >
              <Send className="w-4 h-4" /> Mark as Sent
            </button>
          )}

          <Link
            href={`/invoices/${invoice.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium transition-all"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </Link>

          <button
            onClick={copyPortalLink}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Link Copied!" : "Copy Portal Link"}
          </button>

          <Link
            href={portalUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/20 text-xs font-medium transition-all"
          >
            Client Portal <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Invoice Card Display */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 space-y-8">
        {/* Letterhead & Meta Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white tracking-wider">
              JHXTES IT SOLUTIONS
            </h2>
            <p className="text-xs text-[#38bdf8] font-mono mt-0.5">
              Architecture • Vision • Security • Managed Services
            </p>
            <p className="text-xs text-gray-400 mt-2 font-light">
              Tarlac City, Philippines • Contact: +63 917 123 4567 • info@jhxt.com
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 font-mono text-xs">
            <div className="text-xl font-bold text-white tracking-wide">INVOICE</div>
            <div className="text-gray-400">Number: <span className="text-[#38bdf8]">{invoice.invoiceNumber}</span></div>
            <div className="text-gray-400">Issue Date: {format(new Date(invoice.issueDate), "MMM dd, yyyy")}</div>
            <div className="text-gray-400">Due Date: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}</div>
          </div>
        </div>

        {/* Bill To & Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <span className="text-gray-400 font-medium uppercase font-mono tracking-wider text-[10px]">
              Billed To (Client):
            </span>
            <div className="text-base font-bold text-white">{invoice.client?.name}</div>
            {invoice.client?.company && (
              <div className="text-gray-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#38bdf8]" /> {invoice.client.company}
              </div>
            )}
            {invoice.client?.email && (
              <div className="text-gray-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {invoice.client.email}
              </div>
            )}
            {invoice.client?.phone && (
              <div className="text-gray-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {invoice.client.phone}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-gray-400 font-mono">
              <span>Total Invoiced:</span>
              <span className="font-bold text-white text-sm">{formatPHP(invoice.totalAmt)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 font-mono">
              <span>Total Payments Recorded:</span>
              <span className="font-bold text-emerald-400">{formatPHP(totalPaid)}</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-white border-t border-white/10 pt-2 font-mono">
              <span>Balance Due (PHP):</span>
              <span className={remainingBalance > 0 ? "text-amber-400" : "text-emerald-400"}>
                {formatPHP(remainingBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase font-mono text-gray-400 tracking-wider">
            Items & Services Summary
          </h3>
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-mono uppercase">
                <tr>
                  <th className="px-4 py-3">Description / Item</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {invoice.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-white">{item.description}</td>
                    <td className="px-4 py-3 text-center font-mono">
                      <span>{item.quantity}</span>
                      {item.unit && (
                        <span className="text-gray-400 text-xs ml-1 font-sans">
                          {item.unit}
                        </span>
                      )}
                    </td>
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

        {/* Totals Breakdown */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-white/10 pt-6">
          <div className="text-xs text-gray-400 space-y-1 max-w-md">
            <span className="font-semibold text-gray-300">Terms & Payment Instructions:</span>
            <p className="font-light leading-relaxed">{invoice.notes || "No extra terms specified."}</p>
          </div>

          <div className="w-full md:w-72 space-y-2 text-xs font-mono">
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

            <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2">
              <span>Grand Total:</span>
              <span className="text-[#38bdf8]">{formatPHP(invoice.totalAmt)}</span>
            </div>
          </div>
        </div>

        {/* Payment History Timeline */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="border-t border-white/10 pt-6 space-y-3">
            <h3 className="text-xs uppercase font-mono text-emerald-400 tracking-wider font-semibold">
              Payment Record History
            </h3>
            <div className="space-y-2">
              {invoice.payments.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{formatPHP(p.amountPaid)}</span> via{" "}
                    <span className="font-semibold text-emerald-400">{p.method}</span>
                    {p.reference && (
                      <span className="text-gray-400 font-mono ml-2">(Ref: {p.reference})</span>
                    )}
                  </div>
                  <div className="text-gray-400 font-mono text-[11px]">
                    {format(new Date(p.paymentDate), "MMM dd, yyyy HH:mm")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif text-white">Record Manual Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Amount Received (PHP) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                >
                  <option value="CASH" className="bg-[#0a1120]">Cash</option>
                  <option value="BANK_TRANSFER" className="bg-[#0a1120]">Bank Transfer</option>
                  <option value="GCASH" className="bg-[#0a1120]">GCash / E-Wallet</option>
                  <option value="CHECK" className="bg-[#0a1120]">Check</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium">Reference # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Ref # 987654321"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid in cash at Tarlac office"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPayment}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50"
                >
                  {recordingPayment ? "Saving..." : "Confirm & Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
