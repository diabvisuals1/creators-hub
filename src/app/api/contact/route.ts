import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const apiKey = "re_ZbCYR9eb_8isJXmuBufeFbrAZ8Ck2gGqZ";
    const toEmail = "omar.diab.work@gmail.com";
    const fromEmail = "onboarding@resend.dev";

    if (!apiKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        {
          error:
            "Missing environment variables. Check RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const { error } = await resend.emails.send({
      from: `Creators Hub <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: [
        "New Contact Form Submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #151A43; line-height: 1.7;">
          <h2 style="margin: 0 0 16px;">New Contact Form Submission</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
          <div style="padding: 14px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f8fafc;">
            ${safeMessage}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}