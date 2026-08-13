"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Target,
  Plus,
  Search,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Mail,
  Phone,
  ArrowRight,
  UserPlus,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function LeadsDashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [salesReps, setSalesReps] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assignedToFilter, setAssignedToFilter] = useState("ALL");

  // New Lead Modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [source, setSource] = useState("Website Inquiry");
  const [valueEstimate, setValueEstimate] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [initialNote, setInitialNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user me:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setSalesReps(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (assignedToFilter !== "ALL") params.append("assignedToId", assignedToFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, assignedToFilter, search]);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleOpenModal = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setAddress("");
    setSource("Website Inquiry");
    setValueEstimate("");
    setAssignedToId(currentUser?.userId || "");
    setInitialNote("");
    setError("");
    setShowModal(true);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Lead contact name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          address,
          source,
          valueEstimate,
          assignedToId: assignedToId || currentUser?.userId,
          initialNote,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create lead");
      }

      setShowModal(false);
      fetchLeads();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "WON":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "NEGOTIATING":
        return "bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20";
      case "PROPOSAL_SENT":
        return "bg-purple-500/10 text-purple-300 border-purple-500/20";
      case "QUALIFIED":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
      case "CONTACTED":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      case "LOST":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/20";
    }
  };

  const formatPHP = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format((cents || 0) / 100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-[#38bdf8]" /> Sales Leads CRM
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            {currentUser?.role === "ADMIN"
              ? "Admin View — Showing leads across all sales representatives"
              : `Sales Rep View — Showing leads assigned to ${currentUser?.name}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLeads()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-xs shadow-lg shadow-[#2563eb]/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Lead
          </button>
        </div>
      </div>

      {/* KPI Pipeline Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Total Pipeline Value</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              ₱{metrics.totalPipelineValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-gray-500">Estimated value across active pipeline</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Total Active Leads</span>
              <Target className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="text-xl font-bold text-[#38bdf8] tracking-tight">
              {metrics.totalLeads}
            </div>
            <div className="text-[10px] text-gray-500">Leads assigned in pipeline</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>New Enquiries</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-400 tracking-tight">
              {metrics.newCount}
            </div>
            <div className="text-[10px] text-purple-500/70">Awaiting initial contact</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Won Deals</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 tracking-tight">
              {metrics.wonCount}
            </div>
            <div className="text-[10px] text-emerald-500/70">Converted into active clients</div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: "All Leads" },
            { id: "NEW", label: "New" },
            { id: "CONTACTED", label: "Contacted" },
            { id: "QUALIFIED", label: "Qualified" },
            { id: "PROPOSAL_SENT", label: "Proposal Sent" },
            { id: "NEGOTIATING", label: "Negotiating" },
            { id: "WON", label: "Won" },
            { id: "LOST", label: "Lost" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                statusFilter === tab.id
                  ? "bg-[#2563eb] text-white font-semibold shadow-md shadow-[#2563eb]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Rep Filter for Admin */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {currentUser?.role === "ADMIN" && (
            <select
              value={assignedToFilter}
              onChange={(e) => setAssignedToFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
            >
              <option value="ALL" className="bg-[#0a1120]">All Sales Reps</option>
              {salesReps.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#0a1120]">
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search lead name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Lead Contact & Company</th>
                <th className="px-5 py-3.5">Source</th>
                <th className="px-5 py-3.5">Assigned Rep</th>
                <th className="px-5 py-3.5 text-right">Est. Value (PHP)</th>
                <th className="px-5 py-3.5 text-center">Pipeline Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#38bdf8]" />
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No sales leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = `/invoices/leads/${lead.id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{lead.name}</div>
                      {lead.company && (
                        <div className="text-[11px] text-[#38bdf8] font-light">
                          {lead.company}
                        </div>
                      )}
                      {lead.email && (
                        <div className="text-[10px] text-gray-400 truncate">{lead.email}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-400">
                      {lead.source || "Website"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-200">{lead.assignedTo?.name}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-white font-mono">
                      {formatPHP(lead.valueEstimate)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/invoices/leads/${lead.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-[#38bdf8] hover:text-white font-medium transition-colors"
                      >
                        Open Lead <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif text-white">Add New Sales Lead</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Central Mall Tarlac"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    placeholder="msantos@mall.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-medium">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+63 920 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium">Lead Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                  >
                    <option value="Website Inquiry" className="bg-[#0a1120]">Website Inquiry</option>
                    <option value="Site Survey Request" className="bg-[#0a1120]">Site Survey Request</option>
                    <option value="Referral" className="bg-[#0a1120]">Client Referral</option>
                    <option value="Cold Outreach" className="bg-[#0a1120]">Cold Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium">Est. Value (PHP)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="150000"
                    value={valueEstimate}
                    onChange={(e) => setValueEstimate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1 font-mono"
                  />
                </div>
              </div>

              {currentUser?.role === "ADMIN" && (
                <div>
                  <label className="text-gray-300 font-medium">Assign Sales Rep</label>
                  <select
                    value={assignedToId}
                    onChange={(e) => setAssignedToId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                  >
                    {salesReps.map((r) => (
                      <option key={r.id} value={r.id} className="bg-[#0a1120]">
                        {r.name} ({r.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-gray-300 font-medium">Initial Activity Note</label>
                <textarea
                  rows={2}
                  placeholder="Record initial discussion details or client requirements..."
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
