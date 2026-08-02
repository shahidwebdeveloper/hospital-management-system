import { Link } from "react-router-dom";
import type { Medicine } from "@/types/pharmacy";

interface MedicineTableProps {
  medicines: Medicine[];
  onDelete?: (id: string) => void;
}

export function MedicineTable({ medicines, onDelete }: MedicineTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">Medicine</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-left">Expiry</th>
            <th className="px-4 py-3 text-left">Supplier</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => {
            const isLowStock = medicine.status === "low_stock";
            const isExpired = medicine.status === "expired";
            return (
              <tr key={medicine._id} className="border-t">
                <td className="px-4 py-3 font-medium">{medicine.name}</td>
                <td className="px-4 py-3">{medicine.category}</td>
                <td
                  className={`px-4 py-3 ${isLowStock ? "text-orange-600" : isExpired ? "text-red-600" : ""}`}
                >
                  {medicine.stock}
                </td>
                <td className="px-4 py-3">{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{medicine.supplier}</td>
                <td className="px-4 py-3 capitalize">{medicine.status.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/app/pharmacy/${medicine._id}`}
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-700"
                    >
                      View
                    </Link>
                    <Link
                      to={`/app/pharmacy/${medicine._id}/edit`}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white"
                    >
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(medicine._id)}
                        className="rounded-md bg-red-600 px-3 py-1 text-xs text-white"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
