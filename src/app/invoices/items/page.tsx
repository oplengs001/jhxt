"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle,
  X,
  AlertCircle,
  Tag,
} from "lucide-react";

export default function SavedItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Add/Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ includeInactive: "true" });
      if (search.trim()) params.append("search", search.trim());
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);

      const res = await fetch(`/api/items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to load product items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, categoryFilter]);

  const handleOpenAddModal = () => {
    setEditId(null);
    setName("");
    setDescription("");
    setUnitPrice("");
    setUnit("pcs");
    setCategory("");
    setError("");
    setShowModal(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditId(item.id);
    setName(item.name);
    setDescription(item.description || "");
    setUnitPrice((item.unitPrice / 100).toString());
    setUnit(item.unit || "pcs");
    setCategory(item.category || "");
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Item name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = editId ? `/api/items/${editId}` : "/api/items";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          unitPrice: parseFloat(unitPrice) || 0,
          unit,
          category,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save item");
      }

      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      fetchItems();
    } catch (err) {
      console.error("Failed to toggle item status:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-[#38bdf8]" /> Saved Items Catalog
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Configure reusable product & service templates for invoice line items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchItems()}
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
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              categoryFilter === "ALL"
                ? "bg-[#2563eb] text-white font-semibold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                categoryFilter === cat
                  ? "bg-[#2563eb] text-white font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search item name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Product Items Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item Name & Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Unit</th>
                <th className="px-5 py-3.5 text-right">Default Price (PHP)</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#38bdf8]" />
                    Loading saved items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No saved items found. Click "Add New Item" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-white/5 transition-colors ${
                      !item.isActive ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-gray-400 font-light max-w-md line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {item.category ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                          <Tag className="w-3 h-3" /> {item.category}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-gray-400">
                      {item.unit || "pcs"}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-white font-mono">
                      ₱{(item.unitPrice / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          item.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Item"
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

      {/* Add / Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif text-white">
                {editId ? "Edit Saved Item" : "Add Saved Item"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
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
                <label className="text-gray-300 font-medium">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IP Camera – 4MP Dahua Dome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Category</label>
                <input
                  type="text"
                  placeholder="e.g. CCTV & Surveillance, Structured Cabling"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium">Unit Price (PHP) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="4500.00"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-medium">Unit Type</label>
                  <input
                    type="text"
                    placeholder="pcs, node, unit, month, box"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium">Full Line Item Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description auto-filled into invoice rows when selected..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {saving ? "Saving..." : "Save Product Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
