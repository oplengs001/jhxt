import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { amountPaid, method, reference, notes, paymentDate } = body;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const paidCents = Math.round((parseFloat(amountPaid) || 0) * 100);
    if (paidCents <= 0) {
      return NextResponse.json({ error: "Amount paid must be greater than zero" }, { status: 400 });
    }

    // Create payment entry
    const payment = await prisma.invoicePayment.create({
      data: {
        invoiceId: id,
        amountPaid: paidCents,
        method: method || "CASH",
        reference: reference?.trim() || null,
        notes: notes?.trim() || null,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      },
    });

    // Re-calculate total paid and update invoice status
    const allPayments = await prisma.invoicePayment.findMany({ where: { invoiceId: id } });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    let newStatus: "PAID" | "PARTIAL" | "SENT" = "PARTIAL";
    if (totalPaid >= invoice.totalAmt) {
      newStatus = "PAID";
    } else if (totalPaid > 0) {
      newStatus = "PARTIAL";
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: newStatus },
      include: { client: true, items: true, payments: true },
    });

    return NextResponse.json({ payment, invoice: updatedInvoice }, { status: 201 });
  } catch (error) {
    console.error("Record payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
