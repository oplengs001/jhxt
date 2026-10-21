"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  ShieldCheck,
  Truck,
  ClipboardList,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Printer,
  ArrowRight,
} from "lucide-react";

function ClientsManagementContent() {
  const searchParams = useSearchParams();
  const initialClientId = searchParams.get("clientId");

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId);
  const [selectedClientDetails, setSelectedClientDetails] = useState<any | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [activeDocTab, setActiveDocTab] = useState<"ALL" | "INVOICES" | "WARRANTY" | "DELIVERY" | "PO">("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchClients = async () => {
    setLoadingList(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/clients?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.clients || [];
        setClients(list);

        if (!selectedClientId && list.length > 0) {
          setSelectedClientId(list[0].id);
        } else if (selectedClientId && !list.some((c: any) => c.id === selectedClientId) && list.length > 0) {
          setSelectedClientId(list[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  // Load single client with all documents whenever selectedClientId changes
  useEffect(() => {
    if (!selectedClientId) {
      setSelectedClientDetails(null);
      return;
    }

    setLoadingDetails(true);
    fetch(`/api/clients/${selectedClientId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load client details");
        return res.json();
      })
      .then((data) => {
        setSelectedClientDetails(data);
      })
      .catch((err) => {
        console.error("Error fetching client details:", err);
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, [selectedClientId]);

  const handleOpenAddModal = () => {
    setEditId(null);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setAddress("");
    setError("");
    setShowModal(true);
  };

  const handleOpenEditModal = (c: any) => {
    setEditId(c.id);
    setName(c.name);
    setCompany(c.company || "");
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setAddress(c.address || "");
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Client name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = editId ? `/api/clients/${editId}` : "/api/clients";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, phone, address }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save client");
      }

      const saved = await res.json();
      setShowModal(false);
      await fetchClients();
      if (!editId) {
        setSelectedClientId(saved.id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatPHP = (cents: number) => {
    return `₱${((cents || 0) / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  };

  const client = selectedClientDetails;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#38bdf8]" /> Client Management & Document Center
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Select any client to view their complete dossier and generate Invoices, Warranties, Delivery Notes & Purchase Orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchClients()}
            disabled={loadingList}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loadingList ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-xs shadow-lg shadow-[#2563eb]/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Client
          </button>
        </div>
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client Selector List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
            />
          </div>

          {/* Client List Cards */}
          <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {loadingList && clients.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#38bdf8]" />
                Loading clients...
              </div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 glass-panel rounded-2xl border border-white/10">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                No clients found. Click "+ Add New Client" to create one.
              </div>
            ) : (
              clients.map((c) => {
                const isSelected = c.id === selectedClientId;
                const totalDocs =
                  (c._count?.invoices || 0) +
                  (c._count?.warrantyCertificates || 0) +
                  (c._count?.deliveryNotes || 0) +
                  (c._count?.purchaseOrders || 0);

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClientId(c.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-gradient-to-r from-[#2563eb]/20 to-[#06b6d4]/10 border-[#38bdf8] shadow-lg shadow-[#2563eb]/10"
                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs truncate">
                            {c.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#38bdf8] shrink-0" />
                          )}
                        </div>
                        {c.company && (
                          <div className="text-[11px] text-gray-300 flex items-center gap-1 truncate font-medium">
                            <Building className="w-3 h-3 text-[#38bdf8] shrink-0" />
                            <span className="truncate">{c.company}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-white/10 text-[#38bdf8]">
                          {totalDocs} docs
                        </span>
                      </div>
                    </div>

                    {/* Document mini pills */}
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5 text-[9px] font-mono text-gray-400">
                      <span>Inv: {c._count?.invoices || 0}</span>
                      <span>•</span>
                      <span>War: {c._count?.warrantyCertificates || 0}</span>
                      <span>•</span>
                      <span>DN: {c._count?.deliveryNotes || 0}</span>
                      <span>•</span>
                      <span>PO: {c._count?.purchaseOrders || 0}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Client Hub & Generator */}
        <div className="lg:col-span-8">
          {loadingDetails && !client ? (
            <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-xs text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#38bdf8]" />
              Loading client file...
            </div>
          ) : !client ? (
            <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-xs text-gray-400 space-y-3">
              <Users className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-base font-semibold text-white">Select a Client</h3>
              <p className="max-w-md mx-auto text-gray-400">
                Choose a client from the list on the left to generate Invoices, Warranty Certificates, Delivery Notes, and Purchase Orders.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Client Profile Header Card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold font-serif text-white tracking-tight">
                        {client.name}
                      </h2>
                      {client.company && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 flex items-center gap-1">
                          <Building className="w-3 h-3" /> {client.company}
                        </span>
                      )}
                    </div>
                    {client.address && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-light">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        {client.address}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(client)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Info
                    </button>
                  </div>
                </div>

                {/* Contact info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-gray-400">Email Address</span>
                    <div className="font-medium text-white flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                      <span className="truncate">{client.email || "No email provided"}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-gray-400">Phone Number</span>
                    <div className="font-mono text-white flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                      <span className="truncate">{client.phone || "No phone provided"}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-gray-400">Client Since</span>
                    <div className="font-mono text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                      <span>{new Date(client.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                {/* Document Generation Action Bar */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono uppercase text-gray-400 font-semibold tracking-wider">
                    ⚡ Generate Official Documents for this Client:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-2.5">
                    {/* 1. Generate Warranty Certificate & Completion Note */}
                    <Link
                      href={`/invoices/warranty/new?clientId=${client.id}`}
                      className="p-3 rounded-xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 hover:border-indigo-400 text-left transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex items-center justify-between text-indigo-400 mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-xs font-semibold text-white">Warranty & Turnover</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">With serial inventory</div>
                    </Link>

                    {/* 2. Generate Delivery Note */}
                    <Link
                      href={`/invoices/delivery-notes/new?clientId=${client.id}`}
                      className="p-3 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex items-center justify-between text-emerald-400 mb-1">
                        <Truck className="w-4 h-4" />
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-xs font-semibold text-white">Delivery Note</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Equipment dispatch</div>
                    </Link>

                    {/* 3. Generate Purchase Order */}
                    <Link
                      href={`/invoices/purchase-orders/new?clientId=${client.id}`}
                      className="p-3 rounded-xl bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30 hover:border-amber-400 text-left transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex items-center justify-between text-amber-400 mb-1">
                        <ClipboardList className="w-4 h-4" />
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-xs font-semibold text-white">Purchase Order</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">PO & Proforma</div>
                    </Link>

                    {/* 4. Generate Invoice */}
                    <Link
                      href={`/invoices/new?clientId=${client.id}`}
                      className="p-3 rounded-xl bg-gradient-to-br from-sky-900/40 to-cyan-900/40 border border-sky-500/30 hover:border-sky-400 text-left transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex items-center justify-between text-[#38bdf8] mb-1">
                        <FileText className="w-4 h-4" />
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-xs font-semibold text-white">Tax Invoice</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Billing & payment</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Document History Section */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {[
                      { id: "ALL", label: "All Docs", count: (client.invoices?.length || 0) + (client.warrantyCertificates?.length || 0) + (client.deliveryNotes?.length || 0) + (client.purchaseOrders?.length || 0) },
                      { id: "INVOICES", label: "Invoices", count: client.invoices?.length || 0 },
                      { id: "WARRANTY", label: "Warranty & Turnover", count: client.warrantyCertificates?.length || 0 },
                      { id: "DELIVERY", label: "Delivery Notes", count: client.deliveryNotes?.length || 0 },
                      { id: "PO", label: "Purchase Orders", count: client.purchaseOrders?.length || 0 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveDocTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          activeDocTab === tab.id
                            ? "bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 font-mono">
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab 1: Invoices */}
                {(activeDocTab === "ALL" || activeDocTab === "INVOICES") && client.invoices?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono text-gray-400 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#38bdf8]" /> Invoices ({client.invoices.length})
                    </h4>
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
                      {client.invoices.map((inv: any) => (
                        <div key={inv.id} className="p-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{inv.invoiceNumber}</span>
                              <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold border ${
                                inv.status === "PAID"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : inv.status === "SENT"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 font-light">
                              Due: {new Date(inv.dueDate).toLocaleDateString()} • {inv.items?.length || 0} line items
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">{formatPHP(inv.totalAmt)}</span>
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/invoices/${inv.id}`}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="View Invoice"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                href={`/invoices/${inv.id}/print`}
                                target="_blank"
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Print Invoice"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Warranty & Turnover Certificates */}
                {(activeDocTab === "ALL" || activeDocTab === "WARRANTY") && client.warrantyCertificates?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono text-gray-400 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Warranty Certificates & Turnover ({client.warrantyCertificates.length})
                    </h4>
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
                      {client.warrantyCertificates.map((cert: any) => (
                        <div key={cert.id} className="p-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{cert.refNumber}</span>
                              {cert.docNumberCOC && (
                                <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                                  {cert.docNumberCOC}
                                </span>
                              )}
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {cert.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 font-light">
                              Project: {cert.projectName || "CCTV Hardware Supply"} • Valid until {new Date(cert.validUntil).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/invoices/warranty/${cert.id}`}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View
                            </Link>
                            <Link
                              href={`/invoices/warranty/${cert.id}/print`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="Print Certificate"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Delivery Notes */}
                {(activeDocTab === "ALL" || activeDocTab === "DELIVERY") && client.deliveryNotes?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono text-gray-400 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" /> Delivery Notes ({client.deliveryNotes.length})
                    </h4>
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
                      {client.deliveryNotes.map((dn: any) => (
                        <div key={dn.id} className="p-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{dn.deliveryNumber}</span>
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {dn.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 font-light">
                              Delivered on: {new Date(dn.deliveryDate).toLocaleDateString()} • {Array.isArray(dn.items) ? dn.items.length : 0} items
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/invoices/delivery-notes/${dn.id}`}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-medium flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View
                            </Link>
                            <Link
                              href={`/invoices/delivery-notes/${dn.id}/print`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="Print Delivery Note"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Purchase Orders */}
                {(activeDocTab === "ALL" || activeDocTab === "PO") && client.purchaseOrders?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono text-gray-400 flex items-center gap-2">
                      <ClipboardList className="w-3.5 h-3.5 text-amber-400" /> Purchase Orders & Proforma ({client.purchaseOrders.length})
                    </h4>
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
                      {client.purchaseOrders.map((po: any) => (
                        <div key={po.id} className="p-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{po.poNumber}</span>
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                {po.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 font-light">
                              Date: {new Date(po.orderDate).toLocaleDateString()} • {Array.isArray(po.items) ? po.items.length : 0} items
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono font-bold text-white">{formatPHP(po.totalAmt)}</span>
                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/invoices/purchase-orders/${po.id}`}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-medium flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" /> View
                              </Link>
                              <Link
                                href={`/invoices/purchase-orders/${po.id}/print`}
                                target="_blank"
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Print PO"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State when no documents exist */}
                {(!client.invoices?.length && !client.warrantyCertificates?.length && !client.deliveryNotes?.length && !client.purchaseOrders?.length) && (
                  <div className="py-12 text-center text-xs text-gray-500 space-y-3">
                    <FileText className="w-8 h-8 text-gray-600 mx-auto" />
                    <p>No documents generated for this client yet.</p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Link
                        href={`/invoices/warranty/new?clientId=${client.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs"
                      >
                        Create Warranty Note
                      </Link>
                      <Link
                        href={`/invoices/new?clientId=${client.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#2563eb] hover:bg-blue-500 text-white font-medium text-xs"
                      >
                        Create Invoice
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif text-white">
                {editId ? "Edit Client Info" : "Add New Client"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Client / Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wilmar Edible Oils Philippines Inc."
                  value={company}
                  onChange={(e) => setNewCompanyOr(setCompany, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="billing@wilmar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="+63 917 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Complete Business / Site Address</label>
                <input
                  type="text"
                  placeholder="12th Floor, LKG Tower, 6801 Ayala Ave, Makati City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
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
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Save Changes" : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientsManagementPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-400">Loading client directory...</div>}>
      <ClientsManagementContent />
    </Suspense>
  );
}

function setNewCompanyOr(setter: (v: string) => void, val: string) {
  setter(val);
}

