import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getPatientById } from "@/services/patient-services";

export default function PatientDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatientById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        Loading patient information...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load patient.
      </div>
    );
  }

  const patient = data?.data;

  if (!patient) {
    return (
      <div className="p-6">
        Patient not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Patient Details
        </h1>

        <Link
          to={`/patients/${patient._id}/edit`}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit Patient
        </Link>

      </div>


      <div className="grid gap-6">

        {/* Basic Information */}

        <section className="border rounded-lg p-5">

          <h2 className="text-xl font-semibold mb-4">
            Basic Information
          </h2>


          <p>
            <strong>Name:</strong> {patient.name}
          </p>


          <p>
            <strong>Phone:</strong> {patient.phone}
          </p>


          <p>
            <strong>Email:</strong> {patient.email || "-"}
          </p>


          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>


          <p>
            <strong>Date of Birth:</strong>{" "}
            {patient.dateOfBirth
              ? new Date(
                  patient.dateOfBirth
                ).toLocaleDateString()
              : "-"}
          </p>


          <p>
            <strong>Blood Group:</strong>{" "}
            {patient.bloodGroup || "-"}
          </p>


          <p>
            <strong>Status:</strong> {patient.status}
          </p>

        </section>



        {/* Address */}

        <section className="border rounded-lg p-5">

          <h2 className="text-xl font-semibold mb-4">
            Address
          </h2>


          <p>
            {patient.address || "No address provided"}
          </p>

        </section>



        {/* Emergency Contact */}

        <section className="border rounded-lg p-5">

          <h2 className="text-xl font-semibold mb-4">
            Emergency Contact
          </h2>


          {patient.emergencyContact ? (
            <>
              <p>
                <strong>Name:</strong>{" "}
                {patient.emergencyContact.name}
              </p>


              <p>
                <strong>Phone:</strong>{" "}
                {patient.emergencyContact.phone}
              </p>


              <p>
                <strong>Relationship:</strong>{" "}
                {patient.emergencyContact.relationship}
              </p>
            </>
          ) : (
            <p>
              No emergency contact available.
            </p>
          )}

        </section>



        {/* Medical Information */}

        <section className="border rounded-lg p-5">

          <h2 className="text-xl font-semibold mb-4">
            Medical Information
          </h2>


          <div>

            <strong>
              Allergies:
            </strong>


            {patient.allergies &&
            patient.allergies.length > 0 ? (
              <ul className="list-disc ml-6">

                {patient.allergies.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p>
                No allergies recorded.
              </p>
            )}

          </div>


          <br />


          <div>

            <strong>
              Medical History:
            </strong>


            {patient.medicalHistory &&
            patient.medicalHistory.length > 0 ? (
              <ul className="list-disc ml-6">

                {patient.medicalHistory.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p>
                No medical history recorded.
              </p>
            )}

          </div>

        </section>



        {/* Dates */}

        <section className="border rounded-lg p-5">

          <h2 className="text-xl font-semibold mb-4">
            Record Information
          </h2>


          <p>
            <strong>
              Registered:
            </strong>{" "}
            {patient.createdAt
              ? new Date(
                  patient.createdAt
                ).toLocaleString()
              : "-"}
          </p>


          <p>
            <strong>
              Last Updated:
            </strong>{" "}
            {patient.updatedAt
              ? new Date(
                  patient.updatedAt
                ).toLocaleString()
              : "-"}
          </p>

        </section>


      </div>

    </div>
  );
}