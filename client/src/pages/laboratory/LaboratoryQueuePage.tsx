import { LaboratoryTable } from "@/components/laboratory/LaboratoryTable";

import { useLaboratoryQueue, useUpdateLaboratoryStatus } from "@/hooks/use-laboratory";

export default function LaboratoryQueuePage() {
  const { data: laboratories, isLoading, isError } = useLaboratoryQueue();

  const updateStatus = useUpdateLaboratoryStatus();

  const handleCollectSample = (id: string) => {
    updateStatus.mutate({
      id,

      data: {
        status: "sample_collected"
      }
    });
  };

  const handleProcess = (id: string) => {
    updateStatus.mutate({
      id,

      data: {
        status: "processing"
      }
    });
  };

  const handleEnterResult = (id: string) => {
    console.log("Open result page:", id);
  };

  if (isLoading) {
    return <div className="p-6">Loading laboratory queue...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load laboratory queue.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Laboratory Queue</h1>

        <p className="text-muted-foreground">
          Manage requested tests and enter laboratory results.
        </p>
      </div>

      <LaboratoryTable
        laboratories={laboratories ?? []}

        onCollectSample={handleCollectSample}

        onProcess={handleProcess}

        onEnterResult={handleEnterResult}
      />
    </div>
  );
}
