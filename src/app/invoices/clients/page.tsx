"use client";

import React, { useState, useEffect } from "react";
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
  X,
  AlertCircle,
  Edit2,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/clients?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

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

      setShowModal(false);
      fetchClients();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#38bdf8]" /> Client Management
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Manage your billing contacts, companies, addresses, and invoice history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchClients()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-xs shadow-lg shadow-[#2563eb]/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Client
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search client name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Client Name</th>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5 text-center">Invoices</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#38bdf8]" />
                    Loading clients...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No clients found. Click "Add New Client" to create one.
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      {c.name}
                      {c.address && (
                        <div className="text-[11px] text-gray-400 font-light flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-500" /> {c.address}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-300">
                      {c.company ? (
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-[#38bdf8]" /> {c.company}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {c.email ? (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-400" /> {c.email}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-gray-400">
                      {c.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {c.phone}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center font-mono">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {c._count?.invoices || 0} Invoices
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Client"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Commercial Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="billing@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="+63 917 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Full Address</label>
                <textarea
                  rows={2}
                  placeholder="123 Tech Park, Tarlac City, Philippines"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  {saving ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
