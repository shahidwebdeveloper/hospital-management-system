import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getDoctorById } from "@/services/doctor-services";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id!),
    enabled: Boolean(id)
  });

  if (isLoading) return <div className="p-6">Loading doctor...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load doctor.</div>;

  const doctor = data?.data;
  if (!doctor) return <div className="p-6">Doctor not found.</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{doctor.name}</h1>
        <div className="flex gap-2">
          <Link
            to={`/app/doctors/${doctor._id}/edit`}
            className="rounded bg-yellow-500 px-3 py-2 text-white"
          >
            Edit
          </Link>
          <Link to="/app/doctors" className="rounded border px-3 py-2">
            Back
          </Link>
        </div>
      </div>

      <div className="space-y-3 rounded border bg-white p-4">
        <p>
          <span className="font-semibold">Email:</span> {doctor.email || "-"}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {doctor.phone}
        </p>
        <p>
          <span className="font-semibold">Specialization:</span> {doctor.specialization}
        </p>
        <p>
          <span className="font-semibold">Department:</span> {doctor.department}
        </p>
        <p>
          <span className="font-semibold">License number:</span> {doctor.licenseNumber}
        </p>
        <p>
          <span className="font-semibold">Available days:</span>{" "}
          {doctor.availableDays?.join(", ") || "-"}
        </p>
        <p>
          <span className="font-semibold">Available time:</span> {doctor.availableTime || "-"}
        </p>
        <p>
          <span className="font-semibold">Status:</span> {doctor.status}
        </p>
      </div>
    </div>
  );
}
