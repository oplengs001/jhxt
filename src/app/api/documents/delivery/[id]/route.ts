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
    const deliveryNote = await prisma.deliveryNote.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!deliveryNote) {
      return NextResponse.json({ error: "Delivery note not found" }, { status: 404 });
    }

    return NextResponse.json(deliveryNote);
  } catch (error) {
    console.error("Fetch delivery note by ID error:", error);
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

    const updated = await prisma.deliveryNote.update({
      where: { id },
      data: {
        ...(body.deliveryNumber ? { deliveryNumber: body.deliveryNumber.trim() } : {}),
        ...(body.deliveryDate ? { deliveryDate: new Date(body.deliveryDate) } : {}),
        ...(body.dueDate !== undefined ? { dueDate: body.dueDate ? new Date(body.dueDate) : null } : {}),
        ...(body.poNumber !== undefined ? { poNumber: body.poNumber?.trim() || null } : {}),
        ...(body.invoiceNumber !== undefined ? { invoiceNumber: body.invoiceNumber?.trim() || null } : {}),
        ...(body.deliveredByName ? { deliveredByName: body.deliveredByName.trim() } : {}),
        ...(body.receivedByName !== undefined ? { receivedByName: body.receivedByName?.trim() || null } : {}),
        ...(body.notes !== undefined ? { notes: body.notes?.trim() || null } : {}),
        ...(body.status ? { status: body.status.trim() } : {}),
        ...(body.items !== undefined ? { items: body.items } : {}),
      },
      include: { client: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update delivery note error:", error);
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
    await prisma.deliveryNote.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete delivery note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
