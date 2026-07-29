import type { LaboratoryStatus } from "@/types/laboratory";

interface StatusBadgeProps {
  status: LaboratoryStatus;
}

const statusConfig = {
  requested: {
    label: "Requested",
    className: "bg-yellow-100 text-yellow-700"
  },

  sample_collected: {
    label: "Sample Collected",
    className: "bg-blue-100 text-blue-700"
  },

  processing: {
    label: "Processing",
    className: "bg-purple-100 text-purple-700"
  },

  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700"
  },

  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700"
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}
