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
    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (session.role === "SALES" && lead.assignedToId !== session.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        createdById: session.userId,
        content: content.trim(),
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Touch lead updatedAt
    await prisma.lead.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create lead note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
