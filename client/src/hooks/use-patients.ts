import { getPatientById, getPatients } from "@/services/patient-services";
import { useQuery } from "@tanstack/react-query";

export const patientKeys = {
  all: ["patients"] as const,

  lists: () => [...patientKeys.all, "list"] as const,

  detail: (id: string) => [...patientKeys.all, "detail", id] as const
};

/**
 * Get all patients
 */
export function usePatients() {
  return useQuery({
    queryKey: patientKeys.lists(),

    queryFn: async () => {
      const response = await getPatients();

      return response.data;
    }
  });
}

/**
 * Get patient by ID
 */
export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),

    queryFn: async () => {
      const response = await getPatientById(id);

      return response.data;
    },

    enabled: Boolean(id)
  });
}
