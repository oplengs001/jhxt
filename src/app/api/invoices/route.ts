import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const clientId = searchParams.get("clientId");
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { company: { contains: search, mode: "insensitive" } } },
      ];
    }

    const limit = parseInt(limitParam || "20", 10);
    const offset = parseInt(offsetParam || "0", 10);

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          items: true,
          payments: true,
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    // Calculate KPI metrics across all invoices
    const allInvoices = await prisma.invoice.findMany({
      include: { payments: true },
    });

    let totalInvoicedCents = 0;
    let totalPaidCents = 0;
    let totalOutstandingCents = 0;
    let overdueCount = 0;

    const now = new Date();

    allInvoices.forEach((inv) => {
      if (inv.status !== "CANCELLED") {
        totalInvoicedCents += inv.totalAmt;

        const paid = inv.payments.reduce((sum, p) => sum + p.amountPaid, 0);
        totalPaidCents += paid;

        const remaining = Math.max(0, inv.totalAmt - paid);
        if (inv.status !== "PAID") {
          totalOutstandingCents += remaining;
        }

        if (inv.status !== "PAID" && new Date(inv.dueDate) < now) {
          overdueCount += 1;
        }
      }
    });

    return NextResponse.json({
      invoices,
      total,
      limit,
      offset,
      metrics: {
        totalInvoiced: totalInvoicedCents / 100,
        totalPaid: totalPaidCents / 100,
        totalOutstanding: totalOutstandingCents / 100,
        overdueCount,
      },
    });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clientId, issueDate, dueDate, notes, taxPercent, discountAmt, items } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "At least one line item is required" }, { status: 400 });
    }

    // Auto-generate invoice number (INV-YYYY-XXXX)
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count();
    const nextNumber = (count + 1).toString().padStart(4, "0");
    const invoiceNumber = `INV-${year}-${nextNumber}`;

    // Calculate subtotal from items
    let subtotalCents = 0;
    const formattedItems = items.map((item: any, idx: number) => {
      const qty = parseFloat(item.quantity) || 1;
      const unitPriceCents = Math.round((parseFloat(item.unitPrice) || 0) * 100);
      const lineTotalCents = Math.round(qty * unitPriceCents);
      subtotalCents += lineTotalCents;

      return {
        description: item.description?.trim() || "Item",
        quantity: qty,
        unitPrice: unitPriceCents,
        totalPrice: lineTotalCents,
        sortOrder: idx,
      };
    });

    const taxRate = parseFloat(taxPercent) || 0;
    const discountCents = Math.round((parseFloat(discountAmt) || 0) * 100);
    const taxableSubtotal = Math.max(0, subtotalCents - discountCents);
    const taxCents = Math.round((taxableSubtotal * taxRate) / 100);
    const totalCents = Math.max(0, taxableSubtotal + taxCents);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        createdById: session.userId,
        status: "DRAFT",
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        notes: notes?.trim() || null,
        taxPercent: taxRate,
        discountAmt: discountCents,
        subtotalAmt: subtotalCents,
        taxAmt: taxCents,
        totalAmt: totalCents,
        items: {
          create: formattedItems,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
