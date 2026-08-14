import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Admin User (ADMIN role)
  const adminEmail = "admin@jhxt.com";
  let admin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  const passwordHash = await bcrypt.hash("admin123", 10);
  if (!admin) {
    admin = await prisma.adminUser.create({
      data: {
        name: "JHXT Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Created default admin:", admin.email);
  } else {
    admin = await prisma.adminUser.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    });
    console.log("Updated admin role:", admin.email);
  }

  // 2. Seed Sales User (SALES role)
  const salesEmail = "sales@jhxt.com";
  let salesUser = await prisma.adminUser.findUnique({ where: { email: salesEmail } });

  const salesPasswordHash = await bcrypt.hash("sales123", 10);
  if (!salesUser) {
    salesUser = await prisma.adminUser.create({
      data: {
        name: "Marco Sales Rep",
        email: salesEmail,
        passwordHash: salesPasswordHash,
        role: "SALES",
      },
    });
    console.log("Created sample sales user:", salesUser.email);
  } else {
    console.log("Sales user exists:", salesUser.email);
  }

  // 3. Seed Sample Product Items
  const sampleItems = [
    {
      name: "IP Camera - 4MP Dahua Dome",
      description: "Night vision, PoE, vandal-proof IP dome camera with AI motion detection.",
      unitPrice: 450000, // P4,500.00
      unit: "pcs",
      category: "CCTV & Surveillance",
    },
    {
      name: "NVR 16-Channel 4K Storage Server",
      description: "Enterprise 16-ch Network Video Recorder with 4TB Surveillance Hard Drive.",
      unitPrice: 2850000, // P28,500.00
      unit: "unit",
      category: "CCTV & Surveillance",
    },
    {
      name: "Cat6 FTP Shielded Cable (305m Box)",
      description: "Outdoor grade Cat6 FTP copper ethernet cable roll for high bandwidth backhaul.",
      unitPrice: 850000, // P8,500.00
      unit: "box",
      category: "Structured Cabling",
    },
    {
      name: "Managed Network Switch 24-Port Gigabit PoE+",
      description: "Layer 2 managed switch with 24 PoE+ ports and 4 SFP uplink ports.",
      unitPrice: 1950000, // P19,500.00
      unit: "unit",
      category: "IP Networking",
    },
    {
      name: "Engineered On-Site Installation & Cabling",
      description: "Professional installation, cable drop termination, testing, and rack mounting per node.",
      unitPrice: 120000, // P1,200.00
      unit: "node",
      category: "Professional Services",
    },
    {
      name: "24/7 Managed IT & Security Maintenance (Monthly)",
      description: "Proactive remote monitoring, firmware upgrades, monthly health audits, and priority dispatch.",
      unitPrice: 1500000, // P15,000.00
      unit: "month",
      category: "Managed IT Services",
    },
  ];

  for (const item of sampleItems) {
    const existing = await prisma.productItem.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await prisma.productItem.create({ data: item });
    }
  }
  console.log("Seeded product catalog items.");

  // 4. Seed Sample Client
  let client = await prisma.client.findFirst({
    where: { name: "Acme Commercial Corp" },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        name: "Acme Commercial Corp",
        company: "Acme Corporation",
        email: "billing@acme.com",
        phone: "+63 917 123 4567",
        address: "123 Technology Park, Tarlac City, Philippines",
      },
    });
    console.log("Created sample client:", client.name);
  }

  // 5. Seed Sample Invoice
  const sampleInvoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: "INV-2026-0001" },
  });

  if (!sampleInvoice && client && admin) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2026-0001",
        clientId: client.id,
        createdById: admin.id,
        status: "SENT",
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        notes: "Thank you for choosing JHXTES IT Solutions! Payment is due within 15 days.",
        taxPercent: 0.0,
        subtotalAmt: 4600000,
        taxAmt: 0,
        totalAmt: 4600000,
        items: {
          create: [
            {
              description: "IP Camera - 4MP Dahua Dome",
              quantity: 4,
              unitPrice: 450000,
              totalPrice: 1800000,
              sortOrder: 0,
            },
            {
              description: "NVR 16-Channel 4K Storage Server",
              quantity: 1,
              unitPrice: 2850000,
              totalPrice: 2850000,
              sortOrder: 1,
            },
          ],
        },
      },
    });
    console.log("Created sample invoice INV-2026-0001.");
  }

  // 6. Seed Sample Leads (Upsert/Force re-creation to guarantee lead data)
  const leadsToSeed = [
    {
      name: "Juan Dela Cruz",
      company: "Highland Logistics Hub",
      email: "juan@highlandlogistics.ph",
      phone: "+63 918 999 8877",
      address: "Subic-Clark Expressway Tollway Plaza, Tarlac",
      source: "Site Survey Request",
      status: "PROPOSAL_SENT" as const,
      valueEstimate: 18500000, // P185,000.00
      assignedToId: salesUser.id,
      notes: [
        "Initial phone call completed. Customer requested 24 IP cameras for their new warehouse wing.",
        "Site engineering survey conducted. Sent formal DBOT infrastructure proposal for P185,000.",
      ],
    },
    {
      name: "Maria Santos",
      company: "Central Mall Tarlac",
      email: "msantos@centralmall.com.ph",
      phone: "+63 920 555 4433",
      address: "MacArthur Highway, Tarlac City",
      source: "Website Inquiry",
      status: "NEW" as const,
      valueEstimate: 9500000, // P95,000.00
      assignedToId: salesUser.id,
      notes: [
        "Inquired via website for access control turnstiles and ANPR license plate recognition system.",
      ],
    },
    {
      name: "Engr. Roberto Ramos",
      company: "Tarlac Industrial Park Corp",
      email: "rramos@tarlacindustrial.com",
      phone: "+63 917 888 1122",
      address: "Industrial Zone, Luisita, Tarlac",
      source: "Client Referral",
      status: "NEGOTIATING" as const,
      valueEstimate: 34500000, // P345,000.00
      assignedToId: salesUser.id,
      notes: [
        "Referred by Acme Corp. Inquired regarding fiber optic backbone cabling across 3 factory buildings.",
        "Engineered proposal submitted. Currently finalizing payment schedules.",
      ],
    },
    {
      name: "Dr. Elena Mercado",
      company: "St. Jude Medical Center",
      email: "emercado@stjudehospital.ph",
      phone: "+63 999 444 3322",
      address: "Romulo Boulevard, Tarlac City",
      source: "Site Survey Request",
      status: "QUALIFIED" as const,
      valueEstimate: 12000000, // P120,000.00
      assignedToId: admin.id,
      notes: [
        "Requested 24/7 Managed IT Services for hospital network cabling and CCTV security auditing.",
      ],
    },
    {
      name: "Captain Antonio Valdez",
      company: "Barangay San Sebastian LGU",
      email: "lgu.sansebastian@tarlac.gov.ph",
      phone: "+63 915 222 1100",
      address: "San Sebastian Barangay Hall, Tarlac",
      source: "Municipal Network",
      status: "WON" as const,
      valueEstimate: 21000000, // P210,000.00
      assignedToId: salesUser.id,
      notes: [
        "Barangay public safety CCTV deployment project awarded.",
        "🎉 Converted into official municipal client.",
      ],
    },
  ];

  for (const l of leadsToSeed) {
    const existing = await prisma.lead.findFirst({
      where: { name: l.name },
    });

    if (existing) {
      // Delete existing lead so we re-seed fresh with notes
      await prisma.lead.delete({ where: { id: existing.id } });
    }

    const createdLead = await prisma.lead.create({
      data: {
        name: l.name,
        company: l.company,
        email: l.email,
        phone: l.phone,
        address: l.address,
        source: l.source,
        status: l.status,
        valueEstimate: l.valueEstimate,
        assignedToId: l.assignedToId,
        notes: {
          create: l.notes.map((content) => ({
            content,
            createdById: l.assignedToId,
          })),
        },
      },
    });
    console.log(`✅ Seeded lead: ${createdLead.name} (${createdLead.company}) - Status: ${createdLead.status}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
