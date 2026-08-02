import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PharmacyService } from "@/services/pharmacy-service";
import type { CreateMedicine, UpdateMedicine } from "@/types/pharmacy";

export function useMedicines() {
  return useQuery({
    queryKey: ["pharmacy", "list"],
    queryFn: async () => {
      const response = await PharmacyService.getMedicines();
      return response.data;
    }
  });
}

export function useMedicine(id: string) {
  return useQuery({
    queryKey: ["pharmacy", id],
    queryFn: async () => {
      const response = await PharmacyService.getMedicine(id);
      return response.data;
    },
    enabled: Boolean(id)
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMedicine) => PharmacyService.createMedicine(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pharmacy", "list"] });
    }
  });
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicine }) =>
      PharmacyService.updateMedicine(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["pharmacy", "list"] });
      void queryClient.invalidateQueries({ queryKey: ["pharmacy", variables.id] });
    }
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PharmacyService.deleteMedicine(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pharmacy", "list"] });
    }
  });
}
