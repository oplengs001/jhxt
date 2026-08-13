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
    const category = searchParams.get("category");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.productItem.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    // Get unique categories for filter options
    const allCategories = await prisma.productItem.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
    });

    const categories = allCategories
      .map((c) => c.category)
      .filter((c): c is string => Boolean(c));

    return NextResponse.json({ items, total: items.length, categories });
  } catch (error) {
    console.error("Fetch product items error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, unitPrice, unit, category } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    // unitPrice is stored in centavos (PHP centavos, so 100 centavos = 1 Peso)
    const priceCents = Math.round((parseFloat(unitPrice) || 0) * 100);

    const item = await prisma.productItem.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        unitPrice: priceCents,
        unit: unit?.trim() || "pcs",
        category: category?.trim() || null,
        isActive: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Create product item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
