"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrintPurchaseOrderPage() {
  const params = useParams();
  const id = params?.id as string;

  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/purchase-order/${id}`)
      .then((res) => res.json())
      .then((data) => setPo(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500 font-sans">Preparing print preview...</div>;
  }

  if (!po) {
    return <div className="p-8 text-center text-sm text-slate-500 font-sans">Document not found</div>;
  }

  const items = Array.isArray(po.items) ? po.items : [];

  const formatPHP = (cents: number) => {
    return `P ${((cents || 0) / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  };

  const balanceDue = Math.max(0, (po.totalAmt || 0) - (po.paidAmt || 0));

  const formattedDate = new Date(po.orderDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:py-0 print:bg-white text-slate-900 font-sans">
      {/* Floating Toolbar */}
      <div className="max-w-4xl mx-auto mb-6 px-4 flex items-center justify-between no-print">
        <Link
          href={`/invoices/purchase-orders/${po.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Purchase Order
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Main Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-14 shadow-lg print:shadow-none print:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                j<span className="text-slate-900">HXT</span>
              </span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
              INFORMATION TECHNOLOGY SOLUTIONS
            </div>
          </div>

          <div className="text-right text-xs space-y-0.5 text-slate-600">
            <div className="font-semibold text-blue-600">JHXT INFORMATION TECHNOLOGY SOLUTIONS</div>
            <div>279 AMBID STREET BILUSO</div>
            <div>SILANG CAVITE</div>
            <div>SILANG CAVITE, Contact No. 09602506456</div>
            <div>Philippines</div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-slate-900">
            Performa Invoice / Purchase Order
          </h2>
        </div>

        {/* 3-Column Info Summary Box */}
        <div className="grid grid-cols-12 gap-4 text-xs border-b border-slate-200 pb-6">
          <div className="col-span-4 space-y-1">
            <div className="flex justify-between pr-4">
              <span className="text-slate-500">Invoice / PO</span>
              <span className="font-mono font-bold text-slate-900">{po.poNumber}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-slate-500">Date</span>
              <span className="font-mono text-slate-800">{formattedDate}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-slate-500">Total</span>
              <span className="font-mono font-bold text-slate-900">{formatPHP(po.totalAmt)}</span>
            </div>
            <div className="flex justify-between pr-4">
              <span className="text-slate-500">Balance Due</span>
              <span className="font-mono font-bold text-slate-900">{formatPHP(balanceDue)}</span>
            </div>
          </div>

          <div className="col-span-5 space-y-1">
            <div className="font-bold text-slate-900">{po.client?.company || po.client?.name}</div>
            {po.client?.address && (
              <div className="text-slate-600 leading-tight text-[11px] whitespace-pre-line">
                {po.client.address}
              </div>
            )}
            <div className="text-slate-500 text-[11px]">Philippines</div>
          </div>

          <div className="col-span-3 text-right space-y-1">
            <div className="font-mono text-[11px] text-slate-500 uppercase">PO Reference</div>
            <div className="font-mono font-bold text-sm text-slate-900">{po.poNumber}</div>
          </div>
        </div>

        {/* Table */}
        <div className="pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-700 font-semibold">
                <th className="py-2.5 w-40">Item</th>
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-right w-24">Unit Cost</th>
                <th className="py-2.5 text-center w-16">Quantity</th>
                <th className="py-2.5 text-right w-28">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {items.map((it: any, idx: number) => {
                const lineTotal = ((it.quantity || 1) * (it.unitCost || 0));
                return (
                  <tr key={idx} className="align-top">
                    <td className="py-3 font-semibold text-blue-600 pr-3">
                      {it.itemCode || "Item"}
                    </td>
                    <td className="py-3 text-[11px] leading-relaxed text-slate-700 whitespace-pre-line pr-3">
                      {it.description}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      P {(it.unitCost || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-center font-mono font-medium">
                      {it.quantity}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      P {lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-64 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Net:</span>
              <span className="font-semibold text-slate-900">{formatPHP(po.subtotalAmt)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatPHP(po.subtotalAmt)}</span>
            </div>
            {po.taxAmt > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax ({po.taxPercent}%):</span>
                <span className="font-semibold text-slate-900">{formatPHP(po.taxAmt)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-bold border-t border-slate-300 pt-1.5">
              <span>Total:</span>
              <span>{formatPHP(po.totalAmt)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Paid to Date:</span>
              <span className="text-slate-900">{formatPHP(po.paidAmt)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold border-t border-slate-300 pt-1.5">
              <span>Balance Due:</span>
              <span>{formatPHP(balanceDue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
