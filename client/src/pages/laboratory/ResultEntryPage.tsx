import { useParams, useNavigate } from "react-router-dom";

import { ResultForm } from "@/components/laboratory/ResultForm";

export default function ResultEntryPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  if (!id) {
    return <div className="p-6 text-red-500">Laboratory request ID is missing.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Enter Laboratory Result</h1>

        <p className="text-muted-foreground">
          Add the final test result and complete the laboratory request.
        </p>
      </div>

      <ResultForm
        laboratoryId={id}

        onSuccess={() => {
          void navigate("/laboratory/queue");
        }}
      />
    </div>
  );
}
