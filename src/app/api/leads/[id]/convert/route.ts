import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
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
      include: { convertedClient: true },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (session.role === "SALES" && lead.assignedToId !== session.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (lead.convertedClientId) {
      return NextResponse.json(
        { error: "Lead has already been converted to a client", client: lead.convertedClient },
        { status: 400 }
      );
    }

    // Create new Client from Lead info
    const newClient = await prisma.client.create({
      data: {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
      },
    });

    // Update Lead: status = WON, link convertedClientId
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status: "WON",
        convertedClientId: newClient.id,
        notes: {
          create: {
            content: `🎉 Lead converted into official Client: "${newClient.name}" (${newClient.company || "Individual"})`,
            createdById: session.userId,
          },
        },
      },
      include: {
        convertedClient: true,
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
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

    return NextResponse.json({
      success: true,
      client: newClient,
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Convert lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
