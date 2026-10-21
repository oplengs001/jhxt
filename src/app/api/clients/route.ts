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
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
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

    return NextResponse.json({ clients, total: clients.length });
  } catch (error) {
    console.error("Fetch clients error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, address, phone } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        company: company?.trim() || null,
        address: address?.trim() || null,
        phone: phone?.trim() || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
