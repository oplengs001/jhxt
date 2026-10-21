"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Printer,
  ArrowLeft,
  Calendar,
  Building,
  CheckCircle,
  Mail,
  Phone,
  Trash2,
  Clock,
} from "lucide-react";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/purchase-order/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Purchase order not found");
        return res.json();
      })
      .then((data) => setPo(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      const res = await fetch(`/api/documents/purchase-order/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/invoices/purchase-orders");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatPHP = (cents: number) => {
    return `₱${((cents || 0) / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 max-w-5xl mx-auto">
        Loading purchase order...
      </div>
    );
  }

  if (!po) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 max-w-5xl mx-auto space-y-3">
        <p>Purchase order not found.</p>
        <Link href="/invoices/purchase-orders" className="text-[#38bdf8] hover:underline">
          ← Back to Purchase Orders
        </Link>
      </div>
    );
  }

  const items = Array.isArray(po.items) ? po.items : [];
  const balanceDue = Math.max(0, (po.totalAmt || 0) - (po.paidAmt || 0));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/purchase-orders"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white tracking-tight font-mono">
                {po.poNumber}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                po.status === "APPROVED" || po.status === "FULFILLED"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {po.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Client: <span className="text-white font-medium">{po.client?.name}</span>
              {po.client?.company && <span> ({po.client.company})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/invoices/purchase-orders/${po.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-xs shadow-md transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" /> Print / Official PDF
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete Purchase Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Sheet */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="text-2xl font-bold font-serif text-white tracking-tight">
              JHXT
            </div>
            <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
              INFORMATION TECHNOLOGY SOLUTIONS
            </div>
            <div className="text-xs text-gray-400 mt-2 font-light space-y-0.5">
              <div>279 AMBID STREET BILUSO, SILANG CAVITE</div>
              <div>Contact No: 09602506456 • Philippines</div>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="text-lg font-serif font-bold text-white uppercase">
              Performa Invoice / Purchase Order
            </div>
            <div className="text-xs text-gray-300 font-mono">
              PO Number: <span className="text-white font-bold">{po.poNumber}</span>
            </div>
            <div className="text-xs text-gray-400">
              Order Date: <span className="text-white font-mono">{new Date(po.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            {po.deliveryDate && (
              <div className="text-xs text-gray-400">
                Delivery Target: <span className="text-white font-mono">{new Date(po.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Client Box */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
          <span className="text-[10px] uppercase font-mono text-gray-400">BILLED / ISSUED TO</span>
          <div className="font-bold text-white text-sm">{po.client?.company || po.client?.name}</div>
          {po.client?.address && <div className="text-gray-400 font-light">{po.client.address}</div>}
          {po.client?.email && <div className="text-gray-400 text-[11px]">Email: {po.client.email}</div>}
          {po.client?.phone && <div className="text-gray-400 text-[11px]">Phone: {po.client.phone}</div>}
        </div>

        {/* Items Table */}
        <div className="space-y-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Unit Cost</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {items.map((it: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-4 py-3.5 font-semibold text-white align-top w-40">
                    {it.itemCode || "Equipment"}
                  </td>
                  <td className="px-4 py-3.5 font-light text-gray-300 leading-relaxed align-top whitespace-pre-line">
                    {it.description}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-gray-300 align-top w-28">
                    ₱{(it.unitCost || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-medium text-white align-top w-20">
                    {it.quantity} {it.unit || "pcs"}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-white align-top w-32">
                    ₱{((it.quantity || 1) * (it.unitCost || 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-white/10 pt-6">
          <div className="text-xs text-gray-400 space-y-1 max-w-md">
            <span className="font-semibold text-gray-300">Notes & Commercial Terms:</span>
            <p className="font-light leading-relaxed whitespace-pre-line">
              {po.notes || "Standard corporate terms apply."}
            </p>
          </div>

          <div className="w-full md:w-72 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-gray-400">
              <span>Net / Subtotal:</span>
              <span className="text-white">{formatPHP(po.subtotalAmt)}</span>
            </div>
            {po.taxAmt > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Tax / VAT ({po.taxPercent}%):</span>
                <span className="text-white">{formatPHP(po.taxAmt)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2">
              <span>Total Procurement:</span>
              <span className="text-amber-400">{formatPHP(po.totalAmt)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Paid to Date:</span>
              <span className="text-emerald-400">{formatPHP(po.paidAmt)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white border-t border-white/10 pt-2">
              <span>Balance Due:</span>
              <span className="text-rose-400">{formatPHP(balanceDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
