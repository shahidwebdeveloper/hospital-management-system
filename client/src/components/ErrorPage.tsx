import { Link } from "react-router-dom";

export default function ErrorPage({ error }: { error?: any }) {
  const message = error?.message ?? "An unexpected error occurred.";

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Unexpected Application Error</h1>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="rounded-md bg-primary px-3 py-2 text-sm text-white">
          Go Home
        </Link>
        <a
          href="/"
          onClick={() => window.location.reload()}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Reload
        </a>
      </div>
    </main>
  );
}
