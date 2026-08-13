import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { portalToken: token },
      include: {
        client: true,
        items: {
          orderBy: { sortOrder: "asc" },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice token invalid or expired" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Fetch portal invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
