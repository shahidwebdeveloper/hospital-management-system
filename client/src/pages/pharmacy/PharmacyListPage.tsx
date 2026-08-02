import { Link } from "react-router-dom";

import { MedicineTable } from "@/components/pharmacy/MedicineTable";
import { useDeleteMedicine, useMedicines } from "@/hooks/use-pharmacy";

export default function PharmacyListPage() {
  const { data: medicines, isLoading, isError } = useMedicines();
  const deleteMedicine = useDeleteMedicine();

  const handleDelete = (id: string) => {
    deleteMedicine.mutate(id);
  };

  if (isLoading) {
    return <div className="p-6">Loading medicines...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load medicines.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pharmacy Inventory</h1>
          <p className="text-muted-foreground">
            Manage medicines, stock levels, expiry dates, and suppliers.
          </p>
        </div>
        <Link
          to="/app/pharmacy/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white"
        >
          Add Medicine
        </Link>
      </div>

      <MedicineTable medicines={medicines ?? []} onDelete={handleDelete} />
    </div>
  );
}
