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
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        items: {
          orderBy: { sortOrder: "asc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Get invoice error:", error);
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
    const { clientId, issueDate, dueDate, notes, taxPercent, discountAmt, status, items } = body;

    const existing = await prisma.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (clientId) updateData.clientId = clientId;
    if (issueDate) updateData.issueDate = new Date(issueDate);
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    if (status) updateData.status = status;

    if (items && Array.isArray(items)) {
      // Recalculate line items & totals
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

      const taxRate = taxPercent !== undefined ? parseFloat(taxPercent) || 0 : existing.taxPercent;
      const discountCents = discountAmt !== undefined ? Math.round((parseFloat(discountAmt) || 0) * 100) : existing.discountAmt;
      const taxableSubtotal = Math.max(0, subtotalCents - discountCents);
      const taxCents = Math.round((taxableSubtotal * taxRate) / 100);
      const totalCents = Math.max(0, taxableSubtotal + taxCents);

      updateData.taxPercent = taxRate;
      updateData.discountAmt = discountCents;
      updateData.subtotalAmt = subtotalCents;
      updateData.taxAmt = taxCents;
      updateData.totalAmt = totalCents;

      // Delete existing items and recreate
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
      updateData.items = { create: formattedItems };
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        items: true,
        payments: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update invoice error:", error);
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
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Cancel invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
