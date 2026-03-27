import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Only try nodemailer if SMTP credentials are configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      // Dynamic import so it doesn't crash if nodemailer isn't installed yet
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Email to store owner
      await transporter.sendMail({
        from: `"Hypsoul Contact" <${smtpUser}>`,
        to: process.env.CONTACT_TO_EMAIL || smtpUser,
        replyTo: email,
        subject: `[Hypsoul] ${subject || "New Contact Message"} — from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#ff3c00;font-size:24px;margin-bottom:24px;">New Contact Message</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;width:100px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#ff3c00;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888;">Subject</td><td style="padding:8px 0;">${subject || "—"}</td></tr>
            </table>
            <div style="margin-top:24px;padding:20px;background:#1a1a1a;border-radius:8px;border-left:3px solid #ff3c00;">
              <p style="color:#ccc;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="color:#555;font-size:12px;margin-top:24px;">Sent from hypsoul.in contact form</p>
          </div>
        `,
      });

      // Auto-reply to user
      await transporter.sendMail({
        from: `"Hypsoul" <${smtpUser}>`,
        to: email,
        subject: "We received your message — Hypsoul",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#ff3c00;font-size:24px;margin-bottom:8px;">HYPSOUL.</h2>
            <p style="color:#888;font-size:13px;margin-bottom:32px;">Premium Sneaker Culture</p>
            <h3 style="font-size:20px;margin-bottom:12px;">Hey ${name}, we got your message!</h3>
            <p style="color:#aaa;line-height:1.7;">Thanks for reaching out. Our team will get back to you within 24 hours. We promise it'll be worth the wait.</p>
            <div style="margin-top:32px;padding:20px;background:#1a1a1a;border-radius:8px;">
              <p style="color:#666;font-size:13px;">Your message:</p>
              <p style="color:#ccc;margin-top:8px;line-height:1.7;">${message}</p>
            </div>
            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #2a2a2a;">
              <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} Hypsoul. All rights reserved.</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
