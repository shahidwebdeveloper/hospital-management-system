import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getPrescriptionById } from "@/services/prescription-services";

export default function PrescriptionDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["prescription", id],
    queryFn: () => getPrescriptionById(id!),
    enabled: Boolean(id)
  });

  if (isLoading) return <div className="p-6">Loading prescription...</div>;
  if (isError || !data?.data)
    return <div className="p-6 text-red-500">Prescription not found.</div>;

  const prescription = data.data;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prescription Details</h1>
        <div className="flex gap-2">
          <Link to="/app/prescriptions" className="rounded border px-4 py-2">
            Back
          </Link>
          <Link
            to={`/app/prescriptions/${prescription._id}/edit`}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-4 rounded border bg-white p-6 shadow">
        <div>
          <p className="text-sm font-semibold text-gray-500">Patient ID</p>
          <p>{prescription.patientId}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Doctor ID</p>
          <p>{prescription.doctorId}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Status</p>
          <p>{prescription.status}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Notes</p>
          <p>{prescription.notes || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Medicines</p>
          <div className="mt-2 space-y-2">
            {prescription.items.map((item, index) => (
              <div key={`${item.medicineName}-${index}`} className="rounded border p-3">
                <p className="font-medium">{item.medicineName}</p>
                <p className="text-sm">Dosage: {item.dosage}</p>
                <p className="text-sm">Duration: {item.duration}</p>
                {item.instructions ? (
                  <p className="text-sm">Instructions: {item.instructions}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
