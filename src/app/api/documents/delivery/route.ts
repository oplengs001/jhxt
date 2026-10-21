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
        { deliveryNumber: { contains: search, mode: "insensitive" } },
        { poNumber: { contains: search, mode: "insensitive" } },
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { company: { contains: search, mode: "insensitive" } } },
      ];
    }

    const deliveryNotes = await prisma.deliveryNote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });

    return NextResponse.json({ deliveryNotes, total: deliveryNotes.length });
  } catch (error) {
    console.error("Fetch delivery notes error:", error);
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
      deliveryNumber,
      deliveryDate,
      dueDate,
      poNumber,
      invoiceNumber,
      deliveredByName,
      receivedByName,
      notes,
      items,
      status,
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    // Auto-generate delivery number if not specified
    const year = new Date().getFullYear();
    const count = await prisma.deliveryNote.count();
    const nextSeq = (count + 1).toString().padStart(4, "0");
    const autoDN = deliveryNumber?.trim() || `DN-${year}-${nextSeq}`;

    const deliveryNote = await prisma.deliveryNote.create({
      data: {
        deliveryNumber: autoDN,
        clientId,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        poNumber: poNumber?.trim() || null,
        invoiceNumber: invoiceNumber?.trim() || null,
        deliveredByName: deliveredByName?.trim() || "JAY HENDRIX TOLEDO",
        receivedByName: receivedByName?.trim() || null,
        notes: notes?.trim() || null,
        status: status?.trim() || "DELIVERED",
        items: Array.isArray(items) ? items : [],
      },
      include: { client: true },
    });

    return NextResponse.json(deliveryNote, { status: 201 });
  } catch (error: any) {
    console.error("Create delivery note error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Delivery number already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
