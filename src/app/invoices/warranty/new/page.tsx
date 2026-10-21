"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  FileCheck2,
  Loader2,
  AlertCircle,
  FileText,
  Cpu,
  Layers,
  CheckCircle,
  ClipboardPaste,
  X,
} from "lucide-react";
import { DeviceColumn, countColumnSerials } from "@/lib/serials";

interface EquipmentItem {
  description: string;
  quantity: number;
  unit: string;
  coverage: string;
  condition: string;
  status: string;
}

export default function CreateWarrantyCertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClientId = searchParams.get("clientId");

  const [clients, setClients] = useState<any[]>([]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [clientId, setClientId] = useState(queryClientId || "");
  const [projectName, setProjectName] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [docNumberCOC, setDocNumberCOC] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [coveragePeriod, setCoveragePeriod] = useState("1-Year Standard Hardware Warranty");
  const [issuedByName, setIssuedByName] = useState("JAY HENDRIX TOLEDO");
  const [issuedByTitle, setIssuedByTitle] = useState("Lead Technical Representative");
  const [clientRepName, setClientRepName] = useState("Authorized Representative");

  // Equipment List - starts clean with 1 empty item
  const [items, setItems] = useState<EquipmentItem[]>([
    { description: "", quantity: 1, unit: "Pc", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
  ]);

  // Fully Customizable Device Serial Inventory
  const [serialSubtitle, setSerialSubtitle] = useState("HARDWARE & EQUIPMENT ASSET REGISTER");
  const [columns, setColumns] = useState<DeviceColumn[]>([
    { id: "col_1", label: "Camera Serial Number" },
    { id: "col_2", label: "4TB HDD Serial Number" },
    { id: "col_3", label: "NVR Serial Number" },
  ]);

  // Serial rows - start clean with empty inputs
  const [serialRows, setSerialRows] = useState<Array<Record<string, string>>>([
    { col_1: "", col_2: "", col_3: "" },
  ]);

  // Bulk paste modal state
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkColId, setBulkColId] = useState("col_1");
  const [bulkText, setBulkText] = useState("");

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

  // Handlers for equipment
  const handleAddItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unit: "Pc", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setItems([{ description: "", quantity: 1, unit: "Pc", coverage: "1 Year Standard", condition: "Brand New", status: "Active" }]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof EquipmentItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Dynamic Column Handlers
  const handleAddColumn = () => {
    const newId = `col_${Date.now()}`;
    const nextColNum = columns.length + 1;
    setColumns([...columns, { id: newId, label: `Device ${nextColNum} Serial` }]);
    setSerialRows(serialRows.map((r) => ({ ...r, [newId]: "" })));
  };

  const handleRemoveColumn = (colId: string) => {
    if (columns.length <= 1) {
      alert("At least one serial column is required.");
      return;
    }
    setColumns(columns.filter((c) => c.id !== colId));
    setSerialRows(
      serialRows.map((r) => {
        const copy = { ...r };
        delete copy[colId];
        return copy;
      })
    );
  };

  const handleColumnLabelChange = (colId: string, newLabel: string) => {
    setColumns(columns.map((c) => (c.id === colId ? { ...c, label: newLabel } : c)));
  };

  // Dynamic Row Handlers
  const handleAddSerialRow = (count = 1) => {
    const emptyRow: Record<string, string> = {};
    columns.forEach((c) => (emptyRow[c.id] = ""));
    const newRows = Array.from({ length: count }, () => ({ ...emptyRow }));
    setSerialRows([...serialRows, ...newRows]);
  };

  const handleRemoveSerialRow = (index: number) => {
    if (serialRows.length <= 1) {
      const emptyRow: Record<string, string> = {};
      columns.forEach((c) => (emptyRow[c.id] = ""));
      setSerialRows([emptyRow]);
      return;
    }
    setSerialRows(serialRows.filter((_, i) => i !== index));
  };

  const handleCellChange = (rowIndex: number, colId: string, val: string) => {
    const updated = [...serialRows];
    updated[rowIndex] = { ...updated[rowIndex], [colId]: val };
    setSerialRows(updated);
  };

  // Bulk Paste Handler
  const handleApplyBulkPaste = () => {
    const lines = bulkText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setShowBulkPaste(false);
      return;
    }

    const updated = [...serialRows];
    while (updated.length < lines.length) {
      const emptyRow: Record<string, string> = {};
      columns.forEach((c) => (emptyRow[c.id] = ""));
      updated.push(emptyRow);
    }

    lines.forEach((lineVal, idx) => {
      updated[idx] = { ...updated[idx], [bulkColId]: lineVal };
    });

    setSerialRows(updated);
    setBulkText("");
    setShowBulkPaste(false);
  };

  // Computed KPI counts
  const columnCounts = countColumnSerials(columns, serialRows);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    const validItems = items.filter((it) => it.description.trim().length > 0);
    if (validItems.length === 0) {
      setError("Please add at least one equipment item description");
      return;
    }

    // Filter serial rows that have at least one non-empty value
    const validRows = serialRows.filter((r) =>
      Object.values(r).some((v) => v && String(v).trim().length > 0)
    );

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/documents/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          refNumber: refNumber.trim() || undefined,
          docNumberCOC: docNumberCOC.trim() || undefined,
          projectName: projectName.trim() || "Hardware Supply & IT Equipment",
          issueDate,
          validUntil,
          coveragePeriod,
          status: "Active",
          issuedByName,
          issuedByTitle,
          clientRepName,
          items: validItems,
          serials: {
            subtitle: serialSubtitle.trim(),
            columns,
            rows: validRows,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create warranty certificate");
      }

      const created = await res.json();
      router.push(`/invoices/warranty/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to save certificate");
      setSaving(false);
    }
  };

  const selectedClient = clients.find((c) => c.id === clientId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/warranty"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" /> New Warranty & Turnover Certificate
            </h1>
            <p className="text-xs text-gray-400">
              Generate Official Hardware Supply Warranty, Delivery & Turnover Certificate, and Asset Register
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Document...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save & Generate Document
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Sheet */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-8">
        
        {/* Section 1: Client & Document Metadata */}
        <div>
          <h3 className="text-sm font-semibold text-white font-serif mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" /> Client & Reference Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Client Selector */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Select Client <span className="text-red-400">*</span>
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="" disabled className="bg-slate-900">
                  Select a client...
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name} {c.company ? `(${c.company})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Project Scope / Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. CCTV Hardware Supply or Structured Cabling"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Warranty Ref Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Warranty Ref No. (Optional)
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g. WC-2026-1001 (auto-generated if empty)"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Turnover Doc Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Turnover Doc No. (Optional)
              </label>
              <input
                type="text"
                value={docNumberCOC}
                onChange={(e) => setDocNumberCOC(e.target.value)}
                placeholder="e.g. COC-2026-1001 (auto-generated if empty)"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Coverage Period text */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Coverage Term
              </label>
              <input
                type="text"
                value={coveragePeriod}
                onChange={(e) => setCoveragePeriod(e.target.value)}
                placeholder="1-Year Standard Hardware Warranty"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Issue Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Valid Until */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Supplied Equipment Schedule */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Supplied Equipment Schedule
              </h3>
              <p className="text-[11px] text-gray-400">
                List the hardware components, quantities, and turnover condition
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium border border-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Equipment Item
            </button>
          </div>

          <div className="space-y-3">
            <div className="hidden md:flex items-center gap-3 px-3 text-[11px] font-mono text-gray-400 uppercase">
              <div className="w-8 text-center">#</div>
              <div className="flex-1">Equipment Description / Hardware Specs</div>
              <div className="w-20 text-center">Qty</div>
              <div className="w-24 text-center">Unit</div>
              <div className="w-28 text-center">Condition</div>
              <div className="w-10"></div>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-8 text-center font-mono text-xs text-gray-500 shrink-0 hidden md:block">
                  {idx + 1}
                </div>

                <div className="flex-1 w-full space-y-1">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="e.g. Dahua IPC-HDBW2230-S-S2 or MikroTik CCR2004 Router"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="w-20 space-y-1">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="w-24 space-y-1">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                      placeholder="Pc/Pcs/Roll"
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="w-28 space-y-1">
                    <input
                      type="text"
                      value={item.condition}
                      onChange={(e) => handleItemChange(idx, "condition", e.target.value)}
                      placeholder="Brand New"
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2 text-gray-500 hover:text-red-400 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Fully Customizable Device Serial Inventory */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38bdf8]" /> Device Serial Number Inventory
              </h3>
              <p className="text-[11px] text-gray-400">
                Fully customizable cross-reference serial register. Add, rename, or remove device columns as required by project scope.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowBulkPaste(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium border border-white/10 transition-all cursor-pointer"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-[#38bdf8]" /> Paste Serials
              </button>
              <button
                type="button"
                onClick={handleAddColumn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] text-xs font-medium border border-[#38bdf8]/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Device Column
              </button>
            </div>
          </div>

          {/* Subtitle customizer */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
            <span className="text-gray-400 font-mono text-[11px] uppercase shrink-0">Inventory Subtitle:</span>
            <input
              type="text"
              value={serialSubtitle}
              onChange={(e) => setSerialSubtitle(e.target.value)}
              placeholder="e.g. SURVEILLANCE & STORAGE HARDWARE ASSET REGISTER"
              className="w-full max-w-lg px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Dynamic KPI indicators for each column */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {columns.map((col) => (
              <span
                key={col.id}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-mono font-semibold"
              >
                {col.label}: <strong className="text-white">{columnCounts[col.id] || 0}</strong>
              </span>
            ))}
          </div>

          {/* Bulk Paste Dialog */}
          {showBulkPaste && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ClipboardPaste className="w-4 h-4 text-[#38bdf8]" /> Bulk Paste Serial Numbers
                </span>
                <button
                  type="button"
                  onClick={() => setShowBulkPaste(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-gray-300">
                Paste a column of serial numbers (one per line) from your barcode scanner, spreadsheet, or packing slip.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="w-full sm:w-64 space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Target Device Column</label>
                  <select
                    value={bulkColId}
                    onChange={(e) => setBulkColId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-white text-xs"
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="AM0D543PAGOODDE&#10;AM0D543PAG8EAED&#10;AM0D543PAG76FBD..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-white text-xs font-mono placeholder:text-gray-600 focus:outline-none focus:border-[#38bdf8]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkPaste(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyBulkPaste}
                  className="px-4 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow"
                >
                  Apply Serials to {columns.find((c) => c.id === bulkColId)?.label}
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Cross-Reference Table */}
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono">
                <tr>
                  <th className="px-3 py-2.5 text-center w-12">#</th>
                  {columns.map((col) => (
                    <th key={col.id} className="px-3 py-2.5 min-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={col.label}
                          onChange={(e) => handleColumnLabelChange(col.id, e.target.value)}
                          className="bg-transparent border-b border-dashed border-white/20 hover:border-white/50 focus:border-[#38bdf8] text-white font-mono text-xs outline-none py-0.5 w-full uppercase"
                          title="Click to rename column header"
                        />
                        {columns.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColumn(col.id)}
                            className="text-gray-500 hover:text-red-400 p-1"
                            title="Remove this column"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {serialRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-white/5">
                    <td className="px-3 py-2 text-center font-mono text-gray-500">{rowIdx + 1}</td>
                    {columns.map((col) => (
                      <td key={col.id} className="px-3 py-2">
                        <input
                          type="text"
                          value={row[col.id] || ""}
                          onChange={(e) => handleCellChange(rowIdx, col.id, e.target.value)}
                          placeholder={`Enter ${col.label}...`}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#38bdf8]"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSerialRow(rowIdx)}
                        className="p-1 text-gray-500 hover:text-red-400"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Row Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleAddSerialRow(1)}
              className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
            <span className="text-gray-600">|</span>
            <button
              type="button"
              onClick={() => handleAddSerialRow(5)}
              className="text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              + 5 Rows
            </button>
            <span className="text-gray-600">|</span>
            <button
              type="button"
              onClick={() => handleAddSerialRow(10)}
              className="text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              + 10 Rows
            </button>
          </div>
        </div>

        {/* Section 4: Signatories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Issued & Delivered By (JHXT Lead Representative)
            </label>
            <input
              type="text"
              value={issuedByName}
              onChange={(e) => setIssuedByName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">
              Client Authorized Representative
            </label>
            <input
              type="text"
              value={clientRepName}
              onChange={(e) => setClientRepName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
