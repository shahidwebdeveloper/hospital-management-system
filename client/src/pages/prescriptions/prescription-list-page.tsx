import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { deletePrescription, getPrescriptions } from "@/services/prescription-services";
import type { Prescription } from "@/services/prescription-services";

export default function PrescriptionListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: getPrescriptions
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrescription,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    }
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Delete this prescription?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-6">Loading prescriptions...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load prescriptions.</div>;

  const prescriptions: Prescription[] = data?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Link to="/app/prescriptions/new" className="rounded bg-blue-600 px-4 py-2 text-white">
          Create Prescription
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <div>No prescriptions found.</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription._id}>
                <td className="border p-2">{prescription.patientId}</td>
                <td className="border p-2">{prescription.doctorId}</td>
                <td className="border p-2">{prescription.status}</td>
                <td className="border p-2">{prescription.items.length}</td>
                <td className="border p-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/app/prescriptions/${prescription._id}`}
                      className="rounded bg-gray-600 px-3 py-1 text-white"
                    >
                      View
                    </Link>
                    <Link
                      to={`/app/prescriptions/${prescription._id}/edit`}
                      className="rounded bg-blue-600 px-3 py-1 text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(prescription._id!)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
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
