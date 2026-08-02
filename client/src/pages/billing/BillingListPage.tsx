import { useNavigate } from "react-router-dom";
import { InvoiceTable } from "@/components/billing/InvoiceTable";
import { useDeleteInvoice, useInvoices } from "@/hooks/use-billing";

export default function BillingListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useInvoices();
  const deleteInvoice = useDeleteInvoice();

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Delete this invoice?");
    if (!confirmed) return;
    deleteInvoice.mutate(id);
  };

  if (isLoading) {
    return <div className="p-6">Loading invoices...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load invoices.</div>;
  }

  const invoices = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Create invoices for visits, labs, prescriptions, and services.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/app/billing/new")}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Create Invoice
        </button>
      </div>

      <InvoiceTable invoices={invoices} onDelete={handleDelete} />
    </div>
  );
}
