import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!po) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    return NextResponse.json(po);
  } catch (error) {
    console.error("Fetch purchase order by ID error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
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

    const existing = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    let subtotalCents = existing.subtotalAmt;
    let taxCents = existing.taxAmt;
    let totalCents = existing.totalAmt;
    let items = existing.items;

    if (body.items && Array.isArray(body.items)) {
      subtotalCents = 0;
      items = body.items.map((it: any) => {
        const qty = parseFloat(it.quantity) || 1;
        const unitCost = Math.round((parseFloat(it.unitCost) || 0) * 100);
        const lineTotal = Math.round(qty * unitCost);
        it.lineTotal = lineTotal / 100;
        subtotalCents += lineTotal;
        return it;
      });
      const taxRate = body.taxPercent !== undefined ? parseFloat(body.taxPercent) || 0 : existing.taxPercent;
      taxCents = Math.round((subtotalCents * taxRate) / 100);
      totalCents = subtotalCents + taxCents;
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        ...(body.poNumber ? { poNumber: body.poNumber.trim() } : {}),
        ...(body.orderDate ? { orderDate: new Date(body.orderDate) } : {}),
        ...(body.deliveryDate !== undefined ? { deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null } : {}),
        ...(body.status ? { status: body.status.trim() } : {}),
        ...(body.notes !== undefined ? { notes: body.notes?.trim() || null } : {}),
        ...(body.taxPercent !== undefined ? { taxPercent: parseFloat(body.taxPercent) || 0 } : {}),
        ...(body.paidAmt !== undefined ? { paidAmt: Math.round((parseFloat(body.paidAmt) || 0) * 100) } : {}),
        subtotalAmt: subtotalCents,
        taxAmt: taxCents,
        totalAmt: totalCents,
        items: items as any,
      },
      include: { client: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update purchase order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.purchaseOrder.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete purchase order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
