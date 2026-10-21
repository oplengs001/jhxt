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
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        invoices: {
          orderBy: { createdAt: "desc" },
          include: { items: true, payments: true },
        },
        warrantyCertificates: {
          orderBy: { createdAt: "desc" },
        },
        deliveryNotes: {
          orderBy: { createdAt: "desc" },
        },
        purchaseOrders: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            invoices: true,
            warrantyCertificates: true,
            deliveryNotes: true,
            purchaseOrders: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Fetch client by ID error:", error);
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
    const { name, email, company, address, phone } = body;

    const updated = await prisma.client.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(email !== undefined ? { email: email?.trim() || null } : {}),
        ...(company !== undefined ? { company: company?.trim() || null } : {}),
        ...(address !== undefined ? { address: address?.trim() || null } : {}),
        ...(phone !== undefined ? { phone: phone?.trim() || null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update client error:", error);
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
    await prisma.client.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete client error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
