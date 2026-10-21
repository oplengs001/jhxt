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
    const clientId = searchParams.get("clientId");
    const search = searchParams.get("search");

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (search) {
      where.OR = [
        { poNumber: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { company: { contains: search, mode: "insensitive" } } },
      ];
    }

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });

    return NextResponse.json({ purchaseOrders, total: purchaseOrders.length });
  } catch (error) {
    console.error("Fetch purchase orders error:", error);
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
    const {
      clientId,
      poNumber,
      orderDate,
      deliveryDate,
      status,
      notes,
      taxPercent,
      items,
      paidAmt,
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    // Auto-generate PO number if not provided
    const year = new Date().getFullYear();
    const count = await prisma.purchaseOrder.count();
    const nextSeq = (count + 1).toString().padStart(4, "0");
    const autoPO = poNumber?.trim() || `PO-${year}-${nextSeq}`;

    // Calculate totals
    const parsedItems = Array.isArray(items) ? items : [];
    let subtotalCents = 0;
    parsedItems.forEach((it: any) => {
      const qty = parseFloat(it.quantity) || 1;
      const unitCost = Math.round((parseFloat(it.unitCost) || 0) * 100);
      const lineTotal = Math.round(qty * unitCost);
      it.lineTotal = lineTotal / 100;
      subtotalCents += lineTotal;
    });

    const taxRate = parseFloat(taxPercent) || 0;
    const taxCents = Math.round((subtotalCents * taxRate) / 100);
    const totalCents = subtotalCents + taxCents;
    const paidCents = Math.round((parseFloat(paidAmt) || 0) * 100);

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber: autoPO,
        clientId,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        status: status?.trim() || "PENDING",
        notes: notes?.trim() || null,
        taxPercent: taxRate,
        subtotalAmt: subtotalCents,
        taxAmt: taxCents,
        totalAmt: totalCents,
        paidAmt: paidCents,
        items: parsedItems,
      },
      include: { client: true },
    });

    return NextResponse.json(purchaseOrder, { status: 201 });
  } catch (error: any) {
    console.error("Create purchase order error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "PO number already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
