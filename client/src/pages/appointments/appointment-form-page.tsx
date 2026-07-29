import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAppointment } from "@/services/appointment-services";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  reason: z.string().min(1, "Reason is required"),
  status: z.enum(["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"])
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

export default function AppointmentFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      reason: "General consultation",
      status: "scheduled"
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: AppointmentForm) => {
      return createAppointment({
        ...values,
        appointmentDate: new Date(values.appointmentDate).toISOString()
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      void navigate("/app/appointments");
    }
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Book Appointment</h1>
      <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
        <input
          placeholder="Patient ID"
          {...form.register("patientId")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Doctor ID"
          {...form.register("doctorId")}
          className="w-full rounded border p-2"
        />
        <input
          type="datetime-local"
          {...form.register("appointmentDate")}
          className="w-full rounded border p-2"
        />
        <input
          placeholder="Reason"
          {...form.register("reason")}
          className="w-full rounded border p-2"
        />
        <select {...form.register("status")} className="w-full rounded border p-2">
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {mutation.isPending ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
