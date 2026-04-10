import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";
import {
  listPayments,
  listInvoices,
  searchInvoices,
  createInvoice,
  publishInvoice,
  chargeCard,
  listAllSquareCustomers,
  listCustomerCards,
} from "@/lib/square";

export const runtime = "nodejs";
export const maxDuration = 60;

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

let _anthropic: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 2 });
  }
  return _anthropic;
}

const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";

const TOOLS: Anthropic.Tool[] = [
  {
    name: "get_dashboard_summary",
    description: "Get today's dashboard summary: pending charges, bookings, active customers, overdue invoices",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "list_payments",
    description: "List recent payments from Square",
    input_schema: {
      type: "object" as const,
      properties: {
        days: { type: "number", description: "Number of days back to look (default 7)" },
        status: { type: "string", description: "Filter by status: COMPLETED, FAILED, PENDING" },
      },
      required: [],
    },
  },
  {
    name: "list_invoices",
    description: "List invoices from Square, optionally filtered by status",
    input_schema: {
      type: "object" as const,
      properties: {
        status: { type: "string", description: "Filter: DRAFT, UNPAID, PAID, CANCELED, OVERDUE" },
      },
      required: [],
    },
  },
  {
    name: "search_customers",
    description: "Search customers by name, email, or phone",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search term (name, email, or phone)" },
      },
      required: ["query"],
    },
  },
  {
    name: "charge_customer",
    description: "Charge a specific pending service log by its ID",
    input_schema: {
      type: "object" as const,
      properties: {
        serviceLogId: { type: "string", description: "The service_log ID to charge" },
      },
      required: ["serviceLogId"],
    },
  },
  {
    name: "charge_all_pending",
    description: "Charge all pending service logs for today",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "create_invoice",
    description: "Create a Square invoice for a customer",
    input_schema: {
      type: "object" as const,
      properties: {
        customerId: { type: "string", description: "Square customer ID" },
        lineItems: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              amount: { type: "number", description: "Amount in dollars" },
              quantity: { type: "number", description: "Quantity (default 1)" },
            },
            required: ["description", "amount"],
          },
          description: "Line items for the invoice",
        },
        dueDate: { type: "string", description: "Due date YYYY-MM-DD" },
        note: { type: "string", description: "Optional note/title" },
        send: { type: "boolean", description: "Whether to publish/send the invoice immediately" },
      },
      required: ["customerId", "lineItems", "dueDate"],
    },
  },
  {
    name: "get_revenue_summary",
    description: "Get revenue summary for a period",
    input_schema: {
      type: "object" as const,
      properties: {
        days: { type: "number", description: "Number of days to look back (default 30)" },
      },
      required: [],
    },
  },
  {
    name: "get_overdue_invoices",
    description: "Get list of overdue invoices",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_upcoming_bookings",
    description: "Get upcoming bookings for the next N days",
    input_schema: {
      type: "object" as const,
      properties: {
        days: { type: "number", description: "Number of days ahead (default 7)" },
      },
      required: [],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      case "get_dashboard_summary": {
        const today = new Date().toISOString().slice(0, 10);
        const [pendingRes, bookingsRes, customersRes, overdueRes] = await Promise.all([
          supabase
            .from("service_logs")
            .select("id, total_amount, recurring_customers(name)")
            .eq("status", "pending")
            .eq("service_date", today),
          supabase
            .from("bookings")
            .select("id, customer_name, service_key, time_slot, status")
            .eq("booking_date", today),
          supabase
            .from("recurring_customers")
            .select("id", { count: "exact", head: true })
            .eq("active", true),
          supabase
            .from("invoices")
            .select("id", { count: "exact", head: true })
            .eq("status", "overdue"),
        ]);
        const pendingLogs = pendingRes.data || [];
        const pendingTotal = pendingLogs.reduce((s: number, l: { total_amount: number }) => s + (l.total_amount || 0), 0);
        return JSON.stringify({
          pendingCharges: pendingLogs.length,
          pendingTotal: `$${(pendingTotal / 100).toFixed(2)}`,
          pendingDetails: pendingLogs.slice(0, 10).map((l: any) => ({
            id: l.id,
            amount: `$${((l.total_amount || 0) / 100).toFixed(2)}`,
            customer: l.recurring_customers?.name || "Unknown",
          })),
          bookingsToday: (bookingsRes.data || []).length,
          bookings: (bookingsRes.data || []).slice(0, 10),
          activeCustomers: customersRes.count || 0,
          overdueInvoices: overdueRes.count || 0,
        });
      }

      case "list_payments": {
        const days = (input.days as number) || 7;
        const beginTime = new Date(Date.now() - days * 86400000).toISOString();
        const result = await listPayments({
          beginTime,
          status: input.status as string | undefined,
          limit: 20,
        });
        return JSON.stringify(
          result.payments.map((p) => ({
            id: p.id,
            status: p.status,
            amount: `$${(p.amountCents / 100).toFixed(2)}`,
            note: p.note,
            date: p.createdAt,
            card: p.last4 ? `${p.cardBrand} ****${p.last4}` : null,
          }))
        );
      }

      case "list_invoices": {
        const status = input.status as string | undefined;
        if (status) {
          const result = await searchInvoices(LOCATION_ID, { status: status.toUpperCase() });
          return JSON.stringify(
            result.invoices.slice(0, 20).map((inv) => ({
              id: inv.id,
              number: inv.invoiceNumber,
              status: inv.status,
              customer: inv.primaryRecipient
                ? `${inv.primaryRecipient.givenName || ""} ${inv.primaryRecipient.familyName || ""}`.trim()
                : "Unknown",
              amount: inv.paymentRequests[0]?.computedAmountMoney
                ? `$${(inv.paymentRequests[0].computedAmountMoney.amount / 100).toFixed(2)}`
                : null,
              dueDate: inv.paymentRequests[0]?.dueDate,
              url: inv.publicUrl,
            }))
          );
        }
        const result = await listInvoices(LOCATION_ID);
        return JSON.stringify(
          result.invoices.slice(0, 20).map((inv) => ({
            id: inv.id,
            number: inv.invoiceNumber,
            status: inv.status,
            customer: inv.primaryRecipient
              ? `${inv.primaryRecipient.givenName || ""} ${inv.primaryRecipient.familyName || ""}`.trim()
              : "Unknown",
            amount: inv.paymentRequests[0]?.computedAmountMoney
              ? `$${(inv.paymentRequests[0].computedAmountMoney.amount / 100).toFixed(2)}`
              : null,
            dueDate: inv.paymentRequests[0]?.dueDate,
          }))
        );
      }

      case "search_customers": {
        const query = (input.query as string).toLowerCase();
        const customers = await listAllSquareCustomers();
        const matches = customers.filter(
          (c) =>
            (c.givenName?.toLowerCase().includes(query)) ||
            (c.familyName?.toLowerCase().includes(query)) ||
            (c.email?.toLowerCase().includes(query)) ||
            (c.phone?.includes(query))
        );
        return JSON.stringify(
          matches.slice(0, 10).map((c) => ({
            id: c.id,
            name: `${c.givenName || ""} ${c.familyName || ""}`.trim(),
            email: c.email,
            phone: c.phone,
            address: c.address,
          }))
        );
      }

      case "charge_customer": {
        const logId = input.serviceLogId as string;
        const { data: log, error } = await supabase
          .from("service_logs")
          .select("*, recurring_customers(name, square_customer_id)")
          .eq("id", logId)
          .single();
        if (error || !log) return JSON.stringify({ error: `Service log ${logId} not found` });
        if (log.status !== "pending") return JSON.stringify({ error: `Service log is already ${log.status}` });

        const customerId = log.recurring_customers?.square_customer_id;
        if (!customerId) return JSON.stringify({ error: "Customer has no Square ID for charging" });

        const result = await chargeCard(
          customerId,
          log.total_amount,
          `${log.service_type || "Service"} - ${log.recurring_customers?.name || "Customer"}`
        );

        await supabase
          .from("service_logs")
          .update({ status: "charged", square_payment_id: result.paymentId })
          .eq("id", logId);

        return JSON.stringify({
          success: true,
          paymentId: result.paymentId,
          status: result.status,
          amount: `$${(log.total_amount / 100).toFixed(2)}`,
          customer: log.recurring_customers?.name,
          receiptUrl: result.receiptUrl,
        });
      }

      case "charge_all_pending": {
        const today = new Date().toISOString().slice(0, 10);
        const { data: logs } = await supabase
          .from("service_logs")
          .select("*, recurring_customers(name, square_customer_id)")
          .eq("status", "pending")
          .eq("service_date", today);

        if (!logs || logs.length === 0) return JSON.stringify({ message: "No pending charges for today" });

        const results = [];
        for (const log of logs) {
          const custId = log.recurring_customers?.square_customer_id;
          if (!custId) {
            results.push({ id: log.id, error: "No Square customer ID" });
            continue;
          }
          try {
            const r = await chargeCard(custId, log.total_amount, `${log.service_type} - ${log.recurring_customers?.name}`);
            await supabase
              .from("service_logs")
              .update({ status: "charged", square_payment_id: r.paymentId })
              .eq("id", log.id);
            results.push({ id: log.id, success: true, amount: `$${(log.total_amount / 100).toFixed(2)}`, customer: log.recurring_customers?.name });
          } catch (err: any) {
            results.push({ id: log.id, error: err.message });
          }
        }
        return JSON.stringify({ total: logs.length, results });
      }

      case "create_invoice": {
        const lineItems = ((input.lineItems as any[]) || []).map((item) => ({
          description: item.description,
          amount: item.amount,
          quantity: item.quantity || 1,
        }));
        const inv = await createInvoice(LOCATION_ID, {
          customerId: input.customerId as string,
          lineItems,
          dueDate: input.dueDate as string,
          note: input.note as string | undefined,
        });

        if (input.send) {
          const published = await publishInvoice(inv.id, inv.version);
          return JSON.stringify({
            success: true,
            invoiceId: published.id,
            status: published.status,
            publicUrl: published.publicUrl,
            message: "Invoice created and sent to customer",
          });
        }

        return JSON.stringify({
          success: true,
          invoiceId: inv.id,
          status: inv.status,
          message: "Invoice created as draft. Use 'send' to publish.",
        });
      }

      case "get_revenue_summary": {
        const days = (input.days as number) || 30;
        const beginTime = new Date(Date.now() - days * 86400000).toISOString();
        const result = await listPayments({ beginTime, status: "COMPLETED", limit: 100 });
        const total = result.payments.reduce((s, p) => s + p.amountCents, 0);
        const refunded = result.payments.reduce((s, p) => s + p.refundedAmountCents, 0);
        return JSON.stringify({
          period: `Last ${days} days`,
          totalRevenue: `$${(total / 100).toFixed(2)}`,
          totalRefunded: `$${(refunded / 100).toFixed(2)}`,
          netRevenue: `$${((total - refunded) / 100).toFixed(2)}`,
          transactionCount: result.payments.length,
        });
      }

      case "get_overdue_invoices": {
        try {
          const result = await searchInvoices(LOCATION_ID, { status: "OVERDUE" });
          return JSON.stringify(
            result.invoices.map((inv) => ({
              id: inv.id,
              number: inv.invoiceNumber,
              customer: inv.primaryRecipient
                ? `${inv.primaryRecipient.givenName || ""} ${inv.primaryRecipient.familyName || ""}`.trim()
                : "Unknown",
              amount: inv.paymentRequests[0]?.computedAmountMoney
                ? `$${(inv.paymentRequests[0].computedAmountMoney.amount / 100).toFixed(2)}`
                : null,
              dueDate: inv.paymentRequests[0]?.dueDate,
              url: inv.publicUrl,
            }))
          );
        } catch {
          // Fallback to supabase
          const { data } = await supabase
            .from("invoices")
            .select("*")
            .eq("status", "overdue")
            .order("created_at", { ascending: false })
            .limit(20);
          return JSON.stringify(data || []);
        }
      }

      case "get_upcoming_bookings": {
        const days = (input.days as number) || 7;
        const today = new Date().toISOString().slice(0, 10);
        const endDate = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
        const { data } = await supabase
          .from("bookings")
          .select("id, customer_name, customer_location, service_key, booking_date, time_slot, status")
          .gte("booking_date", today)
          .lte("booking_date", endDate)
          .order("booking_date", { ascending: true });
        return JSON.stringify(data || []);
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err: any) {
    return JSON.stringify({ error: err.message || "Tool execution failed" });
  }
}

// ---------------------------------------------------------------------------
// Tool name -> friendly label for streaming
// ---------------------------------------------------------------------------
const TOOL_LABELS: Record<string, string> = {
  get_dashboard_summary: "Fetching dashboard summary",
  list_payments: "Checking payments",
  list_invoices: "Looking up invoices",
  search_customers: "Searching customers",
  charge_customer: "Processing charge",
  charge_all_pending: "Charging all pending",
  create_invoice: "Creating invoice",
  get_revenue_summary: "Calculating revenue",
  get_overdue_invoices: "Checking overdue invoices",
  get_upcoming_bookings: "Loading bookings",
};

// ---------------------------------------------------------------------------
// POST handler — streaming SSE
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { messages } = await request.json();
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages array required" }), { status: 400 });
  }

  const anthropic = getAnthropicClient();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        let currentMessages: Anthropic.MessageParam[] = messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        for (let iteration = 0; iteration < 5; iteration++) {
          const response = await anthropic.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 2048,
            system: "You are the My Horse Farm admin assistant. You help manage the horse farm business operations. You can check payments, customers, invoices, schedules, and perform actions like charging customers and creating invoices. Be concise and actionable.",
            tools: TOOLS,
            messages: currentMessages,
            stream: true,
          });

          let fullText = "";
          const toolUses: { id: string; name: string; input: string }[] = [];
          let currentToolId = "";
          let currentToolName = "";
          let currentToolInput = "";

          for await (const event of response) {
            if (event.type === "content_block_start") {
              if (event.content_block.type === "text") {
                // text block started
              } else if (event.content_block.type === "tool_use") {
                currentToolId = event.content_block.id;
                currentToolName = event.content_block.name;
                currentToolInput = "";
                send("tool_start", { name: currentToolName, label: TOOL_LABELS[currentToolName] || currentToolName });
              }
            } else if (event.type === "content_block_delta") {
              if (event.delta.type === "text_delta") {
                fullText += event.delta.text;
                send("text", { text: event.delta.text });
              } else if (event.delta.type === "input_json_delta") {
                currentToolInput += event.delta.partial_json;
              }
            } else if (event.type === "content_block_stop") {
              if (currentToolId) {
                toolUses.push({ id: currentToolId, name: currentToolName, input: currentToolInput });
                currentToolId = "";
              }
            } else if (event.type === "message_stop") {
              // done
            }
          }

          // If no tool calls, we're done
          if (toolUses.length === 0) {
            send("done", { text: fullText });
            break;
          }

          // Build the assistant message content blocks
          const assistantContent: Anthropic.ContentBlockParam[] = [];
          if (fullText) {
            assistantContent.push({ type: "text", text: fullText });
          }
          for (const tool of toolUses) {
            let parsedInput = {};
            try {
              parsedInput = tool.input ? JSON.parse(tool.input) : {};
            } catch {
              parsedInput = {};
            }
            assistantContent.push({
              type: "tool_use",
              id: tool.id,
              name: tool.name,
              input: parsedInput,
            });
          }

          // Execute tools and build tool results
          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const tool of toolUses) {
            let parsedInput: Record<string, unknown> = {};
            try {
              parsedInput = tool.input ? JSON.parse(tool.input) : {};
            } catch {
              parsedInput = {};
            }
            const result = await executeTool(tool.name, parsedInput);
            send("tool_result", { name: tool.name, label: TOOL_LABELS[tool.name] || tool.name });
            toolResults.push({
              type: "tool_result",
              tool_use_id: tool.id,
              content: result,
            });
          }

          // Add to messages for next iteration
          currentMessages = [
            ...currentMessages,
            { role: "assistant", content: assistantContent },
            { role: "user", content: toolResults },
          ];
        }
      } catch (err: any) {
        send("error", { message: err.message || "An error occurred" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
