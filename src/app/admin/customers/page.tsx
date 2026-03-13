"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

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
  created_at: string;
}

type FormData = Omit<Customer, "id" | "created_at">;

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

function serviceLabel(key: string): string {
  return SERVICE_OPTIONS.find((s) => s.key === key)?.label || key.replace(/_/g, " ");
}

function serviceUnit(key: string): string {
  return SERVICE_OPTIONS.find((s) => s.key === key)?.unit || "";
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
      const { imported, updated, skipped } = await res.json();
      setImportResult(`Imported ${imported}, updated ${updated}, skipped ${skipped}`);
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Recurring Customers</h1>
          <div className="flex gap-2 items-center">
            <a href="/admin/daily" className="text-sm text-green-800 underline">
              Daily Dashboard
            </a>
            <a href="/admin/crew" className="text-sm text-green-800 underline">
              Crew
            </a>
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

        {/* Customer list */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Address</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Rate</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Square</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Auto-Charge</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className={`border-t ${!c.active ? "opacity-50" : ""}`}>
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
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-green-800 text-xs underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      No customers yet. Click &quot;+ Add Customer&quot; to get started.
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
