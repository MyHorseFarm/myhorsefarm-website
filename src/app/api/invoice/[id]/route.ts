import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const paidLabel = invoice.sent_at ? "PAID" : "PENDING";
  const paidColor = invoice.sent_at ? "#2d5016" : "#c00";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Invoice ${invoice.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #333; background: #f4f4f4; }
  .invoice { max-width: 700px; margin: 20px auto; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .header { background: #2d5016; color: #fff; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-size: 24px; }
  .header img { width: 70px; }
  .content { padding: 30px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
  .meta-block h3 { font-size: 13px; color: #999; text-transform: uppercase; margin-bottom: 5px; }
  .meta-block p { font-size: 15px; line-height: 1.6; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: bold; color: #fff; background: ${paidColor}; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { text-align: left; padding: 10px 12px; background: #f0f0f0; font-size: 13px; color: #666; }
  td { padding: 12px; border-bottom: 1px solid #eee; font-size: 15px; }
  .total-row td { font-weight: bold; font-size: 18px; border-top: 2px solid #2d5016; border-bottom: none; }
  .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #eee; }
  @media print {
    body { background: #fff; }
    .invoice { box-shadow: none; margin: 0; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div>
      <h1>INVOICE</h1>
      <p style="color:#d4a843;margin-top:5px;">${invoice.invoice_number}</p>
    </div>
    <img src="https://www.myhorsefarm.com/logo.png" alt="My Horse Farm" />
  </div>
  <div class="content">
    <div class="meta">
      <div class="meta-block">
        <h3>Bill To</h3>
        <p><strong>${escapeHtml(invoice.customer_name)}</strong></p>
        ${invoice.customer_email ? `<p>${escapeHtml(invoice.customer_email)}</p>` : ""}
      </div>
      <div class="meta-block">
        <h3>Invoice Details</h3>
        <p><strong>Date:</strong> ${invoice.service_date || invoice.created_at?.split("T")[0] || ""}</p>
        <p><strong>Status:</strong> <span class="status">${paidLabel}</span></p>
      </div>
      <div class="meta-block">
        <h3>From</h3>
        <p><strong>My Horse Farm</strong></p>
        <p>Royal Palm Beach, FL 33411</p>
        <p>(561) 576-7667</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHtml(invoice.service_description || "Service")}</td>
          <td style="text-align:right;">$${Number(invoice.amount).toFixed(2)}</td>
        </tr>
        <tr class="total-row">
          <td>Total</td>
          <td style="text-align:right;color:#2d5016;">$${Number(invoice.amount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="no-print" style="text-align:center;margin:30px 0;">
      <button onclick="window.print()" style="background:#2d5016;color:#fff;border:none;padding:12px 30px;border-radius:5px;font-size:15px;cursor:pointer;font-weight:bold;">
        Print / Save as PDF
      </button>
    </div>
  </div>
  <div class="footer">
    <p>My Horse Farm &middot; Royal Palm Beach, FL 33411 &middot; (561) 576-7667</p>
    <p>Thank you for your business!</p>
  </div>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
