"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  Save,
  AlertCircle,
  X,
  Cpu,
  Layers,
  CheckCircle,
} from "lucide-react";

interface EquipmentItem {
  description: string;
  quantity: number;
  unit: string;
  coverage: string;
  condition: string;
  status: string;
}

interface SerialEntry {
  cameraSerial: string;
  hddSerial: string;
  nvrSerial: string;
  notes: string;
}

export default function CreateWarrantyCertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClientId = searchParams.get("clientId");

  const [clients, setClients] = useState<any[]>([]);
  const [productItems, setProductItems] = useState<any[]>([]);
  const [clientId, setClientId] = useState(queryClientId || "");
  const [projectName, setProjectName] = useState("CCTV Hardware Supply");
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

  // Equipment List
  const [items, setItems] = useState<EquipmentItem[]>([
    { description: "NVR 5232-EL (Network Video Recorder)", quantity: 1, unit: "Pc", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    { description: "4TB HDD Skyhawk (Surveillance Internal Hard Disk)", quantity: 2, unit: "Pcs", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    { description: "Dahua IPC-HDBW2230-S-S2 (2MP Indoor Dome Camera)", quantity: 6, unit: "Pcs", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    { description: "Dahua 2MP Bullet IP Camera IPC-HFW1220S", quantity: 3, unit: "Pcs", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    { description: "DAHUA 8 PORT POE SWITCH", quantity: 1, unit: "Pc", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    { description: "Belden CAT6 Cable (High-Performance Network Cabling)", quantity: 2, unit: "Pcs", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
  ]);

  // Device Serial Inventory
  const [serials, setSerials] = useState<SerialEntry[]>([
    { cameraSerial: "AM0D543PAGOODDE", hddSerial: "WGY3ATQH", nvrSerial: "CEOF4D1PAJ79484", notes: "" },
    { cameraSerial: "AM0D543PAG8EAED", hddSerial: "WGY3ATQN", nvrSerial: "", notes: "" },
    { cameraSerial: "AM0D543PAG76FBD", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BK0AP00PAG3F5F3", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BD00BDAPAG942C2", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BK0AP00PAG6740A", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BD00BDAPAGE8D08", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BK0AF00PAG16181", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BK0AP00PAGB7CE7", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BD00BDAPAGD0A40", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BK0AP00PAGA7A27", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "BK0AP00PAG83D14", hddSerial: "", nvrSerial: "", notes: "" },
    { cameraSerial: "AM0D543PAG70436", hddSerial: "", nvrSerial: "", notes: "" },
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

  // Handlers for equipment
  const handleAddItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unit: "Pc", coverage: "1 Year Standard", condition: "Brand New", status: "Active" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof EquipmentItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Handlers for serials
  const handleAddSerialRow = () => {
    setSerials([...serials, { cameraSerial: "", hddSerial: "", nvrSerial: "", notes: "" }]);
  };

  const handleRemoveSerialRow = (index: number) => {
    setSerials(serials.filter((_, i) => i !== index));
  };

  const handleSerialChange = (index: number, field: keyof SerialEntry, value: string) => {
    const updated = [...serials];
    updated[index] = { ...updated[index], [field]: value };
    setSerials(updated);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    if (items.some((it) => !it.description.trim())) {
      setError("All equipment items must have a description");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/documents/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          refNumber,
          docNumberCOC,
          projectName,
          issueDate,
          validUntil,
          coveragePeriod,
          status: "Active",
          issuedByName,
          issuedByTitle,
          clientRepName,
          items,
          serials: serials.filter((s) => s.cameraSerial || s.hddSerial || s.nvrSerial),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create warranty certificate");
      }

      const created = await res.json();
      router.push(`/invoices/warranty/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Count active serial inventory stats
  const cameraCount = serials.filter((s) => s.cameraSerial.trim()).length;
  const hddCount = serials.filter((s) => s.hddSerial.trim()).length;
  const nvrCount = serials.filter((s) => s.nvrSerial.trim()).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/warranty"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">
              Create Warranty Certificate & Completion Note
            </h1>
            <p className="text-xs text-gray-400 font-light">
              Generates official warranty supply certificate, completion & turnover form, and device serial inventory
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 py-2 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Generating..." : "Save & Generate Document"}
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
        {/* Section 1: Client & Document Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-gray-300">Select Client *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0a1120] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a1120] text-white">
                  {c.name} {c.company ? `(${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Project / Engagement Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. CCTV Hardware Supply & Turnkey Cabling"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Coverage Description</label>
            <input
              type="text"
              value={coveragePeriod}
              onChange={(e) => setCoveragePeriod(e.target.value)}
              placeholder="1-Year Standard Hardware Warranty"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Warranty Ref Number (Auto if blank)</label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. WC-2026-1001"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Completion Doc No (COC)</label>
            <input
              type="text"
              value={docNumberCOC}
              onChange={(e) => setDocNumberCOC(e.target.value)}
              placeholder="e.g. COC-2026-1001"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Equipment Schedule */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif">Supplied Equipment & Warranty Schedule</h3>
              <p className="text-[11px] text-gray-400">Items covered under the official hardware warranty and completion certificate</p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-3 relative"
              >
                <div className="w-8 text-center text-xs font-mono text-gray-400 shrink-0">
                  #{idx + 1}
                </div>

                <div className="flex-1 w-full space-y-1">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="e.g. Dahua IPC-HDBW2230-S-S2 (2MP Indoor Dome Camera)"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="w-16 space-y-1">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="w-20 space-y-1">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                      placeholder="Pc/Pcs"
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

        {/* Section 3: Device Serial Number Inventory */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white font-serif flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38bdf8]" /> Device Serial Number Inventory
              </h3>
              <p className="text-[11px] text-gray-400">
                Cross-reference serial register for surveillance cameras, hard drives, and NVR units
              </p>
            </div>

            {/* Quick KPI count indicators */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-mono font-semibold">
                Cameras: {cameraCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-semibold">
                HDDs: {hddCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-mono font-semibold">
                NVRs: {nvrCount}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-mono">
                <tr>
                  <th className="px-3 py-2.5 text-center w-12">#</th>
                  <th className="px-3 py-2.5">Camera Serial Number</th>
                  <th className="px-3 py-2.5">4TB HDD Serial Number</th>
                  <th className="px-3 py-2.5">NVR Serial Number</th>
                  <th className="px-3 py-2.5 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {serials.map((s, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="px-3 py-2 text-center font-mono text-gray-400">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={s.cameraSerial}
                        onChange={(e) => handleSerialChange(idx, "cameraSerial", e.target.value)}
                        placeholder="e.g. AM0D543PAGOODDE"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={s.hddSerial}
                        onChange={(e) => handleSerialChange(idx, "hddSerial", e.target.value)}
                        placeholder="e.g. WGY3ATQH"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={s.nvrSerial}
                        onChange={(e) => handleSerialChange(idx, "nvrSerial", e.target.value)}
                        placeholder="e.g. CEOF4D1PAJ79484"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSerialRow(idx)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddSerialRow}
            className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Another Device Serial Row
          </button>
        </div>

        {/* Section 4: Signatories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Issued & Delivered By (JHXT Lead Representative)</label>
            <input
              type="text"
              value={issuedByName}
              onChange={(e) => setIssuedByName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Client Authorized Representative</label>
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
