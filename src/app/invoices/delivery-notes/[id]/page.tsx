"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Printer,
  ArrowLeft,
  Calendar,
  Building,
  CheckCircle,
  Mail,
  Phone,
  Trash2,
  Clock,
  User,
} from "lucide-react";

export default function DeliveryNoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [dn, setDn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/documents/delivery/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Delivery note not found");
        return res.json();
      })
      .then((data) => setDn(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this delivery note?")) return;
    try {
      const res = await fetch(`/api/documents/delivery/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/invoices/delivery-notes");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 max-w-5xl mx-auto">
        Loading delivery note...
      </div>
    );
  }

  if (!dn) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 max-w-5xl mx-auto space-y-3">
        <p>Delivery note not found.</p>
        <Link href="/invoices/delivery-notes" className="text-[#38bdf8] hover:underline">
          ← Back to Delivery Notes List
        </Link>
      </div>
    );
  }

  const items = Array.isArray(dn.items) ? dn.items : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/delivery-notes"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white tracking-tight font-mono">
                DN #{dn.deliveryNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {dn.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Client: <span className="text-white font-medium">{dn.client?.name}</span>
              {dn.client?.company && <span> ({dn.client.company})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/invoices/delivery-notes/${dn.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-md transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" /> Print / Official PDF
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete Delivery Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sheet Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="text-2xl font-bold font-serif text-white tracking-tight">
              JHXT
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#38bdf8] uppercase">
              INFORMATION TECHNOLOGY SOLUTIONS
            </div>
            <div className="text-xs text-gray-400 mt-2 font-light space-y-0.5">
              <div>279 AMBID STREET BILUSO, SILANG CAVITE</div>
              <div>Contact No: 09602506456 • Philippines</div>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold">
              DELIVERY NOTE
            </div>
            <div className="text-lg font-mono font-bold text-white">
              {dn.deliveryNumber}
            </div>
            <div className="text-xs text-gray-400">
              Delivery Date: <span className="text-white font-mono">{new Date(dn.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            {dn.dueDate && (
              <div className="text-xs text-gray-400">
                Due Date: <span className="text-white font-mono">{new Date(dn.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            )}
            {dn.poNumber && (
              <div className="text-xs text-gray-400">
                PO Ref: <span className="text-[#38bdf8] font-mono font-semibold">{dn.poNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Client recipient details */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
          <span className="text-[10px] uppercase font-mono text-gray-400">DELIVERED TO</span>
          <div className="font-bold text-white text-sm">{dn.client?.company || dn.client?.name}</div>
          {dn.client?.address && <div className="text-gray-400 font-light">{dn.client.address}</div>}
          {dn.client?.email && <div className="text-gray-400 text-[11px]">Email: {dn.client.email}</div>}
          {dn.client?.phone && <div className="text-gray-400 text-[11px]">Phone: {dn.client.phone}</div>}
        </div>

        {/* Items Table */}
        <div className="space-y-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono">
              <tr>
                <th className="px-4 py-3">Item / Model</th>
                <th className="px-4 py-3">Description & Technical Specifications</th>
                <th className="px-4 py-3 text-center w-28">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {items.map((it: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-4 py-3.5 font-semibold text-white align-top w-48">
                    {it.itemCode || "Equipment"}
                  </td>
                  <td className="px-4 py-3.5 font-light text-gray-300 leading-relaxed align-top">
                    {it.description}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-white align-top">
                    {it.quantity} {it.unit || "pcs"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-white/10 pt-8 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-gray-400">DELIVERED BY</span>
            <div className="font-bold text-white">{dn.deliveredByName || "JAY HENDRIX TOLEDO"}</div>
            <div className="text-gray-500 text-[11px]">JHXT Information Technology Solutions</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-gray-400">RECEIVED BY</span>
            <div className="font-bold text-white">{dn.receivedByName || "Client Authorized Representative"}</div>
            <div className="text-gray-500 text-[11px]">{dn.client?.company || dn.client?.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
