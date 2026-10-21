"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
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

export default function PurchaseOrdersListPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/documents/purchase-order?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPurchaseOrders(data.purchaseOrders || []);
      }
    } catch (err) {
      console.error("Failed to load purchase orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [search]);

  const formatPHP = (cents: number) => {
    return `₱${((cents || 0) / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  };

  const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.totalAmt || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-amber-400" /> Purchase Orders & Performa Invoices
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Manage client purchase orders, corporate performa quotes, itemized procurement costs, and payment tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPurchaseOrders()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/invoices/purchase-orders/new"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-amber-600/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> New Purchase Order
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Total Orders</span>
          <div className="text-2xl font-bold text-white font-mono">{purchaseOrders.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-amber-400 uppercase">Total Procurement Value</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{formatPHP(totalValue)}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Approved / Fulfilled</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {purchaseOrders.filter((p) => p.status === "APPROVED" || p.status === "FULFILLED").length}
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by PO Number (e.g. PO-6820154160), Client name, or Company..."
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
                <th className="px-5 py-3.5">PO Number</th>
                <th className="px-5 py-3.5">Client</th>
                <th className="px-5 py-3.5">Order Date</th>
                <th className="px-5 py-3.5 text-center">Items</th>
                <th className="px-5 py-3.5 text-right">Total Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                    Loading purchase orders...
                  </td>
                </tr>
              ) : purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No purchase orders found. Click "New Purchase Order" to create one.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => {
                  const itemCount = Array.isArray(po.items) ? po.items.length : 0;

                  return (
                    <tr key={po.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-white">
                        {po.poNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{po.client?.name}</div>
                        {po.client?.company && (
                          <div className="text-[11px] text-gray-400 font-light mt-0.5">
                            {po.client.company}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-400">
                        {new Date(po.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-center font-mono text-gray-400">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-gray-300">
                          {itemCount} items
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">
                        {formatPHP(po.totalAmt)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          po.status === "APPROVED" || po.status === "FULFILLED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : po.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/invoices/purchase-orders/${po.id}`}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="View Purchase Order"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/invoices/purchase-orders/${po.id}/print`}
                            target="_blank"
                            className="p-1.5 text-amber-400 hover:text-white hover:bg-amber-600/30 rounded-lg transition-colors"
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
