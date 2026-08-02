import { apiClient } from "@/lib/api-client";
import type { CreateInvoice, Invoice, UpdateInvoice } from "@/types/billing";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/billing";

export class BillingService {
  static async getInvoices() {
    const response = await apiClient.get<ApiResponse<Invoice[]>>(BASE_URL);
    return response.data;
  }

  static async getInvoiceById(id: string) {
    const response = await apiClient.get<ApiResponse<Invoice>>(`${BASE_URL}/${id}`);
    return response.data;
  }

  static async createInvoice(data: CreateInvoice) {
    const response = await apiClient.post<ApiResponse<Invoice>>(BASE_URL, data);
    return response.data;
  }

  static async updateInvoice(id: string, data: UpdateInvoice) {
    const response = await apiClient.patch<ApiResponse<Invoice>>(`${BASE_URL}/${id}`, data);
    return response.data;
  }

  static async deleteInvoice(id: string) {
    const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
    return response.data;
  }
}
