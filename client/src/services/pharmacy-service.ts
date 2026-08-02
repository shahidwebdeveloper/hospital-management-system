import { apiClient } from "@/lib/api-client";
import type { CreateMedicine, Medicine, UpdateMedicine } from "@/types/pharmacy";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}

export class PharmacyService {
  static async getMedicines() {
    const response = await apiClient.get<ApiListResponse<Medicine>>("/pharmacy");
    return response.data;
  }

  static async getMedicine(id: string) {
    const response = await apiClient.get<ApiResponse<Medicine>>(`/pharmacy/${id}`);
    return response.data;
  }

  static async createMedicine(data: CreateMedicine) {
    const response = await apiClient.post<ApiResponse<Medicine>>("/pharmacy", data);
    return response.data;
  }

  static async updateMedicine(id: string, data: UpdateMedicine) {
    const response = await apiClient.patch<ApiResponse<Medicine>>(`/pharmacy/${id}`, data);
    return response.data;
  }

  static async deleteMedicine(id: string) {
    const response = await apiClient.delete<ApiResponse<Medicine>>(`/pharmacy/${id}`);
    return response.data;
  }
}
