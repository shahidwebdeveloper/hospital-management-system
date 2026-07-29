import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useEnterLaboratoryResult } from "@/hooks/use-laboratory";

const resultSchema = z.object({
  result: z.string().min(1, "Result is required"),

  referenceRange: z.string().optional(),

  unit: z.string().optional(),

  remarks: z.string().optional()
});

type ResultFormValues = z.infer<typeof resultSchema>;

interface ResultFormProps {
  laboratoryId: string;

  onSuccess?: () => void;
}

export function ResultForm({ laboratoryId, onSuccess }: ResultFormProps) {
  const mutation = useEnterLaboratoryResult();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),

    defaultValues: {
      result: "",
      referenceRange: "",
      unit: "",
      remarks: ""
    }
  });

  const onSubmit = (data: ResultFormValues) => {
    mutation.mutate(
      {
        id: laboratoryId,
        data
      },

      {
        onSuccess: () => {
          reset();

          onSuccess?.();
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">Enter Laboratory Result</h2>

      {/* Result */}

      <div>
        <label className="mb-1 block text-sm font-medium">Result</label>

        <textarea
          {...register("result")}

          rows={5}

          placeholder="Enter test result..."

          className="w-full rounded-md border px-3 py-2"
        />

        {errors.result && <p className="text-sm text-red-500">{errors.result.message}</p>}
      </div>

      {/* Reference Range */}

      <div>
        <label className="mb-1 block text-sm font-medium">Reference Range</label>

        <input
          {...register("referenceRange")}

          placeholder="Example: 4.5 - 11.0"

          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Unit */}

      <div>
        <label className="mb-1 block text-sm font-medium">Unit</label>

        <input
          {...register("unit")}

          placeholder="Example: mg/dL"

          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Remarks */}

      <div>
        <label className="mb-1 block text-sm font-medium">Remarks</label>

        <textarea
          {...register("remarks")}

          rows={3}

          placeholder="Additional comments..."

          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <button
        type="submit"

        disabled={mutation.isPending}

        className="rounded-md bg-green-600 px-5 py-2 text-white"
      >
        {mutation.isPending ? "Saving..." : "Complete Test"}
      </button>
    </form>
  );
}
