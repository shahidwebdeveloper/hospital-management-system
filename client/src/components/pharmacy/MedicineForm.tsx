import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateMedicine, useUpdateMedicine } from "@/hooks/use-pharmacy";
import type { CreateMedicine, UpdateMedicine } from "@/types/pharmacy";

const medicineSchema = z.object({
  name: z.string().trim().min(2, "Medicine name is required"),
  category: z.string().trim().min(2, "Category is required"),
  stock: z.number().min(0, "Stock must be at least 0"),
  price: z.number().min(0, "Price must be at least 0"),
  supplier: z.string().trim().min(2, "Supplier is required"),
  expiryDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Expiry date must be valid"
  }),
  reorderLevel: z.number().min(0, "Reorder level must be at least 0")
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  initialValues?: Partial<MedicineFormValues>;
  onSuccess?: () => void;
  medicineId?: string;
}

export function MedicineForm({ initialValues, onSuccess, medicineId }: MedicineFormProps) {
  const createMutation = useCreateMedicine();
  const updateMutation = useUpdateMedicine();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "",
      category: "",
      stock: 0,
      price: 0,
      supplier: "",
      expiryDate: "",
      reorderLevel: 0,
      ...initialValues
    }
  });

  const onSubmit = (data: MedicineFormValues) => {
    if (medicineId) {
      updateMutation.mutate(
        {
          id: medicineId,
          data
        },
        {
          onSuccess: () => {
            onSuccess?.();
          }
        }
      );
      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      }
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border p-6 bg-card">
      <h2 className="text-xl font-semibold">{medicineId ? "Edit Medicine" : "Add Medicine"}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Medicine Name</label>
          <input {...register("name")} className="w-full rounded-md border px-3 py-2" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <input {...register("category")} className="w-full rounded-md border px-3 py-2" />
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Supplier</label>
          <input {...register("supplier")} className="w-full rounded-md border px-3 py-2" />
          {errors.supplier && <p className="text-sm text-red-500">{errors.supplier.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            {...register("expiryDate")}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Reorder Level</label>
          <input
            type="number"
            {...register("reorderLevel", { valueAsNumber: true })}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.reorderLevel && (
            <p className="text-sm text-red-500">{errors.reorderLevel.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-5 py-2 text-white"
      >
        {isPending ? "Saving..." : medicineId ? "Update Medicine" : "Add Medicine"}
      </button>
    </form>
  );
}
