"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface Service {
  id: string;
  service_key: string;
  display_name: string;
  description: string;
  unit: string;
  base_rate: number;
  minimum_charge: number | null;
  peak_rate: number | null;
  peak_start_month: number | null;
  peak_end_month: number | null;
  is_recurring: boolean;
  active: boolean;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const UNIT_LABELS: Record<string, string> = {
  per_load: "/ load",
  per_can: "/ can",
  per_ton: "/ ton",
  per_yard: "/ yard",
  per_sqft: "/ sqft",
  flat: "flat",
};

export default function PricingPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [successMsg, setSuccessMsg] = useState("");

  const fetchServices = useCallback(async (authToken?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/pricing", {
        headers: adminHeaders(authToken || token || undefined),
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setServices(data.services);
      setAuthed(true);
    } catch {
      setError("Failed to load pricing");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchServices(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchServices(token);
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({
      base_rate: service.base_rate,
      minimum_charge: service.minimum_charge,
      peak_rate: service.peak_rate,
      peak_start_month: service.peak_start_month,
      peak_end_month: service.peak_end_month,
      active: service.active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveService = async (id: string) => {
    setSaving(id);
    setError("");
    try {
      const updates: Record<string, unknown> = {
        id,
        base_rate: Number(editForm.base_rate),
        minimum_charge: editForm.minimum_charge != null ? Number(editForm.minimum_charge) : null,
        active: editForm.active,
      };

      if (editForm.peak_rate != null && Number(editForm.peak_rate) > 0) {
        updates.peak_rate = Number(editForm.peak_rate);
        updates.peak_start_month = editForm.peak_start_month ?? 10;
        updates.peak_end_month = editForm.peak_end_month ?? 4;
      } else {
        updates.peak_rate = null;
        updates.peak_start_month = null;
        updates.peak_end_month = null;
      }

      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data.service } : s))
      );
      setEditingId(null);
      setEditForm({});
      setSuccessMsg("Pricing updated");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(null);
    }
  };

  const toggleActive = async (service: Service) => {
    setSaving(service.id);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ id: service.id, active: !service.active }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      const data = await res.json();
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, ...data.service } : s))
      );
    } catch {
      setError("Failed to update");
    } finally {
      setSaving(null);
    }
  };

  // Peak season label
  const peakLabel = (s: Service) => {
    if (s.peak_rate == null || s.peak_start_month == null || s.peak_end_month == null) return null;
    return `$${s.peak_rate} (${MONTHS[s.peak_start_month - 1]}–${MONTHS[s.peak_end_month - 1]})`;
  };

  // Check if we're currently in peak season for a service
  const isInPeak = (s: Service) => {
    if (s.peak_start_month == null || s.peak_end_month == null) return false;
    const m = new Date().getMonth() + 1;
    if (s.peak_start_month <= s.peak_end_month) {
      return m >= s.peak_start_month && m <= s.peak_end_month;
    }
    return m >= s.peak_start_month || m <= s.peak_end_month;
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Service Pricing</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update rates, set peak-season pricing, and toggle services on/off.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{successMsg}</div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-semibold">Service</th>
                    <th className="text-left px-4 py-3 font-semibold">Unit</th>
                    <th className="text-right px-4 py-3 font-semibold">Base Rate</th>
                    <th className="text-right px-4 py-3 font-semibold">Min Charge</th>
                    <th className="text-right px-4 py-3 font-semibold">Peak Rate</th>
                    <th className="text-center px-4 py-3 font-semibold">Peak Season</th>
                    <th className="text-center px-4 py-3 font-semibold">Active</th>
                    <th className="text-center px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr
                      key={s.id}
                      className={`border-b last:border-b-0 ${!s.active ? "opacity-50" : ""}`}
                    >
                      {editingId === s.id ? (
                        // Editing row
                        <>
                          <td className="px-4 py-3">
                            <div className="font-medium">{s.display_name}</div>
                            <div className="text-xs text-gray-400">{s.service_key}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{UNIT_LABELS[s.unit] || s.unit}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editForm.base_rate ?? ""}
                              onChange={(e) => setEditForm({ ...editForm, base_rate: Number(e.target.value) })}
                              className="w-24 border rounded px-2 py-1 text-right text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editForm.minimum_charge ?? ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  minimum_charge: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                              className="w-24 border rounded px-2 py-1 text-right text-sm"
                              placeholder="—"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editForm.peak_rate ?? ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  peak_rate: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                              className="w-24 border rounded px-2 py-1 text-right text-sm"
                              placeholder="—"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-center">
                              <select
                                value={editForm.peak_start_month ?? ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    peak_start_month: e.target.value ? Number(e.target.value) : null,
                                  })
                                }
                                className="border rounded px-1 py-1 text-xs"
                              >
                                <option value="">—</option>
                                {MONTHS.map((m, i) => (
                                  <option key={i} value={i + 1}>{m}</option>
                                ))}
                              </select>
                              <span className="text-gray-400 self-center">–</span>
                              <select
                                value={editForm.peak_end_month ?? ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    peak_end_month: e.target.value ? Number(e.target.value) : null,
                                  })
                                }
                                className="border rounded px-1 py-1 text-xs"
                              >
                                <option value="">—</option>
                                {MONTHS.map((m, i) => (
                                  <option key={i} value={i + 1}>{m}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={editForm.active ?? true}
                              onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                              className="w-4 h-4"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => saveService(s.id)}
                                disabled={saving === s.id}
                                className="px-3 py-1 bg-green-800 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                {saving === s.id ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 border text-xs rounded hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // Display row
                        <>
                          <td className="px-4 py-3">
                            <div className="font-medium">{s.display_name}</div>
                            <div className="text-xs text-gray-400">{s.service_key}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{UNIT_LABELS[s.unit] || s.unit}</td>
                          <td className="px-4 py-3 text-right font-mono">
                            ${s.base_rate.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-gray-500">
                            {s.minimum_charge != null ? `$${s.minimum_charge.toFixed(2)}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {s.peak_rate != null ? (
                              <span className={`font-mono ${isInPeak(s) ? "text-amber-600 font-semibold" : ""}`}>
                                ${s.peak_rate.toFixed(2)}
                                {isInPeak(s) && (
                                  <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                    active
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-gray-500">
                            {peakLabel(s) ? (
                              <span>{MONTHS[(s.peak_start_month ?? 1) - 1]}–{MONTHS[(s.peak_end_month ?? 1) - 1]}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleActive(s)}
                              disabled={saving === s.id}
                              className={`w-10 h-5 rounded-full relative transition-colors ${
                                s.active ? "bg-green-600" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                  s.active ? "left-5" : "left-0.5"
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => startEdit(s)}
                              className="px-3 py-1 border text-xs rounded hover:bg-gray-50"
                            >
                              Edit
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y">
              {services.map((s) => (
                <div key={s.id} className={`p-4 ${!s.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{s.display_name}</p>
                      <p className="text-xs text-gray-400">{UNIT_LABELS[s.unit] || s.unit}</p>
                    </div>
                    <button
                      onClick={() => toggleActive(s)}
                      disabled={saving === s.id}
                      className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${
                        s.active ? "bg-green-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          s.active ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {editingId === s.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Base Rate</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.base_rate ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, base_rate: Number(e.target.value) })}
                            className="w-full border rounded px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Min Charge</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.minimum_charge ?? ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                minimum_charge: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="w-full border rounded px-2 py-1.5 text-sm"
                            placeholder="—"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Peak Rate</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.peak_rate ?? ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              peak_rate: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          className="w-full border rounded px-2 py-1.5 text-sm"
                          placeholder="—"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Peak Start</label>
                          <select
                            value={editForm.peak_start_month ?? ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, peak_start_month: e.target.value ? Number(e.target.value) : null })
                            }
                            className="w-full border rounded px-2 py-1.5 text-sm"
                          >
                            <option value="">—</option>
                            {MONTHS.map((m, i) => (
                              <option key={i} value={i + 1}>{m}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Peak End</label>
                          <select
                            value={editForm.peak_end_month ?? ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, peak_end_month: e.target.value ? Number(e.target.value) : null })
                            }
                            className="w-full border rounded px-2 py-1.5 text-sm"
                          >
                            <option value="">—</option>
                            {MONTHS.map((m, i) => (
                              <option key={i} value={i + 1}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveService(s.id)}
                          disabled={saving === s.id}
                          className="flex-1 py-2 bg-green-800 text-white text-sm rounded font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving === s.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 py-2 border text-sm rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-4 mb-1">
                        <span className="font-mono text-lg font-semibold">${s.base_rate.toFixed(2)}</span>
                        {s.minimum_charge != null && (
                          <span className="text-xs text-gray-400">min ${s.minimum_charge.toFixed(2)}</span>
                        )}
                      </div>
                      {s.peak_rate != null && (
                        <p className="text-sm text-amber-600">
                          Peak: ${s.peak_rate.toFixed(2)}{" "}
                          ({MONTHS[(s.peak_start_month ?? 1) - 1]}–{MONTHS[(s.peak_end_month ?? 1) - 1]})
                          {isInPeak(s) && (
                            <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">active</span>
                          )}
                        </p>
                      )}
                      <button
                        onClick={() => startEdit(s)}
                        className="mt-2 px-4 py-1.5 border text-xs rounded hover:bg-gray-50"
                      >
                        Edit Pricing
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
