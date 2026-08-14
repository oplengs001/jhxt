import { NextResponse } from "next/server";

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

    // Console logging submission for production server logging
    console.log("JHXT Website Quote / Contact Submission Received:", {
      timestamp: new Date().toISOString(),
      fullName,
      email,
      phone,
      company,
      serviceCategory,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your quote request has been received. A JHXTES engineer will reach out within 24 hours.",
    });
  } catch (err) {
    console.error("Contact API Route Error:", err);
    return NextResponse.json(
      { error: "Internal server error processing contact form." },
      { status: 500 }
    );
  }
}
