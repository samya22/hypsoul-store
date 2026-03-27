import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Verify your Hypsoul account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111;">Verify your email</h2>
        <p>Thanks for signing up to Hypsoul. Click the link below to verify your email address.</p>
        <a href="${verifyUrl}" style="display:inline-block;margin-top:12px;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
        <p style="margin-top:24px;color:#666;font-size:13px;">This link expires in 1 hour. If you didn't sign up, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  order: {
    orderId: string;
    customerName: string;
    items: { name: string; size: string; quantity: number; price: number }[];
    total: number;
    paymentMethod: string;
    address: string;
  }
) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name} — UK ${item.size}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">×${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>`
    )
    .join("");

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Order Confirmed — ${order.orderId}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111;">
        <h2 style="margin-bottom:4px;">Order Confirmed!</h2>
        <p style="color:#555;margin-top:0;">Hi ${order.customerName}, your order has been placed successfully.</p>

        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
          <p style="margin:0;font-weight:700;font-size:14px;">${order.orderId}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr>
              <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #111;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Item</th>
              <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #111;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Qty</th>
              <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #111;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align:right;margin-top:12px;font-size:16px;font-weight:700;">
          Total: ₹${order.total.toLocaleString("en-IN")}
        </div>

        <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#555;">
          <p style="margin:0 0 4px;"><strong>Payment:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}</p>
          <p style="margin:0;"><strong>Shipping to:</strong> ${order.address}</p>
        </div>

        <p style="margin-top:24px;font-size:12px;color:#999;">
          If you have any questions, contact us at support@hypsoul.in
        </p>
      </div>
    `,
  });
}