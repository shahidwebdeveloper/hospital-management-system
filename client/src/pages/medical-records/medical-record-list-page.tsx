import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { deleteMedicalRecord, getMedicalRecords } from "@/services/medical-record-services";
import type { MedicalRecord } from "@/services/medical-record-services";

export default function MedicalRecordListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medical-records"],
    queryFn: getMedicalRecords
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedicalRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    }
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this medical record?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-6">Loading medical records...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load medical records.</div>;

  const records: MedicalRecord[] = data?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <Link to="/app/medical-records/new" className="rounded bg-blue-600 px-4 py-2 text-white">
          Create Record
        </Link>
      </div>

      {records.length === 0 ? (
        <div>No medical records found.</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Diagnosis</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="border p-2">{record.patientId}</td>
                <td className="border p-2">{record.doctorId}</td>
                <td className="border p-2">{record.diagnosis}</td>
                <td className="border p-2">{record.status}</td>
                <td className="border p-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/app/medical-records/${record._id}`}
                      className="rounded bg-gray-600 px-3 py-1 text-white"
                    >
                      View
                    </Link>
                    <Link
                      to={`/app/medical-records/${record._id}/edit`}
                      className="rounded bg-blue-600 px-3 py-1 text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(record._id!)}
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
