import { useParams } from "react-router-dom";

import { StatusBadge } from "@/components/laboratory/StatusBadge";

import { useLaboratoryRequest } from "@/hooks/use-laboratory";

export default function LaboratoryDetailsPage() {
  const { id } = useParams();

  const { data: laboratory, isLoading, isError } = useLaboratoryRequest(id ?? "");

  if (isLoading) {
    return <div className="p-6">Loading laboratory details...</div>;
  }

  if (isError || !laboratory) {
    return <div className="p-6 text-red-500">Laboratory request not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Laboratory Details</h1>

          <p className="text-muted-foreground">View laboratory request information.</p>
        </div>

        <StatusBadge status={laboratory.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient */}

        <div className="rounded-lg border p-5">
          <h2 className="mb-3 font-semibold">Patient Information</h2>

          <p>
            <span className="font-medium">Name:</span>{" "}
            {typeof laboratory.patient === "object" ? laboratory.patient.name : laboratory.patient}
          </p>
        </div>

        {/* Test Information */}

        <div className="rounded-lg border p-5">
          <h2 className="mb-3 font-semibold">Test Information</h2>

          <p>
            <span className="font-medium">Test:</span> {laboratory.testName}
          </p>

          <p>
            <span className="font-medium">Category:</span> {laboratory.category}
          </p>

          <p>
            <span className="font-medium">Priority:</span> {laboratory.priority}
          </p>
        </div>

        {/* Result */}

        <div className="rounded-lg border p-5 md:col-span-2">
          <h2 className="mb-3 font-semibold">Test Result</h2>

          {laboratory.result ? (
            <>
              <p>
                <span className="font-medium">Result:</span>
              </p>

              <p className="mt-2 rounded-md bg-muted p-3">{laboratory.result}</p>

              <p className="mt-3">
                <span className="font-medium">Reference Range:</span>{" "}
                {laboratory.referenceRange ?? "N/A"}
              </p>

              <p>
                <span className="font-medium">Unit:</span> {laboratory.unit ?? "N/A"}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">Result is not available yet.</p>
          )}
        </div>

        {/* Dates */}

        <div className="rounded-lg border p-5 md:col-span-2">
          <h2 className="mb-3 font-semibold">Timeline</h2>

          <p>Requested: {new Date(laboratory.requestedAt).toLocaleString()}</p>

          {laboratory.sampleCollectedAt && (
            <p>Sample Collected: {new Date(laboratory.sampleCollectedAt).toLocaleString()}</p>
          )}

          {laboratory.completedAt && (
            <p>Completed: {new Date(laboratory.completedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
