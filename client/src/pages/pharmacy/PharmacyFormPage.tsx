import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { MedicineForm } from "@/components/pharmacy/MedicineForm";
import { PharmacyService } from "@/services/pharmacy-service";
import { useMedicines } from "@/hooks/use-pharmacy";
import type { Medicine } from "@/types/pharmacy";

export default function PharmacyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const {
    data: medicineData,
    isLoading: isMedicineLoading,
    isError: isMedicineError
  } = useQuery({
    queryKey: ["pharmacy", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await PharmacyService.getMedicine(id);
      return response.data;
    },
    enabled: isEdit
  });

  if (isEdit && isMedicineLoading) {
    return <div className="p-6">Loading medicine details...</div>;
  }

  if (isEdit && isMedicineError) {
    return <div className="p-6 text-red-500">Failed to load medicine.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Medicine" : "Add Medicine"}</h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Update stock, pricing, supplier, or expiry information."
            : "Add a new medicine to inventory and track stock."}
        </p>
      </div>

      <MedicineForm
        medicineId={id ?? undefined}
        initialValues={
          medicineData
            ? {
                name: medicineData.name,
                category: medicineData.category,
                stock: medicineData.stock,
                price: medicineData.price,
                supplier: medicineData.supplier,
                expiryDate: medicineData.expiryDate.slice(0, 10),
                reorderLevel: medicineData.reorderLevel
              }
            : undefined
        }
        onSuccess={() => {
          navigate("/app/pharmacy");
        }}
      />
    </div>
  );
}
