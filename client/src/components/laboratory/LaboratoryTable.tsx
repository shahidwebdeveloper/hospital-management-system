import type { Laboratory } from "@/types/laboratory";

import { StatusBadge } from "./StatusBadge";

interface LaboratoryTableProps {
  laboratories: Laboratory[];

  onCollectSample?: (id: string) => void;

  onProcess?: (id: string) => void;

  onEnterResult?: (id: string) => void;
}

export function LaboratoryTable({
  laboratories,
  onCollectSample,
  onProcess,
  onEnterResult
}: LaboratoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">Patient</th>

            <th className="px-4 py-3 text-left">Test</th>

            <th className="px-4 py-3 text-left">Category</th>

            <th className="px-4 py-3 text-left">Priority</th>

            <th className="px-4 py-3 text-left">Status</th>

            <th className="px-4 py-3 text-left">Date</th>

            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {laboratories.map((lab) => (
            <tr key={lab._id} className="border-t">
              <td className="px-4 py-3">
                {typeof lab.patient === "object" ? lab.patient.name : lab.patient}
              </td>

              <td className="px-4 py-3 font-medium">{lab.testName}</td>

              <td className="px-4 py-3">{lab.category}</td>

              <td className="px-4 py-3 capitalize">{lab.priority}</td>

              <td className="px-4 py-3">
                <StatusBadge status={lab.status} />
              </td>

              <td className="px-4 py-3">{new Date(lab.requestedAt).toLocaleDateString()}</td>

              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {lab.status === "requested" && onCollectSample && (
                    <button
                      onClick={() => onCollectSample(lab._id)}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white"
                    >
                      Collect
                    </button>
                  )}

                  {lab.status === "sample_collected" && onProcess && (
                    <button
                      onClick={() => onProcess(lab._id)}
                      className="rounded-md bg-purple-600 px-3 py-1 text-xs text-white"
                    >
                      Process
                    </button>
                  )}

                  {lab.status === "processing" && onEnterResult && (
                    <button
                      onClick={() => onEnterResult(lab._id)}
                      className="rounded-md bg-green-600 px-3 py-1 text-xs text-white"
                    >
                      Result
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
