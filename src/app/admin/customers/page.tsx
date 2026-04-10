"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";
import { csvFromArray, downloadCsv } from "@/lib/csv-export";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  square_customer_id: string | null;
  default_service: string;
  default_bin_rate: number;
  notes: string | null;
  active: boolean;
  auto_charge: boolean;
  charge_frequency: "daily" | "weekly" | "biweekly" | "monthly" | null;
  next_charge_date: string | null;
  default_bins: number;
  contract_type: string;
  contract_end_date: string | null;
  contract_discount_pct: number;
  created_at: string;
  lifetime_value?: number | null;
}

interface ServiceLogEntry {
  id: string;
  service_date: string;
  bins_collected: number;
  bin_rate: number;
  total_amount: number;
  status: string;
  crew_member: string | null;
  notes: string | null;
  photo_url: string | null;
}

interface InvoiceEntry {
  id: string;
  invoice_number: string;
  amount: number;
  service_date: string | null;
}

interface SquarePayment {
  id: string;
  status: string;
  amount: number;
  amountCents: number;
  currency: string;
  refundedAmount: number;
  note: string | null;
  receiptUrl: string | null;
  createdAt: string;
  sourceType: string | null;
  last4: string | null;
  cardBrand: string | null;
}

interface LifetimeValueData {
  totalPayments: number;
  lifetimeValue: number;
  averagePayment: number;
  firstServiceDate: string | null;
  lastServiceDate: string | null;
  totalServicesCount: number;
}

type FormData = Omit<Customer, "id" | "created_at" | "lifetime_value">;

const SERVICE_OPTIONS: { key: string; label: string; defaultRate: number; unit: string }[] = [
  { key: "trash_bin_service", label: "Trash Bin Service", defaultRate: 25.0, unit: "per bin" },
  { key: "manure_removal", label: "Manure Removal", defaultRate: 350.0, unit: "per load" },
  { key: "junk_removal", label: "Junk Removal", defaultRate: 75.0, unit: "per ton" },
  { key: "fill_dirt", label: "Fill Dirt Delivery", defaultRate: 35.0, unit: "per yard" },
  { key: "dumpster_rental", label: "Dumpster Rental", defaultRate: 450.0, unit: "flat" },
  { key: "sod_installation", label: "Sod Installation", defaultRate: 0.85, unit: "per sqft" },
  { key: "farm_repairs", label: "Farm Repairs", defaultRate: 0, unit: "flat" },
  { key: "millings_asphalt", label: "Millings Asphalt", defaultRate: 30.0, unit: "per yard" },
];

function extractArea(address: string | null): string {
  if (!address) return "Unknown";
  // Match "City, FL" or "City, FL ZIP" pattern
  const match = address.match(/([A-Za-z ]+),\s*FL/i);
  if (match) return match[1].trim();
  // Fallback: second-to-last comma segment
  const parts = address.split(",").map((s) => s.trim());
  if (parts.length >= 2) return parts[parts.length - 2];
  return "Unknown";
}

function serviceLabel(key: string): string {
  return SERVICE_OPTIONS.find((s) => s.key === key)?.label || key.replace(/_/g, " ");
}

function serviceUnit(key: string): string {
  return SERVICE_OPTIONS.find((s) => s.key === key)?.unit || "";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// Mini bar chart component for payment trends (last 6 months)
function PaymentTrendChart({ payments }: { payments: SquarePayment[] }) {
  const now = new Date();
  const months: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-US", { month: "short" }),
      total: 0,
    });
  }

  for (const p of payments) {
    const pDate = new Date(p.createdAt);
    for (let i = 0; i < months.length; i++) {
      const refDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
      if (pDate >= refDate && pDate < nextDate) {
        months[i].total += p.amount - p.refundedAmount;
        break;
      }
    }
  }

  const maxVal = Math.max(...months.map((m) => m.total), 1);

  return (
    <div className="mt-3">
      <h4 className="text-xs font-semibold text-gray-500 mb-2">Payment Trend (Last 6 Months)</h4>
      <div className="flex items-end gap-1 h-20">
        {months.map((m, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-green-500 rounded-t transition-all"
              style={{ height: `${Math.max((m.total / maxVal) * 100, 2)}%` }}
              title={formatCurrency(m.total)}
            />
            <span className="text-[9px] text-gray-400">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-gray-400 mt-1">
        <span>{formatCurrency(0)}</span>
        <span>{formatCurrency(maxVal)}</span>
      </div>
    </div>
  );
}

const emptyForm: FormData = {
  name: "",
  email: null,
  phone: null,
  address: null,
  square_customer_id: null,
  default_service: "trash_bin_service",
  default_bin_rate: 25.0,
  notes: null,
  active: true,
  auto_charge: false,
  charge_frequency: null,
  next_charge_date: null,
  default_bins: 1,
  contract_type: "month_to_month",
  contract_end_date: null,
  contract_discount_pct: 0,
};

export default function CustomersPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [historyLogs, setHistoryLogs] = useState<ServiceLogEntry[]>([]);
  const [historyInvoices, setHistoryInvoices] = useState<InvoiceEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkService, setBulkService] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "route">("table");

  // Square payments & lifetime value state
  const [historyTab, setHistoryTab] = useState<"services" | "payments" | "lifetime">("services");
  const [squarePayments, setSquarePayments] = useState<SquarePayment[]>([]);
  const [lifetimeData, setLifetimeData] = useState<LifetimeValueData | null>(null);
  const [squarePaymentsLoading, setSquarePaymentsLoading] = useState(false);

  const headers = useCallback(
    () => adminHeaders(token || undefined),
    [token],
  );

  const fetchCustomers = useCallback(async (authToken?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", { headers: adminHeaders(authToken || token || undefined) });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCustomers(data.customers);
      setAuthed(true);
    } catch {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-login from session on mount
  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchCustomers(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchCustomers(token);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      square_customer_id: c.square_customer_id,
      default_service: c.default_service || "trash_bin_service",
      default_bin_rate: c.default_bin_rate,
      notes: c.notes,
      active: c.active,
      auto_charge: c.auto_charge ?? false,
      charge_frequency: c.charge_frequency ?? null,
      next_charge_date: c.next_charge_date ?? null,
      default_bins: c.default_bins ?? 1,
      contract_type: c.contract_type || "month_to_month",
      contract_end_date: c.contract_end_date ?? null,
      contract_discount_pct: c.contract_discount_pct ?? 0,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch("/api/admin/customers", {
        method,
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setShowForm(false);
      await fetchCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleImportSquare = async () => {
    setImporting(true);
    setImportResult("");
    setError("");
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: headers(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Import failed");
      }
      const { imported, updated, skipped, serviceUpdated, lifetimeValuesUpdated } = await res.json();
      setImportResult(
        `Imported ${imported}, updated ${updated}, skipped ${skipped}` +
        `${serviceUpdated ? `, services detected: ${serviceUpdated}` : ""}` +
        `${lifetimeValuesUpdated ? `, lifetime values: ${lifetimeValuesUpdated}` : ""}`
      );
      await fetchCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const toggleActive = async (c: Customer) => {
    try {
      await fetch("/api/admin/customers", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ id: c.id, active: !c.active }),
      });
      await fetchCustomers();
    } catch {
      setError("Failed to update");
    }
  };

  const fetchSquareData = async (c: Customer) => {
    if (!c.square_customer_id) return;
    setSquarePaymentsLoading(true);
    try {
      const [payRes, lvRes] = await Promise.all([
        fetch(`/api/admin/customers?action=payment-history&customerId=${c.square_customer_id}`, { headers: headers() }),
        fetch(`/api/admin/customers?action=lifetime-value&customerId=${c.square_customer_id}`, { headers: headers() }),
      ]);
      if (payRes.ok) {
        const payData = await payRes.json();
        setSquarePayments(payData.payments ?? []);
      }
      if (lvRes.ok) {
        const lvData = await lvRes.json();
        setLifetimeData(lvData);
      }
    } catch {
      /* ignore - data just won't show */
    } finally {
      setSquarePaymentsLoading(false);
    }
  };

  const openHistory = async (c: Customer) => {
    setHistoryCustomer(c);
    setHistoryLogs([]);
    setHistoryInvoices([]);
    setSquarePayments([]);
    setLifetimeData(null);
    setHistoryTab("services");
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${c.id}/history`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setHistoryLogs(data.logs);
        setHistoryInvoices(data.invoices);
      }
    } catch { /* ignore */ } finally {
      setHistoryLoading(false);
    }
    // Also fetch Square payment data
    fetchSquareData(c);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkService || selected.size === 0) return;
    setBulkUpdating(true);
    setError("");
    try {
      const svc = SERVICE_OPTIONS.find((s) => s.key === bulkService);
      const updates: Record<string, unknown> = { default_service: bulkService };
      if (svc) updates.default_bin_rate = svc.defaultRate;
      const res = await fetch("/api/admin/customers", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ ids: Array.from(selected), updates }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bulk update failed");
      }
      setSelected(new Set());
      setBulkService("");
      await fetchCustomers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bulk update failed");
    } finally {
      setBulkUpdating(false);
    }
  };

  const exportCsv = () => {
    const csv = csvFromArray(filtered, [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "address", label: "Address" },
      { key: "default_service", label: "Service" },
      { key: "default_bin_rate", label: "Rate" },
      { key: "default_bins", label: "Qty" },
      { key: "auto_charge", label: "Auto-Charge" },
      { key: "charge_frequency", label: "Frequency" },
      { key: "active", label: "Active" },
      { key: "lifetime_value", label: "Lifetime Value" },
    ]);
    downloadCsv(csv, `customers-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const filtered = customers.filter((c) => {
    if (filterStatus === "active" && !c.active) return false;
    if (filterStatus === "inactive" && c.active) return false;
    if (filterService !== "all" && c.default_service !== filterService) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q));
      if (!match) return false;
    }
    return true;
  });

  const customersByArea = filtered.reduce<Record<string, Customer[]>>((acc, c) => {
    const area = extractArea(c.address);
    if (!acc[area]) acc[area] = [];
    acc[area].push(c);
    return acc;
  }, {});
  const sortedAreas = Object.keys(customersByArea).sort();

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Recurring Customers</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={exportCsv}
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={handleImportSquare}
              disabled={importing}
              className="border border-blue-700 text-blue-700 px-4 py-2 rounded text-sm font-semibold hover:bg-blue-50 disabled:opacity-50"
            >
              {importing ? "Syncing..." : "Sync from Square"}
            </button>
            <a
              href="/enroll"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-green-800 text-green-800 px-4 py-2 rounded text-sm font-semibold hover:bg-green-50"
            >
              Enroll Customer
            </a>
            <button
              onClick={openNew}
              className="bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700"
            >
              + Add Customer
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {importResult && (
          <p className="text-blue-700 text-sm mb-4 bg-blue-50 px-3 py-2 rounded">{importResult}</p>
        )}

        {/* Search & filter bar */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search name, address, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Services</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === "table" ? "route" : "table")}
            className={`px-3 py-2 rounded text-sm font-medium ${
              viewMode === "route"
                ? "bg-green-800 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-50"
            }`}
          >
            {viewMode === "route" ? "Table View" : "Route View"}
          </button>
          <span className="text-xs text-gray-400 self-center">
            {filtered.length} of {customers.length}
          </span>
        </div>

        {/* Customer form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg font-bold mb-4">
                {editing ? "Edit Customer" : "New Customer"}
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value || null })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone || ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value || null })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={form.address || ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value || null })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <select
                    value={form.default_service}
                    onChange={(e) => {
                      const svc = SERVICE_OPTIONS.find((s) => s.key === e.target.value);
                      setForm({
                        ...form,
                        default_service: e.target.value,
                        default_bin_rate: svc?.defaultRate ?? form.default_bin_rate,
                      });
                    }}
                    className="w-full border rounded px-3 py-2"
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label} ({s.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rate ($ {serviceUnit(form.default_service)})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.default_bin_rate}
                    onChange={(e) =>
                      setForm({ ...form, default_bin_rate: parseFloat(e.target.value) || 25 })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Square Customer ID</label>
                  <input
                    type="text"
                    value={form.square_customer_id || ""}
                    onChange={(e) =>
                      setForm({ ...form, square_customer_id: e.target.value || null })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="From Square Dashboard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={form.notes || ""}
                    onChange={(e) => setForm({ ...form, notes: e.target.value || null })}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    placeholder="Gate code, stall count, etc."
                  />
                </div>
                <div className="border-t pt-3 mt-1">
                  <p className="text-sm font-semibold mb-2">Auto-Charge Settings</p>
                  <label className="flex items-center gap-2 text-sm mb-3">
                    <input
                      type="checkbox"
                      checked={form.auto_charge}
                      onChange={(e) => setForm({ ...form, auto_charge: e.target.checked })}
                    />
                    Enable Auto-Charge
                  </label>
                  {form.auto_charge && (
                    <div className="space-y-3 pl-1">
                      <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <select
                          value={form.charge_frequency || "weekly"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              charge_frequency: e.target.value as FormData["charge_frequency"],
                            })
                          }
                          className="w-full border rounded px-3 py-2 text-sm"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Biweekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Next Charge Date</label>
                        <input
                          type="date"
                          value={form.next_charge_date || ""}
                          onChange={(e) =>
                            setForm({ ...form, next_charge_date: e.target.value || null })
                          }
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Default Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={form.default_bins}
                          onChange={(e) =>
                            setForm({ ...form, default_bins: parseInt(e.target.value) || 1 })
                          }
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {form.default_bins} &times; ${Number(form.default_bin_rate).toFixed(2)} = ${(form.default_bins * form.default_bin_rate).toFixed(2)} per service
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  type="submit"
                  className="flex-1 bg-green-800 text-white py-2 rounded font-semibold hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Service history panel — enhanced with Square payments & lifetime value */}
        {historyCustomer && (
          <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
            <div className="bg-white rounded-t-lg md:rounded-lg w-full md:max-w-2xl max-h-[85vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{historyCustomer.name} — History</h2>
                <button
                  onClick={() => setHistoryCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setHistoryTab("services")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    historyTab === "services"
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Services & Invoices
                </button>
                <button
                  onClick={() => setHistoryTab("payments")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    historyTab === "payments"
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={!historyCustomer.square_customer_id}
                >
                  Square Payments
                  {!historyCustomer.square_customer_id && (
                    <span className="ml-1 text-[10px] text-gray-400">(not linked)</span>
                  )}
                </button>
                <button
                  onClick={() => setHistoryTab("lifetime")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    historyTab === "lifetime"
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={!historyCustomer.square_customer_id}
                >
                  Lifetime Value
                </button>
              </div>

              {/* Tab: Services & Invoices */}
              {historyTab === "services" && (
                <>
                  {historyLoading ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold mb-2">Service Logs ({historyLogs.length})</h3>
                      {historyLogs.length === 0 ? (
                        <p className="text-xs text-gray-400 mb-4">No service logs yet.</p>
                      ) : (
                        <div className="space-y-2 mb-4">
                          {historyLogs.map((log) => (
                            <div key={log.id} className="border rounded p-3 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{log.service_date}</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    log.status === "charged"
                                      ? "bg-green-100 text-green-800"
                                      : log.status === "failed"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </div>
                              <p className="text-gray-600">
                                {log.bins_collected} &times; ${Number(log.bin_rate).toFixed(2)} = ${Number(log.total_amount).toFixed(2)}
                              </p>
                              {log.crew_member && (
                                <p className="text-xs text-gray-400">Crew: {log.crew_member}</p>
                              )}
                              {log.notes && (
                                <p className="text-xs text-gray-400">{log.notes}</p>
                              )}
                              {log.photo_url && (
                                <a href={log.photo_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-1">
                                  <img src={log.photo_url} alt="Service photo" className="w-14 h-14 object-cover rounded border" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <h3 className="text-sm font-semibold mb-2">Invoices ({historyInvoices.length})</h3>
                      {historyInvoices.length === 0 ? (
                        <p className="text-xs text-gray-400">No invoices yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {historyInvoices.map((inv) => (
                            <div key={inv.id} className="border rounded p-3 text-sm flex justify-between items-center">
                              <div>
                                <a
                                  href={`/api/invoice/${inv.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 underline font-medium"
                                >
                                  {inv.invoice_number}
                                </a>
                                {inv.service_date && (
                                  <span className="text-gray-400 text-xs ml-2">{inv.service_date}</span>
                                )}
                              </div>
                              <span className="font-medium">${Number(inv.amount).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Tab: Square Payments */}
              {historyTab === "payments" && (
                <>
                  {squarePaymentsLoading ? (
                    <p className="text-gray-500 text-sm">Loading Square payments...</p>
                  ) : squarePayments.length === 0 ? (
                    <p className="text-xs text-gray-400">No Square payments found.</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 mb-2">{squarePayments.length} payment{squarePayments.length !== 1 ? "s" : ""} found</p>
                      {squarePayments.map((p) => (
                        <div key={p.id} className="border rounded p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{formatCurrency(p.amount)}</span>
                              {p.refundedAmount > 0 && (
                                <span className="text-red-600 text-xs ml-2">
                                  (-{formatCurrency(p.refundedAmount)} refund)
                                </span>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              p.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : p.status === "FAILED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(p.createdAt)}
                            {p.cardBrand && p.last4 && (
                              <span className="ml-2">{p.cardBrand} ····{p.last4}</span>
                            )}
                            {p.sourceType && (
                              <span className="ml-2 text-gray-400">{p.sourceType}</span>
                            )}
                          </p>
                          {p.note && <p className="text-xs text-gray-400 mt-1">{p.note}</p>}
                          {p.receiptUrl && (
                            <a
                              href={p.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 text-xs underline mt-1 inline-block"
                            >
                              View Receipt
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Tab: Lifetime Value */}
              {historyTab === "lifetime" && (
                <>
                  {squarePaymentsLoading ? (
                    <p className="text-gray-500 text-sm">Loading lifetime data...</p>
                  ) : !lifetimeData ? (
                    <p className="text-xs text-gray-400">No lifetime data available.</p>
                  ) : (
                    <div>
                      {/* Lifetime Value Card */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <p className="text-xs text-green-700 font-medium">Total Spent</p>
                          <p className="text-2xl font-bold text-green-800">
                            {formatCurrency(lifetimeData.lifetimeValue)}
                          </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <p className="text-xs text-blue-700 font-medium">Avg Payment</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {formatCurrency(lifetimeData.averagePayment)}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-xs text-gray-500 font-medium">First Service</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatDate(lifetimeData.firstServiceDate)}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-xs text-gray-500 font-medium">Last Service</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatDate(lifetimeData.lastServiceDate)}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white border rounded-lg p-4 text-center mb-4">
                        <p className="text-xs text-gray-500 font-medium">Total Payments</p>
                        <p className="text-xl font-bold text-gray-800">
                          {lifetimeData.totalPayments}
                        </p>
                      </div>

                      {/* Payment Trend Chart */}
                      {squarePayments.length > 0 && (
                        <div className="border rounded-lg p-4">
                          <PaymentTrendChart payments={squarePayments} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-blue-800">
              {selected.size} selected
            </span>
            <select
              value={bulkService}
              onChange={(e) => setBulkService(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Change service to...</option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkUpdate}
              disabled={!bulkService || bulkUpdating}
              className="bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {bulkUpdating ? "Updating..." : "Apply"}
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-gray-500 underline"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Customer list */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : viewMode === "route" ? (
          <div className="space-y-3">
            {sortedAreas.map((area) => (
              <details key={area} className="bg-white rounded-lg shadow" open>
                <summary className="px-4 py-3 cursor-pointer font-semibold text-sm flex justify-between items-center">
                  <span>{area}</span>
                  <span className="text-xs text-gray-400 font-normal">
                    {customersByArea[area].length} customer{customersByArea[area].length !== 1 ? "s" : ""}
                  </span>
                </summary>
                <div className="border-t divide-y">
                  {customersByArea[area].map((c) => (
                    <div key={c.id} className={`px-4 py-3 flex items-center justify-between text-sm ${!c.active ? "opacity-50" : ""}`}>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.address || "\u2014"}</p>
                        <p className="text-xs text-gray-400">
                          {serviceLabel(c.default_service)} &middot; ${Number(c.default_bin_rate).toFixed(2)}
                          {c.lifetime_value != null && c.lifetime_value > 0 && (
                            <span className="ml-2 text-green-700 font-medium">
                              LTV: {formatCurrency(c.lifetime_value)}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-green-800 text-xs underline">Edit</button>
                        <button onClick={() => openHistory(c)} className="text-blue-700 text-xs underline">History</button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
                {customers.length === 0
                  ? 'No customers yet. Click "+ Add Customer" to get started.'
                  : "No customers match your filters."}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-2 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Address</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Rate</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Lifetime Value</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Square</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Auto-Charge</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Contract</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={`border-t ${!c.active ? "opacity-50" : ""}`}>
                    <td className="px-2 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {c.address || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {serviceLabel(c.default_service)}
                    </td>
                    <td className="px-4 py-3">
                      ${Number(c.default_bin_rate).toFixed(2)}
                      <span className="text-xs text-gray-400 ml-1 hidden md:inline">{serviceUnit(c.default_service)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {c.lifetime_value != null && c.lifetime_value > 0 ? (
                        <span className="text-green-700 font-medium text-xs">
                          {formatCurrency(c.lifetime_value)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {c.square_customer_id ? (
                        <span className="text-green-700 text-xs font-medium">Linked</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not linked</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {c.auto_charge ? (
                        <span className="text-blue-700 text-xs font-medium">
                          {c.charge_frequency || "weekly"} &middot; {c.default_bins ?? 1} bin{(c.default_bins ?? 1) !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Off</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {c.contract_type && c.contract_type !== "month_to_month" ? (
                        <div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            c.contract_end_date && new Date(c.contract_end_date) < new Date(Date.now() + 30 * 86400000)
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {c.contract_type === "annual" ? "Annual" : "6-Mo"}
                            {c.contract_discount_pct > 0 ? ` (${c.contract_discount_pct}%)` : ""}
                          </span>
                          {c.contract_end_date && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ends {new Date(c.contract_end_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">M2M</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`text-xs px-2 py-1 rounded ${
                          c.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-green-800 text-xs underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openHistory(c)}
                        className="text-blue-700 text-xs underline"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                      {customers.length === 0
                        ? 'No customers yet. Click "+ Add Customer" to get started.'
                        : "No customers match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
