import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: { client: true, items: true, payments: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
