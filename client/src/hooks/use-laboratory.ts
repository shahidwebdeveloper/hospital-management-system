import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LaboratoryService } from "@/services/laboratory-service";

import type {
  CreateLaboratoryRequest,
  LaboratoryResultInput,
  UpdateLaboratoryStatus
} from "@/types/laboratory";

const laboratoryKeys = {
  all: ["laboratory"] as const,

  lists: () => [...laboratoryKeys.all, "list"] as const,

  queue: () => [...laboratoryKeys.all, "queue"] as const,

  detail: (id: string) => [...laboratoryKeys.all, "detail", id] as const
};

/**
 * Get all laboratory requests
 */
export function useLaboratoryRequests() {
  return useQuery({
    queryKey: laboratoryKeys.lists(),

    queryFn: async () => {
      const response = await LaboratoryService.getRequests();

      return response.data;
    }
  });
}

/**
 * Get laboratory queue
 */
export function useLaboratoryQueue() {
  return useQuery({
    queryKey: laboratoryKeys.queue(),

    queryFn: async () => {
      const response = await LaboratoryService.getQueue();

      return response.data;
    }
  });
}

/**
 * Get laboratory request by ID
 */
export function useLaboratoryRequest(id: string) {
  return useQuery({
    queryKey: laboratoryKeys.detail(id),

    queryFn: async () => {
      const response = await LaboratoryService.getRequestById(id);

      return response.data;
    },

    enabled: Boolean(id)
  });
}

/**
 * Create laboratory request
 */
export function useCreateLaboratoryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLaboratoryRequest) => LaboratoryService.createRequest(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.lists()
      });

      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.queue()
      });
    }
  });
}

/**
 * Update laboratory status
 */
export function useUpdateLaboratoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLaboratoryStatus }) =>
      LaboratoryService.updateStatus(id, data),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.lists()
      });

      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.detail(variables.id)
      });

      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.queue()
      });
    }
  });
}

/**
 * Enter laboratory result
 */
export function useEnterLaboratoryResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LaboratoryResultInput }) =>
      LaboratoryService.enterResult(id, data),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.lists()
      });

      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.detail(variables.id)
      });

      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.queue()
      });
    }
  });
}

/**
 * Cancel laboratory request
 */
export function useCancelLaboratoryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LaboratoryService.cancelRequest(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.lists()
      });

      void queryClient.invalidateQueries({
        queryKey: laboratoryKeys.queue()
      });
    }
  });
}
