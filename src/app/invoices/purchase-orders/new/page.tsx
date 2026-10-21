"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Save,
  AlertCircle,
  X,
} from "lucide-react";

interface POItem {
  itemCode: string;
  description: string;
  unitCost: number; // in Pesos
  quantity: number;
  unit: string;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClientId = searchParams.get("clientId");

  const [clients, setClients] = useState<any[]>([]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [clientId, setClientId] = useState(queryClientId || "");
  const [poNumber, setPoNumber] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("Payment Terms: Net 30 days upon delivery and commissioning.");
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [paidAmt, setPaidAmt] = useState<number>(0);

  // Items initialized with realistic values matching sample performa invoice
  const [items, setItems] = useState<POItem[]>([
    {
      itemCode: "IPC-HDW1239T1",
      description: "> 2-MP 1/2.8\" CMOS image sensor, low luminance, and high definition image.\n> Outputs max. 2 MP (1920 × 1080)@25/30 fps.\n> Built-in warm light, max illumination 15 m.\n> Built-in MIC. 12 VDC/PoE. IP67 protection.",
      unitCost: 2150,
      quantity: 13,
      unit: "pcs",
    },
    {
      itemCode: "NVR5232-EI",
      description: "> Supports Smart H.265+, H.265, Smart H.264+ decoding formats.\n> Max. decoding capability: 32 × 1080p@30 fps.\n> Supports IP cameras with a resolution up to 32 MP.\n> AI by Recorder supports 2-channel face detection.",
      unitCost: 17500,
      quantity: 1,
      unit: "unit",
    },
    {
      itemCode: "4TB HDD Skyhawk",
      description: "SkyHawk leverages Seagate's extensive experience in designing drives purpose-built for surveillance applications. 24/7 reliability.",
      unitCost: 14500,
      quantity: 2,
      unit: "pcs",
    },
    {
      itemCode: "Service",
      description: "Mobilization / Demobilization & Engineering Supervision, Labor Installation and Installation, Mounting of Equipment devices, Termination, Testing and Commissioning",
      unitCost: 25550,
      quantity: 1,
      unit: "lot",
    },
    {
      itemCode: "VAT",
      description: "zero rated VaT",
      unitCost: 0,
      quantity: 1,
      unit: "lot",
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
      { itemCode: "", description: "", unitCost: 0, quantity: 1, unit: "pcs" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof POItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + (it.quantity * it.unitCost || 0), 0);
  const taxAmt = Math.round((subtotal * (taxPercent || 0)) / 100);
  const totalAmt = subtotal + taxAmt;
  const balanceDue = Math.max(0, totalAmt - (paidAmt || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    if (items.some((it) => !it.description.trim() && !it.itemCode.trim())) {
      setError("All PO items must have an item name or description");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/documents/purchase-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          poNumber,
          orderDate,
          deliveryDate,
          status,
          notes,
          taxPercent,
          paidAmt,
          items,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create purchase order");
      }

      const created = await res.json();
      router.push(`/invoices/purchase-orders/${created.id}`);
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
            href="/invoices/purchase-orders"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">
              Create Purchase Order / Performa Invoice
            </h1>
            <p className="text-xs text-gray-400 font-light">
              Itemized corporate equipment procurement order, unit costs, tax configuration, and payment terms
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 py-2 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-amber-600/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Purchase Order"}
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
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-gray-300">Select Client *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0a1120] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a1120] text-white">
                  {c.name} {c.company ? `(${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">PO Number (Auto if blank)</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="e.g. 6820154160 or PO-2026-0001"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0a1120] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="FULFILLED">FULFILLED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Expected Delivery Date</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Tax / VAT (%)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={taxPercent}
              onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              placeholder="0 (e.g. Zero-Rated)"
            />
          </div>
        </div>

        {/* PO Line Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif">Order Items & Procurement Costs</h3>
              <p className="text-[11px] text-gray-400">Itemize equipment, technical description, unit price, and quantities</p>
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
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Item Code / Name</span>
                  <input
                    type="text"
                    value={item.itemCode}
                    onChange={(e) => handleItemChange(idx, "itemCode", e.target.value)}
                    placeholder="e.g. IPC-HDW1239T1"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Specifications / Description</span>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="Equipment specifications..."
                    className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 font-light"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto self-center">
                  <div className="w-28 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Unit Cost (₱)</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.unitCost}
                      onChange={(e) => handleItemChange(idx, "unitCost", parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-right font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="w-16 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Qty</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="w-20 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Unit</span>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                      placeholder="pcs, unit, lot"
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="w-28 text-right font-mono font-bold text-white text-xs pt-4 shrink-0">
                    ₱{(item.quantity * item.unitCost || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-20 shrink-0 mt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Payment Terms & Order Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Terms: 50% downpayment upon PO signing, 50% upon turnover."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-gray-400">
              <span>Net / Subtotal:</span>
              <span className="text-white font-semibold">
                ₱{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>VAT / Tax ({taxPercent}%):</span>
              <span className="text-white font-semibold">
                ₱{taxAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2">
              <span>Total Procurement Amount:</span>
              <span className="text-amber-400">
                ₱{totalAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                Paid to Date (₱):
                <input
                  type="number"
                  min="0"
                  value={paidAmt}
                  onChange={(e) => setPaidAmt(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10 text-right text-xs text-white"
                />
              </span>
              <span className="text-emerald-400">
                ₱{(paidAmt || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between font-bold text-sm text-white border-t border-white/10 pt-2">
              <span>Balance Due:</span>
              <span className="text-rose-400">
                ₱{balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
