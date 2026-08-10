import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  deleteUser,
  getUsers,
  type User,
  type UserRole,
  updateUser,
  createUser
} from "@/services/user-services";

const roles: UserRole[] = [
  "super_admin",
  "admin",
  "doctor",
  "nurse",
  "receptionist",
  "pharmacist",
  "lab_technician",
  "patient"
];

const initialFormState = {
  name: "",
  email: "",
  password: "",
  role: "patient" as UserRole,
  phone: ""
};

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err?.message ?? "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const totalUsers = users.length;
  const activeUsers = useMemo(() => users.filter((user) => user.isActive).length, [users]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await createUser(formState);
      setUsers((current) => [response.data, ...current]);
      setFormState(initialFormState);
    } catch (err: any) {
      setError(err?.message ?? "Unable to create user");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(userId: string, role: UserRole, isActive: boolean) {
    setSaving(true);
    setError(null);
    setUpdatingUserId(userId);

    try {
      const response = await updateUser(userId, { role, isActive });
      setUsers((current) => current.map((user) => (user._id === userId ? response.data : user)));
    } catch (err: any) {
      setError(err?.message ?? "Unable to update user");
    } finally {
      setSaving(false);
      setUpdatingUserId(null);
    }
  }

  async function handleDelete(userId: string) {
    setSaving(true);
    setError(null);

    try {
      await deleteUser(userId);
      setUsers((current) => current.filter((user) => user._id !== userId));
    } catch (err: any) {
      setError(err?.message ?? "Unable to delete user");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="p-6">Loading users…</main>;

  return (
    <main className="space-y-6 p-6">
      <section className="grid gap-4 md:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Admin-only user management for account creation, role assignment, and status control.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">Summary</p>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {activeUsers}/{totalUsers} active
            </span>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="rounded-md border bg-background px-3 py-2">
              <div className="font-semibold">Total accounts</div>
              <div className="text-muted-foreground">{totalUsers}</div>
            </div>
            <div className="rounded-md border bg-background px-3 py-2">
              <div className="font-semibold">Last refresh</div>
              <div className="text-muted-foreground">Just now</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">Create new user</h2>
          {error ? (
            <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <label className="block text-sm font-medium">
              Full name
              <input
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Email
              <input
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, email: event.target.value }))
                }
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                type="password"
                value={formState.password}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, password: event.target.value }))
                }
                required
                minLength={8}
              />
            </label>
            <label className="block text-sm font-medium">
              Role
              <select
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                value={formState.role}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, role: event.target.value as UserRole }))
                }
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Phone
              <input
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                value={formState.phone}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Create user"}
            </Button>
          </form>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">User roles</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Only admins and super admins can manage users and role assignments.
          </p>
          <div className="mt-4 space-y-2">
            {roles.map((role) => (
              <div key={role} className="rounded-md border bg-background px-3 py-2 text-sm">
                <span className="font-medium">{role.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">User accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage users, update roles, and remove inactive accounts.
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadUsers()} disabled={loading || saving}>
            Refresh
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user._id} className="rounded-lg border bg-background p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Role: {user.role.replace(/_/g, " ")} • {user.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    defaultValue={user.role}
                    onChange={(event) =>
                      handleUpdate(user._id, event.target.value as UserRole, user.isActive)
                    }
                    disabled={saving || updatingUserId === user._id}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate(user._id, user.role, !user.isActive)}
                    disabled={saving || updatingUserId === user._id}
                  >
                    {user.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleDelete(user._id)}
                    disabled={saving}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
