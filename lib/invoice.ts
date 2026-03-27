/**
 * lib/invoice.ts
 * Generates a clean, branded PDF invoice for Hypsoul orders.
 * Uses jsPDF (client-side only — never call this on the server).
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CartItem, CustomerInfo } from "@/types";

export interface InvoiceData {
  orderId: string;
  createdAt: string;
  paymentMethod: string;
  paymentId?: string | null;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
}

// ─── Brand colours ────────────────────────────────────────────────────────────
const ACCENT   = [255, 60, 0]   as [number, number, number]; // #ff3c00
const BLACK    = [10, 10, 10]   as [number, number, number]; // #0a0a0a
const DARK     = [22, 22, 22]   as [number, number, number]; // #161616
const MID      = [90, 90, 90]   as [number, number, number]; // mid-grey
const LIGHT    = [200, 200, 200]as [number, number, number]; // light-grey
const WHITE    = [255, 255, 255]as [number, number, number];

function formatPrice(n: number) {
  return "Rs. " + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function generateInvoicePDF(data: InvoiceData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();   // 210
  const pageH = doc.internal.pageSize.getHeight();  // 297
  const margin = 18;
  const contentW = pageW - margin * 2;

  // ── BACKGROUND ────────────────────────────────────────────────────────────
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, pageW, pageH, "F");

  // ── TOP ACCENT BAR ────────────────────────────────────────────────────────
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageW, 2, "F");

  // ── HEADER BLOCK ─────────────────────────────────────────────────────────
  // Brand name
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("HYPSOUL", margin, 22);

  // Tagline
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text("PREMIUM SNEAKERS & STREETWEAR", margin, 27);

  // INVOICE label (right-aligned)
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ACCENT);
  doc.text("INVOICE", pageW - margin, 22, { align: "right" });

  // Divider
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.5);
  doc.line(margin, 32, pageW - margin, 32);

  // ── META ROW ──────────────────────────────────────────────────────────────
  let y = 40;

  // Left: invoice number + date
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text("Invoice No.", margin, y);
  doc.text("Date", margin + 60, y);
  doc.text("Payment", margin + 110, y);

  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text(data.orderId, margin, y);
  doc.text(formatDate(data.createdAt), margin + 60, y);
  doc.text(
    data.paymentMethod === "razorpay" ? "Online (Razorpay)" : "Cash on Delivery",
    margin + 110,
    y
  );

  // Payment ID (if available)
  if (data.paymentId) {
    y += 5;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MID);
    doc.text(`Payment ID: ${data.paymentId}`, margin, y);
  }

  // ── BILLING TO ───────────────────────────────────────────────────────────
  y += 12;
  doc.setFillColor(...DARK);
  doc.roundedRect(margin, y, contentW, 38, 2, 2, "F");

  const labelX = margin + 6;
  const valX   = margin + 42;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ACCENT);
  doc.text("BILLED TO", labelX, y + 7);

  const { customer } = data;
  const rows: [string, string][] = [
    ["Name",    customer.name],
    ["Email",   customer.email],
    ["Phone",   customer.phone],
    ["Address", `${customer.address}, ${customer.city}, ${customer.state} – ${customer.pincode}`],
  ];

  doc.setFont("helvetica", "normal");
  rows.forEach(([label, value], i) => {
    const rowY = y + 14 + i * 6;
    doc.setTextColor(...MID);
    doc.setFontSize(7.5);
    doc.text(label, labelX, rowY);
    doc.setTextColor(...WHITE);
    doc.setFontSize(8);
    // Wrap long address
    const lines = doc.splitTextToSize(value, contentW - valX - margin + labelX - 4);
    doc.text(lines[0], valX, rowY);
  });

  // ── ITEMS TABLE ───────────────────────────────────────────────────────────
  y += 46;

  const shipping = data.total >= 2999 ? 0 : 199;
  const subtotal = data.total - shipping;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Product", "Size", "Qty", "Unit Price", "Amount"]],
    body: data.items.map((item, idx) => [
      String(idx + 1),
      item.name,
      `UK ${item.size}`,
      String(item.quantity),
      formatPrice(item.price),
      formatPrice(item.price * item.quantity),
    ]),
    headStyles: {
      fillColor: ACCENT,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
    },
    bodyStyles: {
      fillColor: DARK,
      textColor: WHITE,
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [18, 18, 18] as [number, number, number],
    },
    columnStyles: {
      0: { cellWidth: 8,  halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 30, halign: "right" },
      5: { cellWidth: 30, halign: "right" },
    },
    tableLineColor: [40, 40, 40] as [number, number, number],
    tableLineWidth: 0.2,
    theme: "plain",
  });

  // ── TOTALS BOX ────────────────────────────────────────────────────────────
  const afterTable = (doc as any).lastAutoTable.finalY + 6;
  const totalsX = pageW - margin - 70;
  const totalsW = 70;

  const totalsRows: [string, string, boolean][] = [
    ["Subtotal", formatPrice(subtotal), false],
    ["Shipping", shipping === 0 ? "FREE" : formatPrice(shipping), false],
    ["TOTAL", formatPrice(data.total), true],
  ];

  let ty = afterTable;
  totalsRows.forEach(([label, value, isBold]) => {
    if (isBold) {
      doc.setFillColor(...ACCENT);
      doc.roundedRect(totalsX, ty - 4, totalsW, 10, 1.5, 1.5, "F");
      doc.setTextColor(...WHITE);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(...MID);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
    }
    doc.text(label, totalsX + 4, ty + 2);
    doc.text(value, totalsX + totalsW - 4, ty + 2, { align: "right" });
    ty += isBold ? 12 : 8;
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const footerY = pageH - 18;
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MID);
  doc.text("Thank you for shopping with Hypsoul.", margin, footerY);
  doc.text("All sales are final. For queries, contact support@hypsoul.store", margin, footerY + 5);
  doc.text(`hypsoul.store`, pageW - margin, footerY, { align: "right" });

  // Bottom accent line
  doc.setFillColor(...ACCENT);
  doc.rect(0, pageH - 2, pageW, 2, "F");

  // ── SAVE ──────────────────────────────────────────────────────────────────
  doc.save(`Hypsoul-Invoice-${data.orderId}.pdf`);
}
