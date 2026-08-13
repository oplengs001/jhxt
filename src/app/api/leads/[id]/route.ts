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

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        convertedClient: true,
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            createdBy: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Scoped visibility: SALES users can only view their own leads
    if (session.role === "SALES" && lead.assignedToId !== session.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Get lead error:", error);
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
    const { name, company, email, phone, address, source, status, valueEstimate, assignedToId } = body;

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (session.role === "SALES" && existingLead.assignedToId !== session.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (company !== undefined) data.company = company?.trim() || null;
    if (email !== undefined) data.email = email?.trim() || null;
    if (phone !== undefined) data.phone = phone?.trim() || null;
    if (address !== undefined) data.address = address?.trim() || null;
    if (source !== undefined) data.source = source?.trim() || null;
    if (status !== undefined) data.status = status;
    if (valueEstimate !== undefined) data.valueEstimate = Math.round(parseFloat(valueEstimate) * 100);

    // Only Admin can reassign leads to another sales rep
    if (assignedToId !== undefined && session.role === "ADMIN") {
      data.assignedToId = assignedToId;
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        convertedClient: true,
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
