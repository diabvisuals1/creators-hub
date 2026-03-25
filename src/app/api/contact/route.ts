import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!host || !user || !pass || !toEmail) {
      return NextResponse.json(
        {
          error:
            "SMTP environment variables are missing. Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      logger: true,
      debug: true,
    });

    await transporter.verify();

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const info = await transporter.sendMail({
      from: `"Creators Hub Website" <${user}>`,
      to: toEmail,
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
          <p style="margin: 16px 0 8px;"><strong>Message:</strong> ${safeMessage}</p>
        </div>
      `,
    });

    console.log("Contact email sent:", info.messageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to send message. Please try again later.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}