import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { deleteDoctor, getDoctors } from "@/services/doctor-services";
import type { Doctor } from "@/services/doctor-services";

export default function DoctorListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["doctors"], queryFn: getDoctors });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
    }
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className="p-6">Loading doctors...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load doctors.</div>;

  const doctors: Doctor[] = data?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Link to="/app/doctors/new" className="rounded bg-blue-600 px-4 py-2 text-white">
          Add Doctor
        </Link>
      </div>

      {doctors.length === 0 ? (
        <div>No doctors found.</div>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Specialization</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="border p-2">{doctor.name}</td>
                <td className="border p-2">{doctor.specialization}</td>
                <td className="border p-2">{doctor.department}</td>
                <td className="border p-2">{doctor.phone}</td>
                <td className="border p-2">{doctor.status}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/app/doctors/${doctor._id}`}
                      className="rounded bg-green-600 px-3 py-1 text-white"
                    >
                      View
                    </Link>
                    <Link
                      to={`/app/doctors/${doctor._id}/edit`}
                      className="rounded bg-yellow-500 px-3 py-1 text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(doctor._id!)}
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
