import { useEffect, useState, useCallback } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

const MOCK_USERS: User[] = [
  { id: "1", name: "Alice Admin", email: "alice@example.com", role: "admin" },
  { id: "2", name: "Bob Doctor", email: "bob@example.com", role: "doctor" },
  { id: "3", name: "Cathy Nurse", email: "cathy@example.com", role: "nurse" }
];

export default function UsersListPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineFallback, setOfflineFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOfflineFallback(false);
    try {
      const base = (import.meta.env.VITE_AUTH_BASE_URL as string) ?? "http://localhost:5000";
      const url = `${base.replace(/\/$/, "")}/api/users`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        setUsers(data.users ?? data);
      } else {
        const text = await res.text();
        throw new Error(`Unexpected non-JSON response: ${text.slice(0, 120)}`);
      }
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      setError(msg);

      // Network failure: fall back to offline mock data so UI remains usable.
      if (
        msg.includes("Failed to fetch") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("network")
      ) {
        setUsers(MOCK_USERS);
        setOfflineFallback(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <main className="p-6">Loading users…</main>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      {error ? (
        <div className="mt-4 rounded-md border p-3 bg-yellow-50">
          <div className="font-medium text-sm">Unable to load users from backend: {error}</div>
          {offlineFallback ? (
            <div className="mt-2 text-sm text-muted-foreground">Showing offline mock data.</div>
          ) : null}
          <div className="mt-3 flex gap-2">
            <button className="rounded-md border px-3 py-2" onClick={() => void load()}>
              Retry
            </button>
            <button
              className="rounded-md bg-primary px-3 py-2 text-white"
              onClick={() => {
                setUsers(MOCK_USERS);
                setOfflineFallback(true);
              }}
            >
              Use offline data
            </button>
          </div>
        </div>
      ) : null}

      {!users || users.length === 0 ? (
        <div className="mt-4">No users found.</div>
      ) : (
        <div className="mt-4 space-y-2">
          {users.map((u) => (
            <div key={u.id} className="rounded-md border p-3">
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-muted-foreground">
                {u.email} • {u.role}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
