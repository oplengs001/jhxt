import { NextResponse } from "next/server";
import { sendContactNotificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, serviceCategory, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full Name, Email, and Message are required fields." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 1. Dispatch Email via Nodemailer (sales@jhxtes.com, cc: oplengs@gmail.com, drixtoledo@gmail.com)
    await sendContactNotificationEmail({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      company: company?.trim() || undefined,
      serviceCategory: serviceCategory || "General Inquiry",
      message: message.trim(),
    });

    // 2. Optionally record into CRM Lead pipeline if admin user exists
    try {
      const defaultUser = await prisma.adminUser.findFirst({
        orderBy: { createdAt: "asc" },
      });

      if (defaultUser) {
        const newLead = await prisma.lead.create({
          data: {
            name: fullName.trim(),
            email: email.trim(),
            phone: phone?.trim() || null,
            company: company?.trim() || null,
            source: `Website: ${serviceCategory || "General Inquiry"}`,
            status: "NEW",
            assignedToId: defaultUser.id,
          },
        });

        if (message && message.trim()) {
          await prisma.leadNote.create({
            data: {
              leadId: newLead.id,
              createdById: defaultUser.id,
              content: `[Website Inquiry Message - ${serviceCategory || "General"}]:\n${message.trim()}`,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("Could not record lead to CRM DB (email still sent successfully):", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your quote request has been received. A JHXTES engineer will reach out within 24 hours.",
    });
  } catch (err: any) {
    console.error("Contact API Route Error:", err);
    return NextResponse.json(
      {
        error:
          err?.message || "Internal server error occurred while sending your request.",
      },
      { status: 500 }
    );
  }
}
