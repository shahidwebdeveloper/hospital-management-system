import { useQuery } from "@tanstack/react-query";

import { getAppointments } from "@/services/appointment-services";

const appointmentKeys = {
  all: ["appointments"] as const,
  list: () => [...appointmentKeys.all, "list"] as const
};

export function useAppointments() {
  return useQuery({
    queryKey: appointmentKeys.list(),
    queryFn: getAppointments
  });
}
