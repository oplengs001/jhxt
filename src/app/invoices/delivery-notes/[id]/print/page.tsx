"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrintDeliveryNotePage() {
  const params = useParams();
  const id = params?.id as string;

  const [dn, setDn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/delivery/${id}`)
      .then((res) => res.json())
      .then((data) => setDn(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500 font-sans">Preparing print preview...</div>;
  }

  if (!dn) {
    return <div className="p-8 text-center text-sm text-slate-500 font-sans">Document not found</div>;
  }

  const items = Array.isArray(dn.items) ? dn.items : [];

  const formattedDeliveryDate = new Date(dn.deliveryDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedDueDate = dn.dueDate
    ? new Date(dn.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : formattedDeliveryDate;

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:py-0 print:bg-white text-slate-900 font-sans">
      {/* Floating Toolbar */}
      <div className="max-w-4xl mx-auto mb-6 px-4 flex items-center justify-between no-print">
        <Link
          href={`/invoices/delivery-notes/${dn.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Delivery Note
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Main Delivery Note Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-14 shadow-lg print:shadow-none print:p-8 space-y-8">
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
          <h2 className="text-xs font-bold font-mono tracking-wider text-blue-500 uppercase">
            DELIVERY NOTE
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-1 font-sans">
            <div className="flex gap-4">
              <span className="text-slate-500 w-28">Delivery Note</span>
              <span className="font-bold text-slate-900 font-mono">{dn.deliveryNumber}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-500 w-28">Invoice Date</span>
              <span className="text-slate-800 font-mono">{formattedDeliveryDate}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-500 w-28">Due Date</span>
              <span className="text-slate-800 font-mono">{formattedDueDate}</span>
            </div>
            {dn.poNumber && (
              <div className="flex gap-4">
                <span className="text-slate-500 w-28">PO Number</span>
                <span className="text-slate-800 font-mono">{dn.poNumber}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-900 text-sm">{dn.client?.company || dn.client?.name}</div>
            {dn.client?.address && <div className="text-slate-600 leading-tight text-[11px]">{dn.client.address}</div>}
            {dn.client?.phone && <div className="text-slate-600 text-[11px]">Tel: {dn.client.phone}</div>}
          </div>
        </div>

        {/* Items Table */}
        <div className="pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-700 font-semibold">
                <th className="py-2.5 w-44">Item</th>
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-right w-24">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {items.map((it: any, idx: number) => (
                <tr key={idx} className="align-top">
                  <td className="py-3 font-semibold text-slate-900 pr-3">
                    {it.itemCode || "Item"}
                  </td>
                  <td className="py-3 text-[11px] leading-relaxed text-slate-700 whitespace-pre-line pr-3">
                    {it.description}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    {it.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature Line */}
        <div className="pt-24 pb-8">
          <div className="max-w-xs ml-auto text-center space-y-1">
            <div className="border-b border-slate-800 h-10 mb-2"></div>
            <div className="text-sm font-serif font-bold text-slate-900">Received By:</div>
            <div className="text-[10px] text-slate-500">Authorized Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}
