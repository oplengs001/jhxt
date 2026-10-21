"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  UserPlus,
  Package,
  Save,
  Send,
  AlertCircle,
  X,
  Layers,
  Check,
} from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number; // in Pesos
}

const DEFAULT_QUANTITY_TYPES = [
  "pcs",
  "roll",
  "lot",
  "by roll",
  "by pcs",
  "by lot",
  "box",
  "unit",
  "set",
  "meter",
  "node",
  "pack",
  "month",
  "hour",
];

export default function CreateInvoicePage() {
  const router = useRouter();

  // Form State
  const [clients, setClients] = useState<any[]>([]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState(
    "Thank you for choosing JHXTES IT Solutions! Payment is due within 15 days of invoice date."
  );
  const [discountAmt, setDiscountAmt] = useState<number>(0);

  // Custom Quantity Types (persisted for future use)
  const [customUnits, setCustomUnits] = useState<string[]>([]);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitInput, setNewUnitInput] = useState("");
  const [targetRowForUnit, setTargetRowForUnit] = useState<number | null>(null);

  // Line items
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit: "pcs", unitPrice: 0 },
  ]);

  // Saved Items search popup state per row
  const [activeSearchRow, setActiveSearchRow] = useState<number | null>(null);
  const [itemSearchText, setItemSearchText] = useState("");

  // New Client Modal state
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load custom quantity types from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jhxt_custom_quantity_types");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomUnits(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load custom units:", e);
    }
  }, []);

  // Load clients and product items
  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data.clients) {
          setClients(data.clients);
          if (data.clients.length > 0) setClientId(data.clients[0].id);
        }
      });

    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setProductItems(data.items);
          // Auto-harvest any units saved in existing catalog items
          const catalogUnits: string[] = data.items
            .map((it: any) => it.unit?.trim())
            .filter((u: string) => Boolean(u) && !DEFAULT_QUANTITY_TYPES.includes(u));
          if (catalogUnits.length > 0) {
            setCustomUnits((prev) => {
              const merged = Array.from(new Set([...prev, ...catalogUnits]));
              try {
                localStorage.setItem("jhxt_custom_quantity_types", JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        }
      });
  }, []);

  // Compute all available quantity units
  const allQuantityUnits = Array.from(
    new Set([
      ...DEFAULT_QUANTITY_TYPES,
      ...customUnits,
      ...items.map((it) => it.unit).filter(Boolean),
    ])
  );

  const handleAddCustomUnit = (unitToAdd?: string) => {
    const clean = (unitToAdd || newUnitInput).trim();
    if (!clean) return;

    const updated = Array.from(new Set([...customUnits, clean]));
    setCustomUnits(updated);
    try {
      localStorage.setItem("jhxt_custom_quantity_types", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist custom quantity type:", e);
    }

    if (targetRowForUnit !== null && targetRowForUnit !== undefined && items[targetRowForUnit]) {
      handleItemChange(targetRowForUnit, "unit", clean);
    }

    setNewUnitInput("");
    setShowAddUnitModal(false);
    setTargetRowForUnit(null);
  };

  const handleDeleteCustomUnit = (unitToRemove: string) => {
    const updated = customUnits.filter((u) => u !== unitToRemove);
    setCustomUnits(updated);
    try {
      localStorage.setItem("jhxt_custom_quantity_types", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to remove custom unit:", e);
    }
  };

  // Handlers for line items
  const handleAddItemRow = () => {
    setItems([...items, { description: "", quantity: 1, unit: "pcs", unitPrice: 0 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const selectSavedItem = (index: number, product: any) => {
    const updated = [...items];
    const prodUnit = product.unit?.trim() || "pcs";
    if (prodUnit && !DEFAULT_QUANTITY_TYPES.includes(prodUnit) && !customUnits.includes(prodUnit)) {
      handleAddCustomUnit(prodUnit);
    }
    updated[index] = {
      description: product.description || product.name,
      quantity: 1,
      unit: prodUnit,
      unitPrice: product.unitPrice / 100, // convert centavos to Pesos
    };
    setItems(updated);
    setActiveSearchRow(null);
  };

  // Computations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);
  const grandTotal = Math.max(0, subtotal - (discountAmt || 0));

  // Quick Create Client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName,
          company: newClientCompany,
          email: newClientEmail,
          phone: newClientPhone,
          address: newClientAddress,
        }),
      });

      if (res.ok) {
        const newClient = await res.json();
        setClients([newClient, ...clients]);
        setClientId(newClient.id);
        setShowClientModal(false);
        setNewClientName("");
        setNewClientCompany("");
        setNewClientEmail("");
        setNewClientPhone("");
        setNewClientAddress("");
      }
    } catch (err) {
      console.error("Failed to create client:", err);
    }
  };

  // Form Submission
  const handleSubmit = async (targetStatus: "DRAFT" | "SENT") => {
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    if (items.some((it) => !it.description.trim())) {
      setError("All line items must have a description");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          issueDate,
          dueDate,
          notes,
          taxPercent: 0,
          discountAmt,
          items,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create invoice");
      }

      const newInvoice = await res.json();

      if (targetStatus === "SENT") {
        await fetch(`/api/invoices/${newInvoice.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "SENT" }),
        });
      }

      router.push(`/invoices/${newInvoice.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">
              Create New Invoice
            </h1>
            <p className="text-xs text-gray-400 font-light">
              Add line items, pick saved items, and configure tax & terms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit("SENT")}
            disabled={saving}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-xs shadow-lg shadow-[#2563eb]/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Save & Send
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Invoice Builder Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/10 pb-6">
          {/* Client Selector */}
          <div className="space-y-1.5 md:col-span-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-300">Select Client</label>
              <button
                type="button"
                onClick={() => setShowClientModal(true)}
                className="text-[11px] text-[#38bdf8] hover:underline inline-flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" /> + New Client
              </button>
            </div>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
            >
              {clients.length === 0 ? (
                <option value="">No clients found - Add one</option>
              ) : (
                clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0a1120] text-white">
                    {c.name} {c.company ? `(${c.company})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Issue Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Line Items Table with Item Picker and Quantity Types */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif">Line Items</h3>
              <p className="text-[11px] text-gray-400">
                Configure quantity, customizable unit types (e.g. by roll, by pcs, by lot), and pricing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetRowForUnit(null);
                  setShowAddUnitModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-[#38bdf8] font-medium transition-all"
                title="Manage and create custom quantity units"
              >
                <Layers className="w-3.5 h-3.5" /> Manage Quantity Types
              </button>
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1 text-[11px] font-mono uppercase text-gray-400">
            <div className="flex-1">Description / Service</div>
            <div className="w-20 text-center">Qty</div>
            <div className="w-28 text-center">Type / Unit</div>
            <div className="w-32 text-right">Unit Price (₱)</div>
            <div className="w-32 text-right">Line Total</div>
            <div className="w-8"></div>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-3 relative transition-all hover:border-white/20"
              >
                {/* Description & Item Picker */}
                <div className="flex-1 w-full space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 md:hidden font-medium">Description / Service</span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSearchRow(activeSearchRow === idx ? null : idx)
                      }
                      className="text-[11px] text-[#38bdf8] hover:underline inline-flex items-center gap-1 font-medium ml-auto"
                    >
                      <Package className="w-3 h-3" /> Pick Saved Item
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="e.g. Cat6 Cable Drop & Installation (per node)"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                  />

                  {/* Saved Items Popover Dropdown */}
                  {activeSearchRow === idx && (
                    <div className="absolute left-0 top-full mt-1 z-30 w-full max-w-lg bg-[#0a1120] border border-white/15 rounded-xl shadow-2xl p-2 space-y-1">
                      <div className="text-[11px] font-semibold text-gray-400 px-2 py-1 flex items-center justify-between">
                        <span>Select a Product / Service</span>
                        <button
                          onClick={() => setActiveSearchRow(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto divide-y divide-white/5">
                        {productItems.length === 0 ? (
                          <div className="p-3 text-center text-xs text-gray-500">
                            No saved items found. Create items in the "Saved Items" tab.
                          </div>
                        ) : (
                          productItems.map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => selectSavedItem(idx, prod)}
                              className="p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-semibold text-white">{prod.name}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {prod.category && (
                                    <span className="text-[10px] text-[#38bdf8]">
                                      {prod.category}
                                    </span>
                                  )}
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                                    {prod.unit || "pcs"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-emerald-400">
                                  ₱{(prod.unitPrice / 100).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                  })}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  per {prod.unit || "pcs"}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity & Unit Type Wrapper */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {/* Quantity */}
                  <div className="flex-1 md:w-20 space-y-1">
                    <span className="text-[11px] text-gray-400 md:hidden">Qty</span>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-[#2563eb]"
                      placeholder="1"
                    />
                  </div>

                  {/* Unit / Type of Quantity */}
                  <div className="flex-1 md:w-28 space-y-1">
                    <span className="text-[11px] text-gray-400 md:hidden">Type</span>
                    <select
                      value={item.unit || "pcs"}
                      onChange={(e) => {
                        if (e.target.value === "__ADD_NEW__") {
                          setTargetRowForUnit(idx);
                          setShowAddUnitModal(true);
                        } else {
                          handleItemChange(idx, "unit", e.target.value);
                        }
                      }}
                      className="w-full px-2 py-2 rounded-lg bg-[#0a1120] border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] cursor-pointer"
                    >
                      {allQuantityUnits.map((u) => (
                        <option key={u} value={u} className="bg-[#0a1120] text-white">
                          {u}
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="bg-[#1e293b] text-[#38bdf8] font-semibold">
                        + Add Custom...
                      </option>
                    </select>
                  </div>
                </div>

                {/* Unit Price (PHP) */}
                <div className="w-full md:w-32 space-y-1">
                  <span className="text-[11px] text-gray-400 md:hidden">Unit Price (₱)</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-right font-mono focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                {/* Line Total */}
                <div className="w-full md:w-32 text-right font-mono font-bold text-white text-xs py-2 shrink-0">
                  <span className="text-gray-400 font-sans md:hidden text-[11px] mr-2">Total:</span>
                  ₱{(item.quantity * item.unitPrice || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>

                {/* Delete Row Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItemRow(idx)}
                  disabled={items.length === 1}
                  className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-20 shrink-0 self-center"
                  title="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddItemRow}
              className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Another Line Item
            </button>

            <span className="text-[11px] text-gray-400">
              💡 Need a custom unit? Select <span className="text-[#38bdf8] font-medium">+ Add Custom...</span> or click <span className="text-[#38bdf8] font-medium">Manage Quantity Types</span>
            </span>
          </div>
        </div>

        {/* Calculation & Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
          {/* Notes / Terms */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Payment Terms & Notes (Visible on Invoice)
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bank details: BDO Account # 1234-5678-90"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* Totals Breakdown Card */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">
                ₱{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-300">
              <span className="flex items-center gap-1">
                Discount (₱):
                <input
                  type="number"
                  min="0"
                  value={discountAmt}
                  onChange={(e) => setDiscountAmt(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10 text-right text-xs text-white"
                />
              </span>
              <span className="font-mono text-red-400">
                -₱{(discountAmt || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>



            <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-3">
              <span>Grand Total (PHP):</span>
              <span className="text-[#38bdf8] font-mono">
                ₱{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif text-white">Add New Client</h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="billing@acme.com"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="+63 917 000 0000"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium">Billing Address</label>
                <input
                  type="text"
                  placeholder="Tarlac City, Philippines"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Quantity Types Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-white/15 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-white">Quantity Types (Units)</h3>
                  <p className="text-[11px] text-gray-400">Add or manage unit types for line items</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddUnitModal(false);
                  setTargetRowForUnit(null);
                  setNewUnitInput("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions / Examples */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">
                Quick Preset Suggestions (Click to add & select)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {[
                  "by roll",
                  "by pcs",
                  "by lot",
                  "roll",
                  "pcs",
                  "lot",
                  "box",
                  "spool",
                  "bundle",
                  "drum",
                  "set",
                  "meter",
                  "node",
                  "pack",
                  "pair",
                  "license",
                  "session",
                  "hour",
                  "day",
                ]
                  .filter((p) => !allQuantityUnits.includes(p))
                  .map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddCustomUnit(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#2563eb]/20 hover:border-[#2563eb]/40 border border-white/10 text-gray-300 hover:text-white text-xs transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-[#38bdf8]" /> {preset}
                    </button>
                  ))}
              </div>
            </div>

            {/* Add Custom Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCustomUnit();
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-medium text-gray-300">
                  Custom Quantity Type Name
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. by roll, by pcs, by lot, spool, drum"
                    value={newUnitInput}
                    onChange={(e) => setNewUnitInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Type
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  💡 Custom types added here are saved permanently in your browser and will be automatically available for all future invoices.
                </p>
              </div>
            </form>

            {/* Your Custom Types List */}
            {customUnits.length > 0 && (
              <div className="space-y-2 border-t border-white/10 pt-3">
                <span className="text-xs font-medium text-gray-300">
                  Your Custom Added Types ({customUnits.length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {customUnits.map((cu) => (
                    <span
                      key={cu}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-white"
                    >
                      <span>{cu}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomUnit(cu)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title={`Remove "${cu}"`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddUnitModal(false);
                  setTargetRowForUnit(null);
                  setNewUnitInput("");
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
