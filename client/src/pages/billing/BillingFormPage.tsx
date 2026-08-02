import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { InvoiceForm } from "@/components/billing/InvoiceForm";
import { BillingService } from "@/services/billing-service";
import type { Invoice } from "@/types/billing";

export default function BillingFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["billing", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await BillingService.getInvoiceById(id);
      return response.data;
    },
    enabled: isEdit
  });

  if (isEdit && isLoading) {
    return <div className="p-6">Loading invoice...</div>;
  }

  if (isEdit && isError) {
    return <div className="p-6 text-red-500">Failed to load invoice.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Invoice" : "Create Invoice"}</h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Update invoice details, payment, and status."
            : "Create a new invoice for a visit or service."}
        </p>
      </div>
      <InvoiceForm
        invoiceId={id ?? undefined}
        initialValues={data as Invoice | undefined}
        onSuccess={() => {
          navigate("/app/billing");
        }}
      />
    </div>
  );
}
