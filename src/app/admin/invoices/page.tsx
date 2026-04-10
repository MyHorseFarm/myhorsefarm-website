"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface Invoice {
  id: string;
  version: number;
  invoiceNumber: string | null;
  status: string;
  title: string | null;
  publicUrl: string | null;
  primaryRecipient: {
    customerId: string | null;
    givenName: string | null;
    familyName: string | null;
    emailAddress: string | null;
    companyName: string | null;
  } | null;
  paymentRequests: {
    uid: string | null;
    requestType: string | null;
    dueDate: string | null;
    totalMoney: { amount: number; currency: string } | null;
    computedAmountMoney: { amount: number; currency: string } | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface SquareCustomer {
  id: string;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
}

interface LineItem {
  description: string;
  amount: string;
  quantity: string;
}

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "UNPAID", label: "Sent/Unpaid" },
  { key: "PAID", label: "Paid" },
  { key: "OVERDUE", label: "Overdue" },
  { key: "CANCELED", label: "Canceled" },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    DRAFT: "bg-gray-200 text-gray-700",
    UNPAID: "bg-blue-100 text-blue-800",
    SENT: "bg-blue-100 text-blue-800",
    SCHEDULED: "bg-blue-100 text-blue-800",
    PARTIALLY_PAID: "bg-amber-100 text-amber-800",
    PAID: "bg-green-100 text-green-800",
    PARTIALLY_REFUNDED: "bg-amber-100 text-amber-700",
    REFUNDED: "bg-red-100 text-red-700",
    CANCELED: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
    PAYMENT_PENDING: "bg-amber-100 text-amber-700",
  };
  return map[status] || "bg-gray-200 text-gray-700";
}

function getInvoiceAmount(inv: Invoice): number {
  const pr = inv.paymentRequests?.[0];
  if (pr?.computedAmountMoney) return pr.computedAmountMoney.amount;
  if (pr?.totalMoney) return pr.totalMoney.amount;
  return 0;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function recipientName(inv: Invoice): string {
  const r = inv.primaryRecipient;
  if (!r) return "—";
  const name = [r.givenName, r.familyName].filter(Boolean).join(" ");
  return name || r.companyName || r.emailAddress || "—";
}

function isOverdue(inv: Invoice): boolean {
  if (inv.status !== "UNPAID" && inv.status !== "SENT") return false;
  const dueDate = inv.paymentRequests?.[0]?.dueDate;
  if (!dueDate) return false;
  return new Date(dueDate + "T23:59:59") < new Date();
}

export default function InvoicesPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [customers, setCustomers] = useState<SquareCustomer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<SquareCustomer | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", amount: "", quantity: "1" },
  ]);
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);

  const headers = useCallback(
    () => adminHeaders(token || undefined),
    [token],
  );

  const fetchInvoices = useCallback(
    async (authToken?: string) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") {
          if (statusFilter === "UNPAID") {
            params.set("status", "UNPAID");
          } else {
            params.set("status", statusFilter);
          }
        }
        const url = `/api/admin/invoices${params.toString() ? "?" + params.toString() : ""}`;
        const res = await fetch(url, {
          headers: adminHeaders(authToken || token || undefined),
        });
        if (!res.ok) throw new Error("Failed to fetch invoices");
        const data = await res.json();
        setInvoices(data.invoices || []);
        setAuthed(true);
      } catch {
        setError("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    },
    [token, statusFilter],
  );

  const fetchCustomers = useCallback(
    async (authToken?: string) => {
      try {
        const res = await fetch("/api/admin/customers", {
          headers: adminHeaders(authToken || token || undefined),
        });
        if (!res.ok) return;
        const data = await res.json();
        setCustomers(
          (data.customers || []).map(
            (c: Record<string, unknown>) => ({
              id: (c.square_customer_id as string) || "",
              givenName: ((c.name as string) || "").split(" ")[0] || null,
              familyName: ((c.name as string) || "").split(" ").slice(1).join(" ") || null,
              email: (c.email as string) || null,
            }),
          ).filter((c: SquareCustomer) => c.id),
        );
      } catch {
        // non-critical
      }
    },
    [token],
  );

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchInvoices(saved);
      fetchCustomers(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authed) fetchInvoices();
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchInvoices(token);
    await fetchCustomers(token);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }
    const items = lineItems.filter((li) => li.description && li.amount);
    if (!items.length) {
      setError("Add at least one line item");
      return;
    }
    if (!dueDate) {
      setError("Due date is required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          lineItems: items.map((li) => ({
            description: li.description,
            amount: parseFloat(li.amount),
            quantity: parseInt(li.quantity) || 1,
          })),
          dueDate,
          note: note || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create invoice");
      }
      setShowCreate(false);
      setSelectedCustomer(null);
      setLineItems([{ description: "", amount: "", quantity: "1" }]);
      setDueDate("");
      setNote("");
      await fetchInvoices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const handleAction = async (
    invoiceId: string,
    version: number,
    action: "publish" | "cancel",
  ) => {
    setActionLoading(invoiceId);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ invoiceId, version, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action} invoice`);
      }
      await fetchInvoices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `${action} failed`);
    } finally {
      setActionLoading(null);
    }
  };

  const addLineItem = () =>
    setLineItems([...lineItems, { description: "", amount: "", quantity: "1" }]);

  const removeLineItem = (idx: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const updateLineItem = (idx: number, field: keyof LineItem, value: string) => {
    setLineItems(lineItems.map((li, i) => (i === idx ? { ...li, [field]: value } : li)));
  };

  const filteredCustomers = customers.filter((c) => {
    if (!customerSearch) return true;
    const q = customerSearch.toLowerCase();
    const name = [c.givenName, c.familyName].filter(Boolean).join(" ").toLowerCase();
    return name.includes(q) || (c.email && c.email.toLowerCase().includes(q));
  });

  const displayInvoices = invoices.filter((inv) => {
    if (statusFilter === "OVERDUE") return isOverdue(inv);
    return true; // API already filters by status
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700"
          >
            + Create Invoice
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded">
            {error}
          </p>
        )}

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-1 mb-4 bg-white rounded-lg shadow p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? "bg-green-800 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create invoice modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleCreate}
              className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-bold mb-4">Create Invoice</h2>

              {/* Customer selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Customer *
                </label>
                {selectedCustomer ? (
                  <div className="flex items-center justify-between border rounded px-3 py-2">
                    <span className="text-sm font-medium">
                      {[selectedCustomer.givenName, selectedCustomer.familyName]
                        .filter(Boolean)
                        .join(" ")}
                      {selectedCustomer.email && (
                        <span className="text-gray-400 ml-2 text-xs">
                          {selectedCustomer.email}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="text-red-500 text-xs underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm mb-1"
                    />
                    <div className="max-h-40 overflow-y-auto border rounded">
                      {filteredCustomers.length === 0 ? (
                        <p className="text-xs text-gray-400 p-3">
                          No customers found
                        </p>
                      ) : (
                        filteredCustomers.slice(0, 20).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerSearch("");
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 border-b last:border-b-0"
                          >
                            <span className="font-medium">
                              {[c.givenName, c.familyName]
                                .filter(Boolean)
                                .join(" ")}
                            </span>
                            {c.email && (
                              <span className="text-gray-400 ml-2 text-xs">
                                {c.email}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Line items */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Line Items *
                </label>
                <div className="space-y-2">
                  {lineItems.map((li, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Description"
                        value={li.description}
                        onChange={(e) =>
                          updateLineItem(idx, "description", e.target.value)
                        }
                        className="flex-1 border rounded px-2 py-1.5 text-sm"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="$"
                        value={li.amount}
                        onChange={(e) =>
                          updateLineItem(idx, "amount", e.target.value)
                        }
                        className="w-24 border rounded px-2 py-1.5 text-sm"
                        required
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={li.quantity}
                        onChange={(e) =>
                          updateLineItem(idx, "quantity", e.target.value)
                        }
                        className="w-16 border rounded px-2 py-1.5 text-sm"
                      />
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(idx)}
                          className="text-red-500 text-xs px-1 py-1.5"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="mt-2 text-green-800 text-xs font-semibold underline"
                >
                  + Add line item
                </button>
              </div>

              {/* Due date */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* Note */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Additional note for the customer..."
                />
              </div>

              {/* Total preview */}
              {lineItems.some((li) => li.amount) && (
                <div className="bg-gray-50 rounded p-3 mb-4 text-sm">
                  <span className="font-medium">Total: </span>
                  <span className="font-bold text-green-800">
                    $
                    {lineItems
                      .reduce(
                        (sum, li) =>
                          sum +
                          (parseFloat(li.amount) || 0) *
                            (parseInt(li.quantity) || 1),
                        0,
                      )
                      .toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex gap-2 mt-5">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Draft"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setError("");
                  }}
                  className="flex-1 border py-2 rounded font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Detail modal */}
        {detailInvoice && (
          <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
            <div className="bg-white rounded-t-lg md:rounded-lg w-full md:max-w-lg max-h-[85vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  Invoice {detailInvoice.invoiceNumber || detailInvoice.id.slice(0, 8)}
                </h2>
                <button
                  onClick={() => setDetailInvoice(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(
                        isOverdue(detailInvoice) ? "OVERDUE" : detailInvoice.status,
                      )}`}
                    >
                      {isOverdue(detailInvoice) ? "OVERDUE" : detailInvoice.status}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Customer</dt>
                  <dd className="font-medium">{recipientName(detailInvoice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Amount</dt>
                  <dd className="font-bold">
                    {formatCents(getInvoiceAmount(detailInvoice))}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Due Date</dt>
                  <dd>
                    {detailInvoice.paymentRequests?.[0]?.dueDate || "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd>
                    {new Date(detailInvoice.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                {detailInvoice.title && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Note</dt>
                    <dd>{detailInvoice.title}</dd>
                  </div>
                )}
                {detailInvoice.publicUrl && (
                  <div className="pt-2">
                    <a
                      href={detailInvoice.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline text-sm"
                    >
                      View Public Invoice →
                    </a>
                  </div>
                )}
              </dl>
              <div className="flex gap-2 mt-5">
                {detailInvoice.status === "DRAFT" && (
                  <button
                    onClick={() => {
                      handleAction(
                        detailInvoice.id,
                        detailInvoice.version,
                        "publish",
                      );
                      setDetailInvoice(null);
                    }}
                    className="flex-1 bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-600"
                  >
                    Send Invoice
                  </button>
                )}
                {(detailInvoice.status === "DRAFT" ||
                  detailInvoice.status === "UNPAID" ||
                  detailInvoice.status === "SENT" ||
                  detailInvoice.status === "SCHEDULED") && (
                  <button
                    onClick={() => {
                      handleAction(
                        detailInvoice.id,
                        detailInvoice.version,
                        "cancel",
                      );
                      setDetailInvoice(null);
                    }}
                    className="flex-1 border border-red-500 text-red-500 py-2 rounded font-semibold hover:bg-red-50"
                  >
                    Cancel Invoice
                  </button>
                )}
                <button
                  onClick={() => setDetailInvoice(null)}
                  className="flex-1 border py-2 rounded font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice list */}
        {loading ? (
          <p className="text-gray-500">Loading invoices...</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Invoice #</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Due Date</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayInvoices.map((inv) => (
                    <tr key={inv.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">
                        {inv.invoiceNumber || inv.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {recipientName(inv)}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatCents(getInvoiceAmount(inv))}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(
                            isOverdue(inv) ? "OVERDUE" : inv.status,
                          )}`}
                        >
                          {isOverdue(inv) ? "OVERDUE" : inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {inv.paymentRequests?.[0]?.dueDate || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDetailInvoice(inv)}
                            className="text-green-800 text-xs underline"
                          >
                            View
                          </button>
                          {inv.status === "DRAFT" && (
                            <button
                              onClick={() =>
                                handleAction(inv.id, inv.version, "publish")
                              }
                              disabled={actionLoading === inv.id}
                              className="text-blue-700 text-xs underline disabled:opacity-50"
                            >
                              {actionLoading === inv.id ? "..." : "Send"}
                            </button>
                          )}
                          {(inv.status === "DRAFT" ||
                            inv.status === "UNPAID" ||
                            inv.status === "SENT" ||
                            inv.status === "SCHEDULED") && (
                            <button
                              onClick={() =>
                                handleAction(inv.id, inv.version, "cancel")
                              }
                              disabled={actionLoading === inv.id}
                              className="text-red-600 text-xs underline disabled:opacity-50"
                            >
                              {actionLoading === inv.id ? "..." : "Cancel"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayInvoices.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {displayInvoices.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
                  No invoices found.
                </div>
              ) : (
                displayInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{recipientName(inv)}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {inv.invoiceNumber || inv.id.slice(0, 8)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(
                          isOverdue(inv) ? "OVERDUE" : inv.status,
                        )}`}
                      >
                        {isOverdue(inv) ? "OVERDUE" : inv.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-green-800">
                        {formatCents(getInvoiceAmount(inv))}
                      </span>
                      <span className="text-gray-500">
                        Due: {inv.paymentRequests?.[0]?.dueDate || "—"}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <button
                        onClick={() => setDetailInvoice(inv)}
                        className="text-green-800 text-xs font-semibold underline"
                      >
                        View
                      </button>
                      {inv.status === "DRAFT" && (
                        <button
                          onClick={() =>
                            handleAction(inv.id, inv.version, "publish")
                          }
                          disabled={actionLoading === inv.id}
                          className="text-blue-700 text-xs font-semibold underline disabled:opacity-50"
                        >
                          Send
                        </button>
                      )}
                      {(inv.status === "DRAFT" ||
                        inv.status === "UNPAID" ||
                        inv.status === "SENT") && (
                        <button
                          onClick={() =>
                            handleAction(inv.id, inv.version, "cancel")
                          }
                          disabled={actionLoading === inv.id}
                          className="text-red-600 text-xs font-semibold underline disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
