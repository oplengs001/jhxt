"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Target,
  ArrowLeft,
  UserCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  UserPlus,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [lead, setLead] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Post note state
  const [noteContent, setNoteContent] = useState("");
  const [postingNote, setPostingNote] = useState(false);

  // Conversion state
  const [converting, setConverting] = useState(false);
  const [convertedClient, setConvertedClient] = useState<any>(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lead not found");
      }
      const data = await res.json();
      setLead(data);
      if (data.convertedClient) {
        setConvertedClient(data.convertedClient);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchLead();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLead();
      }
    } catch (err) {
      console.error("Failed to update lead status:", err);
    }
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setPostingNote(true);
    try {
      const res = await fetch(`/api/leads/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });
      if (res.ok) {
        setNoteContent("");
        fetchLead();
      }
    } catch (err) {
      console.error("Failed to post note:", err);
    } finally {
      setPostingNote(false);
    }
  };

  const handleConvertToClient = async () => {
    if (!confirm(`Are you sure you want to convert lead "${lead.name}" into an official Client?`)) {
      return;
    }

    setConverting(true);
    try {
      const res = await fetch(`/api/leads/${id}/convert`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      setConvertedClient(data.client);
      fetchLead();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setConverting(false);
    }
  };

  const pipelineStages = [
    { id: "NEW", label: "1. New Enquiry" },
    { id: "CONTACTED", label: "2. Contacted" },
    { id: "QUALIFIED", label: "3. Qualified" },
    { id: "PROPOSAL_SENT", label: "4. Proposal Sent" },
    { id: "NEGOTIATING", label: "5. Negotiating" },
    { id: "WON", label: "6. Won" },
  ];

  const formatPHP = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format((cents || 0) / 100);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#38bdf8]" />
        Loading sales lead details...
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-12 text-center text-red-400 text-xs">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        {error || "Lead not found"}
        <div className="mt-4">
          <Link href="/invoices/leads" className="text-[#38bdf8] hover:underline">
            ← Back to Leads Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = pipelineStages.findIndex((s) => s.id === lead.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/leads"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white tracking-tight">
                {lead.name}
              </h1>
              {lead.company && (
                <span className="text-xs text-[#38bdf8] font-mono">({lead.company})</span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Assigned Rep: <span className="text-white font-medium">{lead.assignedTo?.name}</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {!lead.convertedClientId ? (
            <button
              onClick={handleConvertToClient}
              disabled={converting}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {converting ? "Converting..." : "Convert Lead to Client"}
            </button>
          ) : (
            <Link
              href="/invoices/clients"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" /> Converted to Client ({convertedClient?.name})
            </Link>
          )}
        </div>
      </div>

      {/* Visual Pipeline Progress Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1.5 text-white font-semibold font-serif">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" /> Lead Pipeline Status
          </span>
          <span className="font-mono">
            Est. Value: <strong className="text-emerald-400 font-bold">{formatPHP(lead.valueEstimate)}</strong>
          </span>
        </div>

        {/* Pipeline Stage Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {pipelineStages.map((stage, idx) => {
            const isCurrent = lead.status === stage.id;
            const isPassed = currentStageIndex >= 0 && idx < currentStageIndex;

            return (
              <button
                key={stage.id}
                onClick={() => handleUpdateStatus(stage.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                  isCurrent
                    ? "bg-[#2563eb] text-white border-[#2563eb] shadow-lg shadow-[#2563eb]/30 scale-[1.02]"
                    : isPassed
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                    : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                {stage.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead Contact Info & Activity Timeline Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Lead Information Card */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 md:col-span-1 h-fit">
          <h3 className="text-xs uppercase font-mono text-gray-400 tracking-wider font-semibold">
            Contact Information
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px]">Contact Name</span>
              <span className="font-bold text-white text-sm">{lead.name}</span>
            </div>

            {lead.company && (
              <div>
                <span className="text-gray-500 block text-[10px]">Company Name</span>
                <span className="font-medium text-gray-200 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-[#38bdf8]" /> {lead.company}
                </span>
              </div>
            )}

            {lead.email && (
              <div>
                <span className="text-gray-500 block text-[10px]">Email Address</span>
                <span className="font-medium text-gray-300 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {lead.email}
                </span>
              </div>
            )}

            {lead.phone && (
              <div>
                <span className="text-gray-500 block text-[10px]">Phone Number</span>
                <span className="font-medium text-gray-300 font-mono flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {lead.phone}
                </span>
              </div>
            )}

            {lead.address && (
              <div>
                <span className="text-gray-500 block text-[10px]">Location / Address</span>
                <span className="font-medium text-gray-400 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" /> {lead.address}
                </span>
              </div>
            )}

            <div className="border-t border-white/10 pt-3 flex justify-between text-gray-400">
              <span>Source:</span>
              <span className="font-semibold text-white">{lead.source || "Website"}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Date Added:</span>
              <span className="font-mono">{format(new Date(lead.createdAt), "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Activity Notes Timeline */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-6 md:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-sm font-semibold text-white font-serif flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#38bdf8]" /> Activity Notes & Discussions
            </h3>
            <span className="text-xs text-gray-400 font-mono font-bold">
              {lead.notes?.length || 0} Entries
            </span>
          </div>

          {/* Post New Note Form */}
          <form onSubmit={handlePostNote} className="space-y-3">
            <textarea
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Log phone call results, site survey notes, or customer feedback..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder:text-gray-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={postingNote || !noteContent.trim()}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Post Activity Note
              </button>
            </div>
          </form>

          {/* Chronological Notes Feed */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            {lead.notes && lead.notes.length > 0 ? (
              lead.notes.map((note: any) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="font-semibold text-white">
                      {note.createdBy?.name || "System"} ({note.createdBy?.role || "SYSTEM"})
                    </span>
                    <span className="font-mono text-[11px]">
                      {format(new Date(note.createdAt), "MMM dd, yyyy • HH:mm")}
                    </span>
                  </div>
                  <p className="text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">
                No activity notes recorded yet. Use the box above to log your first call or discussion!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
