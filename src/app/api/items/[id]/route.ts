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
    const item = await prisma.productItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Product item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Get product item error:", error);
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
    const { name, description, unitPrice, unit, category, isActive } = body;

    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (unitPrice !== undefined) data.unitPrice = Math.round(parseFloat(unitPrice) * 100);
    if (unit !== undefined) data.unit = unit?.trim() || "pcs";
    if (category !== undefined) data.category = category?.trim() || null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const item = await prisma.productItem.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Update product item error:", error);
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

    // Soft delete by setting isActive to false
    const item = await prisma.productItem.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Delete product item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
