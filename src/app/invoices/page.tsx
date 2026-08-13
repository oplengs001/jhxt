"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowRight,
  Eye,
  MoreVertical,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function InvoicesDashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/invoices?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
        setTotal(data.total || 0);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== "PAID" && status !== "CANCELLED";
    const displayStatus = isOverdue ? "OVERDUE" : status;

    switch (displayStatus) {
      case "PAID":
        return {
          label: "Paid",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "PARTIAL":
        return {
          label: "Partial",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "SENT":
        return {
          label: "Sent",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
      case "OVERDUE":
        return {
          label: "Overdue",
          color: "bg-red-500/10 text-red-400 border-red-500/20",
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        };
      default:
        return {
          label: "Draft",
          color: "bg-slate-500/10 text-slate-300 border-slate-500/20",
        };
    }
  };

  const formatPHP = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#38bdf8]" /> Invoice Dashboard
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Manage billing, line items, payments, and client invoice status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInvoices()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-xs shadow-lg shadow-[#2563eb]/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Create New Invoice
          </Link>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Total Invoiced</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              ₱{metrics.totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-gray-500">Gross billing across active invoices</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Total Collected</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 tracking-tight">
              ₱{metrics.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-500/70">Verified manual payments recorded</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Outstanding Balance</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400 tracking-tight">
              ₱{metrics.totalOutstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-amber-500/70">Pending & unpaid invoices</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Overdue Invoices</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-xl font-bold text-red-400 tracking-tight">
              {metrics.overdueCount}
            </div>
            <div className="text-[10px] text-red-500/70">Requires payment follow-up</div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {["ALL", "DRAFT", "SENT", "PAID", "PARTIAL", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-[#2563eb] text-white font-semibold shadow-md shadow-[#2563eb]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {st === "ALL" ? "All Invoices" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search invoice # or client..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] transition-all placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Invoice Data Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Client / Company</th>
                <th className="px-5 py-3.5">Issue Date</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5 text-right">Amount (PHP)</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#38bdf8]" />
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No invoices found matching your filters.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const badge = getStatusBadge(inv.status, inv.dueDate);
                  const totalPaid = inv.payments?.reduce((s: number, p: any) => s + p.amountPaid, 0) || 0;

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => (window.location.href = `/invoices/${inv.id}`)}
                    >
                      <td className="px-5 py-4 font-mono font-semibold text-[#38bdf8]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{inv.client?.name}</div>
                        {inv.client?.company && (
                          <div className="text-[11px] text-gray-400 font-light">
                            {inv.client.company}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-mono">
                        {format(new Date(inv.issueDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-mono">
                        {format(new Date(inv.dueDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-white font-mono">
                        {formatPHP(inv.totalAmt)}
                        {totalPaid > 0 && totalPaid < inv.totalAmt && (
                          <div className="text-[10px] text-emerald-400 font-normal">
                            Paid: {formatPHP(totalPaid)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/invoices/${inv.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-[#38bdf8] hover:text-white font-medium transition-colors"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>
              Page {page} of {totalPages} ({total} invoices total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
