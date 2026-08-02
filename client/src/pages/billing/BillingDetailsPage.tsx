import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { BillingService } from "@/services/billing-service";
import type { Invoice } from "@/types/billing";

export default function BillingDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["billing", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await BillingService.getInvoiceById(id);
      return response.data;
    },
    enabled: Boolean(id)
  });

  if (!id) {
    return <div className="p-6 text-red-500">Invoice ID is missing.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading invoice...</div>;
  }

  if (isError || !data) {
    return <div className="p-6 text-red-500">Invoice not found.</div>;
  }

  const invoice = data as Invoice;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground">{invoice.patientName || invoice.patientId}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/app/billing/${id}/edit`)}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Edit Invoice
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Patient</p>
          <p className="mt-2 text-lg font-semibold">{invoice.patientName || invoice.patientId}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p className="mt-2 text-lg font-semibold">{invoice.status.replaceAll("_", " ")}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">Line Items</p>
        <div className="mt-4 space-y-4">
          {invoice.items.map((item, index) => (
            <div
              key={`${item.description}-${index}`}
              className="grid gap-3 md:grid-cols-4 rounded-lg border bg-gray-50 p-4"
            >
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="mt-1">{item.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Quantity</p>
                <p className="mt-1">{item.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Unit Price</p>
                <p className="mt-1">${item.unitPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="mt-1">${item.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Subtotal</p>
          <p className="mt-2 text-xl font-semibold">${invoice.subtotal.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Paid</p>
          <p className="mt-2 text-xl font-semibold">${invoice.paidAmount.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Balance</p>
          <p className="mt-2 text-xl font-semibold">${invoice.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
          <p className="mt-2">{invoice.paymentMethod || "-"}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Due Date</p>
          <p className="mt-2">
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>

      {invoice.notes ? (
        <div className="mt-6 rounded-lg border bg-white p-5">
          <p className="text-sm font-medium text-muted-foreground">Notes</p>
          <p className="mt-2 whitespace-pre-line">{invoice.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
