import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { PharmacyService } from "@/services/pharmacy-service";
import type { Medicine } from "@/types/pharmacy";

export default function PharmacyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: medicineData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["pharmacy", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await PharmacyService.getMedicine(id);
      return response.data;
    },
    enabled: Boolean(id)
  });

  if (!id) {
    return <div className="p-6 text-red-500">Medicine ID is missing.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading medicine details...</div>;
  }

  if (isError || !medicineData) {
    return <div className="p-6 text-red-500">Medicine not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{medicineData.name}</h1>
          <p className="text-muted-foreground">Medicine inventory and expiry details.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/app/pharmacy/${id}/edit`)}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Edit Medicine
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">Category</p>
          <p className="mt-2 text-lg font-semibold">{medicineData.category}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">Supplier</p>
          <p className="mt-2 text-lg font-semibold">{medicineData.supplier}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">Stock</p>
          <p className="mt-2 text-lg font-semibold">{medicineData.stock}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">Price</p>
          <p className="mt-2 text-lg font-semibold">${medicineData.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
          <p className="mt-2 text-lg font-semibold">
            {new Date(medicineData.expiryDate).toLocaleDateString()}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm font-medium text-muted-foreground">Reorder Level</p>
          <p className="mt-2 text-lg font-semibold">{medicineData.reorderLevel}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-card p-5">
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        <p
          className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            medicineData.status === "low_stock"
              ? "bg-orange-100 text-orange-700"
              : medicineData.status === "expired"
                ? "bg-red-100 text-red-700"
                : medicineData.status === "out_of_stock"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-green-100 text-green-700"
          }`}
        >
          {medicineData.status.replaceAll("_", " ")}
        </p>
      </div>
    </div>
  );
}
