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
    const clientId = searchParams.get("clientId");
    const search = searchParams.get("search");

    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (search) {
      where.OR = [
        { refNumber: { contains: search, mode: "insensitive" } },
        { docNumberCOC: { contains: search, mode: "insensitive" } },
        { projectName: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { company: { contains: search, mode: "insensitive" } } },
      ];
    }

    const certificates = await prisma.warrantyCertificate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });

    return NextResponse.json({ certificates, total: certificates.length });
  } catch (error) {
    console.error("Fetch warranty certificates error:", error);
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
    const {
      clientId,
      refNumber,
      docNumberCOC,
      projectName,
      issueDate,
      validUntil,
      coveragePeriod,
      status,
      serviceProvider,
      providerEmail,
      providerPhone,
      issuedByName,
      issuedByTitle,
      clientRepName,
      terms,
      items,
      serials,
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client is required" }, { status: 400 });
    }

    // Auto-generate ref numbers if not provided
    const year = new Date().getFullYear();
    const count = await prisma.warrantyCertificate.count();
    const nextSeq = (count + 1).toString().padStart(4, "0");
    const autoRef = refNumber?.trim() || `WC-${year}-${nextSeq}`;
    const autoCOC = docNumberCOC?.trim() || `COC-${year}-${nextSeq}`;

    const parsedIssueDate = issueDate ? new Date(issueDate) : new Date();
    const parsedValidUntil = validUntil
      ? new Date(validUntil)
      : new Date(new Date(parsedIssueDate).setFullYear(parsedIssueDate.getFullYear() + 1));

    const cert = await prisma.warrantyCertificate.create({
      data: {
        refNumber: autoRef,
        docNumberCOC: autoCOC,
        clientId,
        projectName: projectName?.trim() || "CCTV Hardware Supply",
        issueDate: parsedIssueDate,
        validUntil: parsedValidUntil,
        coveragePeriod: coveragePeriod?.trim() || "1-Year Standard Hardware Warranty",
        status: status?.trim() || "Active",
        serviceProvider: serviceProvider?.trim() || "JHXT Information Technology Solutions",
        providerEmail: providerEmail?.trim() || "sales@jhxtes.com",
        providerPhone: providerPhone?.trim() || "09602506456",
        issuedByName: issuedByName?.trim() || "JAY HENDRIX TOLEDO",
        issuedByTitle: issuedByTitle?.trim() || "Lead Technical Representative",
        clientRepName: clientRepName?.trim() || "Authorized Representative",
        terms: terms || null,
        items: Array.isArray(items) ? items : [],
        serials: Array.isArray(serials) ? serials : [],
      },
      include: { client: true },
    });

    return NextResponse.json(cert, { status: 201 });
  } catch (error: any) {
    console.error("Create warranty certificate error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Reference number already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
