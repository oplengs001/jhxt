import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    },
  });
}
