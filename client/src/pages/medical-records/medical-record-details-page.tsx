import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getMedicalRecordById } from "@/services/medical-record-services";

export default function MedicalRecordDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["medical-record", id],
    queryFn: () => getMedicalRecordById(id!),
    enabled: Boolean(id)
  });

  if (isLoading) return <div className="p-6">Loading medical record...</div>;
  if (isError || !data?.data)
    return <div className="p-6 text-red-500">Medical record not found.</div>;

  const record = data.data;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medical Record Details</h1>
        <div className="flex gap-2">
          <Link to="/app/medical-records" className="rounded border px-4 py-2">
            Back
          </Link>
          <Link
            to={`/app/medical-records/${record._id}/edit`}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-4 rounded border bg-white p-6 shadow">
        <div>
          <p className="text-sm font-semibold text-gray-500">Patient ID</p>
          <p>{record.patientId}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Doctor ID</p>
          <p>{record.doctorId}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Diagnosis</p>
          <p>{record.diagnosis}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Symptoms</p>
          <p>{record.symptoms.join(", ")}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Treatment Plan</p>
          <p>{record.treatmentPlan || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Doctor Notes</p>
          <p>{record.doctorNotes || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Follow-up Date</p>
          <p>{record.followUpDate || "—"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Status</p>
          <p>{record.status}</p>
        </div>
      </div>
    </div>
  );
}
