"use client";

import React, { useState, useEffect, use } from "react";
import { format } from "date-fns";
import { Printer, ArrowLeft } from "lucide-react";

export default function PrintInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      });
  }, [id]);

  if (loading || !invoice) {
    return <div className="p-8 text-center text-gray-500 font-sans">Loading printable invoice...</div>;
  }

  const totalPaid = invoice.payments?.reduce((s: number, p: any) => s + p.amountPaid, 0) || 0;
  const remainingBalance = Math.max(0, invoice.totalAmt - totalPaid);

  const formatPHP = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format((cents || 0) / 100);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-8 font-sans">
      {/* Top Navigation Bar - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md"
        >
          <Printer className="w-4 h-4" /> Print / Download PDF
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-xl border border-slate-200 rounded-xl space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-wider">
              JHXTES IT SOLUTIONS
            </h1>
            <p className="text-xs text-blue-600 font-mono mt-1 font-semibold">
              Architecture • Security • Managed Services
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Tarlac City, Philippines • Contact: +63 917 123 4567 • info@jhxt.com
            </p>
          </div>

          <div className="text-right space-y-1 font-mono text-xs">
            <h2 className="text-2xl font-bold text-slate-900 tracking-wide">INVOICE</h2>
            <div className="text-slate-600">
              No: <span className="font-bold text-slate-900">{invoice.invoiceNumber}</span>
            </div>
            <div className="text-slate-600">
              Date: {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
            </div>
            <div className="text-slate-600">
              Due Date: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase font-mono text-[10px]">
              Billed To:
            </span>
            <div className="text-sm font-bold text-slate-900 mt-1">{invoice.client?.name}</div>
            {invoice.client?.company && (
              <div className="text-slate-700 font-medium">{invoice.client.company}</div>
            )}
            {invoice.client?.address && (
              <div className="text-slate-500 mt-1">{invoice.client.address}</div>
            )}
            {invoice.client?.email && (
              <div className="text-slate-500">{invoice.client.email}</div>
            )}
          </div>

          <div className="text-right space-y-1 font-mono">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Payment Status:</span>
            <div className="text-sm font-bold text-slate-900">{invoice.status}</div>
            <div className="text-slate-600 pt-2">
              Amount Due:{" "}
              <span className="font-bold text-blue-600">{formatPHP(remainingBalance)}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-700 uppercase font-mono">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {invoice.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium">{item.description}</td>
                  <td className="py-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">{formatPHP(item.unitPrice)}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    {formatPHP(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-between items-start border-t-2 border-slate-900 pt-6">
          <div className="text-xs text-slate-600 max-w-sm space-y-1">
            <span className="font-bold text-slate-800">Payment Terms & Notes:</span>
            <p className="leading-relaxed">{invoice.notes || "Payment is due per agreed terms."}</p>
          </div>

          <div className="w-64 text-xs font-mono space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatPHP(invoice.subtotalAmt)}</span>
            </div>
            {invoice.discountAmt > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{formatPHP(invoice.discountAmt)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-300 pt-2">
              <span>Total Amount:</span>
              <span className="text-blue-600">{formatPHP(invoice.totalAmt)}</span>
            </div>
            {totalPaid > 0 && (
              <div className="flex justify-between text-emerald-600 pt-1">
                <span>Paid to Date:</span>
                <span>-{formatPHP(totalPaid)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 text-center text-[10px] text-slate-500 font-mono space-y-1">
          <p>This is an official invoice generated by JHXTES IT Solutions.</p>
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
