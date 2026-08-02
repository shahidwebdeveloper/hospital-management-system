import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingService } from "@/services/billing-service";
import type { CreateInvoice, UpdateInvoice } from "@/types/billing";

export function useInvoices() {
  return useQuery({
    queryKey: ["billing", "list"],
    queryFn: BillingService.getInvoices
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["billing", id],
    queryFn: () => BillingService.getInvoiceById(id),
    enabled: Boolean(id)
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoice) => BillingService.createInvoice(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["billing", "list"] });
    }
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoice }) =>
      BillingService.updateInvoice(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["billing", "list"] });
      void queryClient.invalidateQueries({ queryKey: ["billing", variables.id] });
    }
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BillingService.deleteInvoice(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["billing", "list"] });
    }
  });
}
