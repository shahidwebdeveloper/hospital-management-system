import { ArrowRight, HeartPulse } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type RolePageShellProps = {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  actions?: Array<{ label: string; href: string; variant?: "default" | "outline" }>;
  children?: ReactNode;
};

export default function RolePageShell({
  badge,
  title,
  description,
  highlights,
  actions = [],
  children
}: RolePageShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%)] px-5 py-8 text-foreground lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-border/70 bg-card/90 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {badge}
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {actions.map((action) => (
                <Button key={action.label} asChild variant={action.variant ?? "default"}>
                  <Link to={action.href}>
                    {action.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
            <h2 className="text-xl font-semibold">What this workspace supports</h2>
            <div className="mt-4 space-y-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
