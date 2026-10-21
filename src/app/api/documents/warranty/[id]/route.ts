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
    const cert = await prisma.warrantyCertificate.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json(cert);
  } catch (error) {
    console.error("Fetch certificate by ID error:", error);
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

    const updated = await prisma.warrantyCertificate.update({
      where: { id },
      data: {
        ...(body.refNumber ? { refNumber: body.refNumber.trim() } : {}),
        ...(body.docNumberCOC !== undefined ? { docNumberCOC: body.docNumberCOC?.trim() || null } : {}),
        ...(body.projectName !== undefined ? { projectName: body.projectName?.trim() || null } : {}),
        ...(body.issueDate ? { issueDate: new Date(body.issueDate) } : {}),
        ...(body.validUntil ? { validUntil: new Date(body.validUntil) } : {}),
        ...(body.coveragePeriod ? { coveragePeriod: body.coveragePeriod.trim() } : {}),
        ...(body.status ? { status: body.status.trim() } : {}),
        ...(body.issuedByName ? { issuedByName: body.issuedByName.trim() } : {}),
        ...(body.issuedByTitle ? { issuedByTitle: body.issuedByTitle.trim() } : {}),
        ...(body.clientRepName !== undefined ? { clientRepName: body.clientRepName?.trim() || null } : {}),
        ...(body.terms !== undefined ? { terms: body.terms || null } : {}),
        ...(body.items !== undefined ? { items: body.items } : {}),
        ...(body.serials !== undefined ? { serials: body.serials } : {}),
      },
      include: { client: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update certificate error:", error);
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
    await prisma.warrantyCertificate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete certificate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
