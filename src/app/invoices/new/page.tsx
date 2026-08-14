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
} from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number; // in Pesos
}

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

  // Line items
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
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
        if (data.items) setProductItems(data.items);
      });
  }, []);

  // Handlers for line items
  const handleAddItemRow = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
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
    updated[index] = {
      description: product.description || product.name,
      quantity: 1,
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

        {/* Line Items Table with Item Picker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-serif">Line Items</h3>
            <span className="text-[11px] text-gray-400">
              💡 Tip: Click <span className="text-[#38bdf8]">Pick Saved Item</span> to load pre-configured products/services
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-3 relative"
              >
                {/* Description & Item Picker */}
                <div className="flex-1 w-full space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Description / Service</span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSearchRow(activeSearchRow === idx ? null : idx)
                      }
                      className="text-[11px] text-[#38bdf8] hover:underline inline-flex items-center gap-1 font-medium"
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
                                {prod.category && (
                                  <span className="text-[10px] text-[#38bdf8]">
                                    {prod.category}
                                  </span>
                                )}
                              </div>
                              <div className="font-mono font-bold text-emerald-400">
                                ₱{(prod.unitPrice / 100).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="w-full md:w-24 space-y-1">
                  <span className="text-[11px] text-gray-400 md:hidden">Qty</span>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                {/* Unit Price (PHP) */}
                <div className="w-full md:w-36 space-y-1">
                  <span className="text-[11px] text-gray-400 md:hidden">Unit Price (₱)</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-right focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                {/* Line Total */}
                <div className="w-full md:w-36 text-right font-mono font-bold text-white text-xs py-2 shrink-0">
                  ₱{(item.quantity * item.unitPrice || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>

                {/* Delete Row Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveItemRow(idx)}
                  disabled={items.length === 1}
                  className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-20 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddItemRow}
            className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-semibold pt-1"
          >
            <Plus className="w-4 h-4" /> Add Another Line Item
          </button>
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
    </div>
  );
}
