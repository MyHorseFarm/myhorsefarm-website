"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminToken, setAdminToken, adminHeaders } from "@/lib/admin-auth";

interface CrewMember {
  id: string;
  name: string;
  pin: string;
  phone: string | null;
  email: string | null;
  active: boolean;
  created_at: string;
}

type FormData = Omit<CrewMember, "id" | "created_at">;

const emptyForm: FormData = {
  name: "",
  pin: "",
  phone: null,
  email: null,
  active: true,
};

export default function CrewPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CrewMember | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const headers = useCallback(
    () => adminHeaders(token || undefined),
    [token],
  );

  const fetchCrew = useCallback(async (authToken?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crew", {
        headers: adminHeaders(authToken || token || undefined),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCrew(data.crew);
      setAuthed(true);
    } catch {
      setError("Failed to load crew members");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchCrew(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminToken(token);
    await fetchCrew(token);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: CrewMember) => {
    setEditing(c);
    setForm({
      name: c.name,
      pin: c.pin,
      phone: c.phone,
      email: c.email,
      active: c.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...form } : form;
      const res = await fetch("/api/admin/crew", {
        method,
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      setShowForm(false);
      await fetchCrew();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const toggleActive = async (c: CrewMember) => {
    try {
      await fetch("/api/admin/crew", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ id: c.id, active: !c.active }),
      });
      await fetchCrew();
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Crew Members</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={openNew}
              className="bg-green-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700"
            >
              + Add Crew Member
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Crew form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-lg font-bold mb-4">
                {editing ? "Edit Crew Member" : "New Crew Member"}
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
                  <label className="block text-sm font-medium mb-1">PIN * (4+ digits)</label>
                  <input
                    type="text"
                    value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. 1234"
                    minLength={4}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Crew uses this PIN to log services</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value || null })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="For dispatch emails"
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

        {/* Crew list */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">PIN</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {crew.map((c) => (
                  <tr key={c.id} className={`border-t ${!c.active ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 font-mono">{c.pin}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {c.email || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {c.phone || "\u2014"}
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
                {crew.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No crew members yet. Click &quot;+ Add Crew Member&quot; to get started.
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
