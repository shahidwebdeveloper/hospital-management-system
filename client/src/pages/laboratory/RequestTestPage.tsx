import { RequestTestForm } from "@/components/laboratory/RequestTestForm";
import { usePatients } from "@/hooks/use-patients";
import { useAuth } from "@/context/AuthContext";

export default function RequestTestPage() {
  const { user } = useAuth();
  const { data: patients, isLoading, isError } = usePatients();

  if (!user) {
    return (
      <div className="p-6 text-red-500">You must be signed in to request a laboratory test.</div>
    );
  }

  if (user.role !== "doctor") {
    return (
      <div className="p-6 text-red-500">
        Laboratory test requests can only be created by users with the doctor role.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-6">Loading patients...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load patients.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Request Laboratory Test</h1>

        <p className="text-muted-foreground">Create a new laboratory test request for a patient.</p>
      </div>

      <RequestTestForm
        doctorId={user.id}

        patients={
          patients?.map((patient) => ({
            _id: patient._id ?? "",
            name: patient.name
          })) ?? []
        }
      />
    </div>
  );
}
