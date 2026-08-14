import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceCategory?: string;
  message: string;
}

const smtpHost = process.env.SMTP_HOST || "smtpout.secureserver.net";
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
const smtpSecure = process.env.SMTP_SECURE === "false" ? false : true;
const smtpUser = process.env.SMTP_USER || "sales@jhxtes.com";
const smtpPass = process.env.SMTP_PASS || "Coding@Night!69";

export const mailTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendContactNotificationEmail(data: ContactEmailPayload) {
  const toEmail = process.env.CONTACT_EMAIL_TO || "sales@jhxtes.com";
  const ccEmailsRaw = process.env.CONTACT_EMAIL_CC || "oplengs@gmail.com, drixtoledo@gmail.com";
  const ccEmails = ccEmailsRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const subject = `[JHXTES Quote Request] ${data.serviceCategory || "General Inquiry"} - ${data.fullName}${
    data.company ? ` (${data.company})` : ""
  }`;

  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Manila",
  }).format(new Date());

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #060b14; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: #0a1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #0f192e 100%); padding: 24px 30px; border-bottom: 1px solid #2563eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: bold; letter-spacing: 0.05em; color: #ffffff; font-family: 'Times New Roman', Georgia, serif;">
                      JHXTES <span style="color: #38bdf8;">IT SOLUTIONS</span>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; font-family: monospace;">
                      Engineering Quote & Inquiry Dispatch
                    </div>
                  </td>
                  <td align="right" style="font-size: 11px; color: #38bdf8; font-family: monospace;">
                    NEW SUBMISSION
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin-top: 0; margin-bottom: 20px; font-size: 15px; line-height: 1.5; color: #cbd5e1;">
                A new quote request has been submitted through the <strong style="color: #ffffff;">JHXTES website contact form</strong>.
              </p>

              <!-- Client Info Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #0f192e; border: 1px solid #1e293b; border-radius: 10px; margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8; border-bottom: 1px solid #1e293b; width: 35%;"><strong>Submitted On:</strong></td>
                  <td style="padding: 12px 16px; color: #f8fafc; border-bottom: 1px solid #1e293b;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8; border-bottom: 1px solid #1e293b;"><strong>Client Full Name:</strong></td>
                  <td style="padding: 12px 16px; color: #f8fafc; border-bottom: 1px solid #1e293b; font-weight: 600;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8; border-bottom: 1px solid #1e293b;"><strong>Corporate Email:</strong></td>
                  <td style="padding: 12px 16px; color: #38bdf8; border-bottom: 1px solid #1e293b;">
                    <a href="mailto:${data.email}" style="color: #38bdf8; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8; border-bottom: 1px solid #1e293b;"><strong>Contact Phone:</strong></td>
                  <td style="padding: 12px 16px; color: #f8fafc; border-bottom: 1px solid #1e293b;">
                    ${data.phone ? `<a href="tel:${data.phone}" style="color: #f8fafc; text-decoration: none;">${data.phone}</a>` : '<span style="color: #64748b;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8; border-bottom: 1px solid #1e293b;"><strong>Company / LGU:</strong></td>
                  <td style="padding: 12px 16px; color: #f8fafc; border-bottom: 1px solid #1e293b;">${data.company || '<span style="color: #64748b;">Not specified</span>'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8;"><strong>Service Pillar:</strong></td>
                  <td style="padding: 12px 16px; color: #10b981; font-weight: 600;">${data.serviceCategory || "General Inquiry"}</td>
                </tr>
              </table>

              <!-- Project Notes Block -->
              <div style="background: #0d1527; border-left: 4px solid #2563eb; border-radius: 4px 8px 8px 4px; padding: 16px 20px; margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 8px; font-family: monospace;">
                  Project Details & Site Notes:
                </div>
                <div style="font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap;">
${data.message}
                </div>
              </div>

              <!-- Action button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top: 10px;">
                <tr>
                  <td style="border-radius: 8px; background: #2563eb;">
                    <a href="mailto:${data.email}?subject=RE:%20JHXTES%20Engineering%20Quote%20-%20${encodeURIComponent(data.serviceCategory || "IT Solutions")}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 8px;">
                      Reply Directly to Client →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #060b14; padding: 20px 30px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center;">
              <p style="margin: 0 0 6px 0;">This automated notification was dispatched from the <strong>JHXTES Website System</strong>.</p>
              <p style="margin: 0;">Recipient: ${toEmail} | CC: ${ccEmails.join(", ")}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
JHXTES IT SOLUTIONS — NEW QUOTE REQUEST
===========================================
Submitted: ${formattedDate}

Client Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Company: ${data.company || "Not provided"}
Service Category: ${data.serviceCategory || "General Inquiry"}

Project Details & Site Notes:
-------------------------------------------
${data.message}
-------------------------------------------

Recipient: ${toEmail}
CC: ${ccEmails.join(", ")}
  `.trim();

  const mailOptions = {
    from: `"JHXTES Inquiries" <${smtpUser}>`,
    to: toEmail,
    cc: ccEmails,
    replyTo: `"${data.fullName}" <${data.email}>`,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  const info = await mailTransporter.sendMail(mailOptions);
  return info;
}
