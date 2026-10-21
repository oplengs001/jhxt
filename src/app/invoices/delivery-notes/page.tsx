"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Printer,
  Calendar,
  Building,
  CheckCircle,
  FileText,
} from "lucide-react";

export default function DeliveryNotesListPage() {
  const [deliveryNotes, setDeliveryNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDeliveryNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/documents/delivery?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDeliveryNotes(data.deliveryNotes || []);
      }
    } catch (err) {
      console.error("Failed to load delivery notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryNotes();
  }, [search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-emerald-400" /> Delivery Notes
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Track official equipment dispatch notes, client turnover receipts, and signed delivery acknowledgments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDeliveryNotes()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/invoices/delivery-notes/new"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> New Delivery Note
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Total Delivery Notes</span>
          <div className="text-2xl font-bold text-white font-mono">{deliveryNotes.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Delivered & Acknowledged</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {deliveryNotes.filter((d) => d.status === "DELIVERED" || d.status === "ACKNOWLEDGED").length}
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-[#38bdf8] uppercase">Total Equipment Dispatched</span>
          <div className="text-2xl font-bold text-[#38bdf8] font-mono">
            {deliveryNotes.reduce((sum, d) => sum + (Array.isArray(d.items) ? d.items.length : 0), 0)}
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by DN Number (e.g. 0131), PO Number, Client name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
        />
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Delivery Note #</th>
                <th className="px-5 py-3.5">Client & Recipient</th>
                <th className="px-5 py-3.5">Delivery Date</th>
                <th className="px-5 py-3.5">PO / Invoice Ref</th>
                <th className="px-5 py-3.5 text-center">Items Count</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && deliveryNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                    Loading delivery notes...
                  </td>
                </tr>
              ) : deliveryNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <Truck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No delivery notes found. Click "New Delivery Note" to create one.
                  </td>
                </tr>
              ) : (
                deliveryNotes.map((dn) => {
                  const itemCount = Array.isArray(dn.items) ? dn.items.length : 0;

                  return (
                    <tr key={dn.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white">
                        {dn.deliveryNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{dn.client?.name}</div>
                        {dn.client?.company && (
                          <div className="text-[11px] text-gray-400 font-light mt-0.5">
                            {dn.client.company}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-400">
                        {new Date(dn.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-300">
                        {dn.poNumber ? (
                          <span className="text-[#38bdf8]">PO: {dn.poNumber}</span>
                        ) : dn.invoiceNumber ? (
                          <span className="text-gray-400">Inv: {dn.invoiceNumber}</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-gray-300">
                          {itemCount} items
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {dn.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/invoices/delivery-notes/${dn.id}`}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="View Delivery Note"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/invoices/delivery-notes/${dn.id}/print`}
                            target="_blank"
                            className="p-1.5 text-emerald-400 hover:text-white hover:bg-emerald-600/30 rounded-lg transition-colors"
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
