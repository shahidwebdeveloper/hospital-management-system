import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Link } from "react-router-dom";

import { deletePatient, getPatients } from "@/services/patient-services";

import type { Patient } from "@/services/patient-services";

export default function PatientListPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients"],

    queryFn: getPatients
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["patients"]
      });
    }
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this patient?");

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="p-6">Loading patients...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load patients.</div>;
  }

  const patients: Patient[] = data?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>

        <Link
          to="/app/patients/new"

          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Patient
        </Link>
      </div>

      <input
        type="text"

        placeholder="Search patients..."

        className="mb-4 w-full rounded border p-2"
      />

      {patients.length === 0 ? (
        <div>No patients found.</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>

              <th className="border p-2">Phone</th>

              <th className="border p-2">Gender</th>

              <th className="border p-2">Blood Group</th>

              <th className="border p-2">Status</th>

              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient: Patient) => (
              <tr key={patient._id}>
                <td className="border p-2">{patient.name}</td>

                <td className="border p-2">{patient.phone}</td>

                <td className="border p-2">{patient.gender}</td>

                <td className="border p-2">{patient.bloodGroup || "-"}</td>

                <td className="border p-2">{patient.status}</td>

                <td className="border p-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/app/patients/${patient._id}`}

                      className="rounded bg-green-600 px-3 py-1 text-white"
                    >
                      View
                    </Link>

                    <Link
                      to={`/app/patients/${patient._id}/edit`}

                      className="rounded bg-yellow-500 px-3 py-1 text-white"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(patient._id!)}

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
