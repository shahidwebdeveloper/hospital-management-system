import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import {
  deleteAppointment,
  getAppointments,
  updateAppointment
} from "@/services/appointment-services";
import type { Appointment } from "@/services/appointment-services";

const statuses = [
  "scheduled",
  "checked_in",
  "in_progress",
  "completed",
  "cancelled",
  "no_show"
] as const;

export default function AppointmentListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment["status"] }) =>
      updateAppointment(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-6">Loading appointments...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load appointments.</div>;

  const appointments: Appointment[] = data?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Link to="/app/appointments/new" className="rounded bg-blue-600 px-4 py-2 text-white">
          Book Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="border p-2">{appointment.patientId}</td>
                <td className="border p-2">{appointment.doctorId}</td>
                <td className="border p-2">
                  {new Date(appointment.appointmentDate).toLocaleString()}
                </td>
                <td className="border p-2">{appointment.status}</td>
                <td className="border p-2">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={appointment.status}
                      onChange={(event) =>
                        updateStatusMutation.mutate({
                          id: appointment._id!,
                          status: event.target.value as Appointment["status"]
                        })
                      }
                      className="rounded border px-2 py-1"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(appointment._id!)}
                      disabled={deleteMutation.isPending}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
