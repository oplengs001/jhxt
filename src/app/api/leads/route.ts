import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    const userRole = dbUser?.role || session.role || "SALES";

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const assignedToId = searchParams.get("assignedToId");

    const where: any = {};

    // Scoped visibility: SALES users can only view their own assigned leads
    if (userRole === "SALES") {
      where.assignedToId = session.userId;
    } else if (assignedToId && assignedToId !== "ALL") {
      where.assignedToId = assignedToId;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        convertedClient: {
          select: { id: true, name: true, company: true },
        },
        _count: {
          select: { notes: true },
        },
      },
    });

    // KPI Metrics calculation
    let totalPipelineValueCents = 0;
    let wonCount = 0;
    let newCount = 0;

    leads.forEach((l) => {
      totalPipelineValueCents += l.valueEstimate || 0;
      if (l.status === "WON") wonCount += 1;
      if (l.status === "NEW") newCount += 1;
    });

    return NextResponse.json({
      leads,
      total: leads.length,
      userRole,
      metrics: {
        totalPipelineValue: totalPipelineValueCents / 100,
        totalLeads: leads.length,
        wonCount,
        newCount,
      },
    });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    const userRole = dbUser?.role || session.role || "SALES";

    const body = await req.json();
    const { name, company, email, phone, address, source, valueEstimate, assignedToId, initialNote } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Lead name is required" }, { status: 400 });
    }

    // Default assigned to current user unless admin specifies another rep
    const targetAssignedId =
      userRole === "ADMIN" && assignedToId ? assignedToId : session.userId;

    const valueEstimateCents = Math.round((parseFloat(valueEstimate) || 0) * 100);

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        company: company?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        source: source?.trim() || "Website Inquiry",
        status: "NEW",
        valueEstimate: valueEstimateCents,
        assignedToId: targetAssignedId,
        ...(initialNote?.trim() && {
          notes: {
            create: [
              {
                content: initialNote.trim(),
                createdById: session.userId,
              },
            ],
          },
        }),
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        notes: true,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
