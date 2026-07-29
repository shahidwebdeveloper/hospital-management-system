import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateLaboratoryRequest } from "@/hooks/use-laboratory";

const requestTestSchema = z.object({
  patient: z.string().min(1, "Patient is required"),

  doctor: z.string().min(1, "Doctor is required"),

  testName: z.string().min(2, "Test name is required"),

  category: z.string().min(2, "Category is required"),

  priority: z.enum(["low", "normal", "high", "urgent"]),

  clinicalNotes: z.string().optional()
});

type RequestTestFormValues = z.infer<typeof requestTestSchema>;

interface RequestTestFormProps {
  doctorId: string;

  patients: {
    _id: string;
    name: string;
  }[];
}

export function RequestTestForm({ doctorId, patients }: RequestTestFormProps) {
  const mutation = useCreateLaboratoryRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RequestTestFormValues>({
    resolver: zodResolver(requestTestSchema),

    defaultValues: {
      doctor: doctorId,

      priority: "normal"
    }
  });

  const onSubmit = (data: RequestTestFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset({
          doctor: doctorId,
          priority: "normal"
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">Request Laboratory Test</h2>

      {/* Patient */}

      <div>
        <label className="mb-1 block text-sm font-medium">Patient</label>

        <select {...register("patient")} className="w-full rounded-md border px-3 py-2">
          <option value="">Select patient</option>

          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name}
            </option>
          ))}
        </select>

        {errors.patient && <p className="text-sm text-red-500">{errors.patient.message}</p>}
      </div>

      {/* Test Name */}

      <div>
        <label className="mb-1 block text-sm font-medium">Test Name</label>

        <input
          {...register("testName")}
          placeholder="Example: CBC"
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.testName && <p className="text-sm text-red-500">{errors.testName.message}</p>}
      </div>

      {/* Category */}

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>

        <input
          {...register("category")}
          placeholder="Example: Hematology"
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      {/* Priority */}

      <div>
        <label className="mb-1 block text-sm font-medium">Priority</label>

        <select {...register("priority")} className="w-full rounded-md border px-3 py-2">
          <option value="low">Low</option>

          <option value="normal">Normal</option>

          <option value="high">High</option>

          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Notes */}

      <div>
        <label className="mb-1 block text-sm font-medium">Clinical Notes</label>

        <textarea
          {...register("clinicalNotes")}
          rows={4}
          placeholder="Additional notes..."
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-primary px-5 py-2 text-white"
      >
        {mutation.isPending ? "Submitting..." : "Request Test"}
      </button>
    </form>
  );
}
