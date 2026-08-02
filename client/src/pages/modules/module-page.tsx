import {
  Activity,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  SquarePen
} from "lucide-react";
import { useMemo, useState } from "react";

import { hospitalRules, moduleDefinitions, roleLabels } from "@hms/contracts";
import type { HospitalModule } from "@hms/contracts";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { moduleRecords, priorityTone, statusTone } from "@/data/hospital-data";

type ModulePageProps = {
  moduleKey: HospitalModule;
};

function labelStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ModulePage({ moduleKey }: ModulePageProps) {
  const definition = moduleDefinitions.find((item) => item.key === moduleKey);
  const { user } = useAuth();
  const records = moduleRecords[moduleKey] ?? [];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const visibleRecords = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = normalized
        ? [
            record.id,
            record.title,
            record.subtitle,
            record.owner,
            record.status,
            ...Object.values(record.details)
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        : true;
      const matchesStatus = status === "all" || record.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, status]);

  if (!definition) {
    return <main className="p-5">Module not found.</main>;
  }

  if (user && !definition.allowedRoles.includes(user.role)) {
    return <main className="p-5">You do not have permission to view this module.</main>;
  }

  const urgentCount = records.filter(
    (record) => record.priority === "urgent" || record.priority === "high"
  ).length;
  const activeCount = records.filter(
    (record) => !["inactive", "cancelled", "archived"].includes(record.status)
  ).length;

  return (
    <main className="space-y-6 p-5">
      <section className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{definition.key}</p>
          <h1 className="mt-1 text-3xl font-semibold">{definition.label}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{definition.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            New record
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">Total records</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-semibold">{records.length}</div>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">Active workflow</span>
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-semibold">{activeCount}</div>
        </article>
        <article className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">Needs attention</span>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-3xl font-semibold">{urgentCount}</div>
        </article>
      </section>

      <section className="grid gap-4 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_220px]">
        <label className="flex h-11 min-w-0 items-center gap-2 rounded-md border bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="h-full w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={`Search ${definition.label.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select
          className="h-11 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All statuses</option>
          {definition.statuses.map((item) => (
            <option key={item} value={item}>
              {labelStatus(item)}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-card">
          <div className="grid grid-cols-[1fr_auto] gap-3 border-b p-4">
            <div>
              <h2 className="font-semibold">Records</h2>
              <p className="text-sm text-muted-foreground">
                Searchable, status-filtered operational list.
              </p>
            </div>
            <span className="self-start rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
              {visibleRecords.length} shown
            </span>
          </div>
          <div className="divide-y">
            {visibleRecords.map((record) => (
              <article
                key={record.id}
                className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-start"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{record.title}</h3>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusTone(record.status)}`}
                    >
                      {labelStatus(record.status)}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${priorityTone(record.priority)}`}
                    >
                      {record.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{record.subtitle}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {Object.entries(record.details).map(([key, value]) => (
                      <div key={key} className="rounded-md border bg-background px-3 py-2">
                        <div className="text-xs text-muted-foreground">{key}</div>
                        <div className="truncate text-sm font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
                  <span className="rounded-md border bg-background px-3 py-2 text-sm font-semibold">
                    {record.metric}
                  </span>
                  <Button variant="outline" size="sm">
                    <SquarePen className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">Allowed Roles</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {definition.allowedRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-md border bg-background px-2 py-1 text-xs font-semibold"
                >
                  {roleLabels[role]}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">Workflow Statuses</h2>
            <div className="mt-3 grid gap-2">
              {definition.statuses.map((item) => (
                <span
                  key={item}
                  className={`rounded-md border px-2 py-2 text-xs font-semibold ${statusTone(item)}`}
                >
                  {labelStatus(item)}
                </span>
              ))}
            </div>
          </section>

          {moduleKey === "settings" ? (
            <section className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold">Hospital Rules</h2>
              <div className="mt-3 space-y-2">
                {hospitalRules.map((rule) => (
                  <p
                    key={rule}
                    className="rounded-md border bg-background p-3 text-sm text-muted-foreground"
                  >
                    {rule}
                  </p>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
