"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Save,
  AlertCircle,
  X,
} from "lucide-react";

interface DeliveryItem {
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  condition: string;
}

export default function CreateDeliveryNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClientId = searchParams.get("clientId");

  const [clients, setClients] = useState<any[]>([]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [clientId, setClientId] = useState(queryClientId || "");
  const [deliveryNumber, setDeliveryNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [poNumber, setPoNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [deliveredByName, setDeliveredByName] = useState("JAY HENDRIX TOLEDO");
  const [receivedByName, setReceivedByName] = useState("");
  const [notes, setNotes] = useState("");

  // Items initialized empty (no prepopulated data)
  const [items, setItems] = useState<DeliveryItem[]>([
    {
      itemCode: "",
      description: "",
      quantity: 1,
      unit: "pcs",
      condition: "Brand New",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data.clients) {
          setClients(data.clients);
          if (!clientId && data.clients.length > 0) {
            setClientId(data.clients[0].id);
          }
        }
      });

    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setProductItems(data.items);
      });
  }, []);

  const handleAddItem = () => {
    setItems([
      ...items,
      { itemCode: "", description: "", quantity: 1, unit: "pcs", condition: "Brand New" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof DeliveryItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    if (items.some((it) => !it.description.trim() && !it.itemCode.trim())) {
      setError("All delivery items must have an item name or description");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/documents/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          deliveryNumber,
          deliveryDate,
          dueDate,
          poNumber,
          invoiceNumber,
          deliveredByName,
          receivedByName,
          notes,
          items,
          status: "DELIVERED",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create delivery note");
      }

      const created = await res.json();
      router.push(`/invoices/delivery-notes/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/delivery-notes"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">
              Create Delivery Note
            </h1>
            <p className="text-xs text-gray-400 font-light">
              Official dispatch slip for hardware delivery, customer inspection, and turnover acknowledgment
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Delivery Note"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Builder Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-gray-300">Select Client *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0a1120] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a1120] text-white">
                  {c.name} {c.company ? `(${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Delivery Note # (Auto if blank)</label>
            <input
              type="text"
              value={deliveryNumber}
              onChange={(e) => setDeliveryNumber(e.target.value)}
              placeholder="e.g. 0131 or DN-2026-0131"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">PO Number Reference</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="e.g. 6820154160"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Delivery Date</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Invoice Number Ref (Optional)</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="e.g. INV-2026-0001"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Items Schedule */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif">Dispatched Hardware & Goods</h3>
              <p className="text-[11px] text-gray-400">List items, model numbers, and technical specifications for delivery note</p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start gap-3 relative"
              >
                <div className="w-full md:w-44 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Item / Model</span>
                  <input
                    type="text"
                    value={item.itemCode}
                    onChange={(e) => handleItemChange(idx, "itemCode", e.target.value)}
                    placeholder="e.g. Belden CAT6"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Detailed Specifications / Description</span>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="e.g. 7814A 008(GRY) A1000FT 305MTR CAT6 NOT PLENUM 4pair unshielded datatwist (R) 6 Cable"
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 font-light"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto self-center">
                  <div className="w-20 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Qty</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="w-24 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Unit</span>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                      placeholder="roll, pcs, lot"
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-20 shrink-0 mt-5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Signatories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Delivered By (JHXT Representative)</label>
            <input
              type="text"
              value={deliveredByName}
              onChange={(e) => setDeliveredByName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Received By (Client Authorized Name / Title)</label>
            <input
              type="text"
              value={receivedByName}
              onChange={(e) => setReceivedByName(e.target.value)}
              placeholder="e.g. Alvin Lizada (Receiver)"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
