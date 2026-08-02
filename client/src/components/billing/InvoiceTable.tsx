import { Link } from "react-router-dom";
import type { Invoice } from "@/types/billing";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
}

export function InvoiceTable({ invoices, onDelete }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">Invoice #</th>
            <th className="px-4 py-3 text-left">Patient</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Paid</th>
            <th className="px-4 py-3 text-left">Balance</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="border-t">
              <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
              <td className="px-4 py-3">{invoice.patientName || invoice.patientId}</td>
              <td className="px-4 py-3">${invoice.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-3">${invoice.paidAmount.toFixed(2)}</td>
              <td className="px-4 py-3">${invoice.balance.toFixed(2)}</td>
              <td className="px-4 py-3 capitalize">{invoice.status.replaceAll("_", " ")}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/app/billing/${invoice._id}`}
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700"
                  >
                    View
                  </Link>
                  <Link
                    to={`/app/billing/${invoice._id}/edit`}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white"
                  >
                    Edit
                  </Link>
                  {onDelete && invoice._id && (
                    <button
                      type="button"
                      onClick={() => onDelete(invoice._id!)}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
