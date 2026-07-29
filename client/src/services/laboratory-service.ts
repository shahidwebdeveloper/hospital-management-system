import { apiClient } from "@/lib/api-client";

import type {
  CreateLaboratoryRequest,
  Laboratory,
  LaboratoryResultInput,
  UpdateLaboratoryStatus
} from "@/types/laboratory";

interface LaboratoryResponse {
  success: boolean;
  message?: string;
  data: Laboratory;
}

interface LaboratoryListResponse {
  success: boolean;
  data: Laboratory[];
}

export class LaboratoryService {
  /**
   * Create laboratory request
   */
  static async createRequest(data: CreateLaboratoryRequest) {
    const response = await apiClient.post<LaboratoryResponse>("/laboratory", data);

    return response.data;
  }

  /**
   * Get all laboratory requests
   */
  static async getRequests() {
    const response = await apiClient.get<LaboratoryListResponse>("/laboratory");

    return response.data;
  }

  /**
   * Get laboratory queue
   */
  static async getQueue() {
    const response = await apiClient.get<LaboratoryListResponse>("/laboratory/queue");

    return response.data;
  }

  /**
   * Get laboratory request by id
   */
  static async getRequestById(id: string) {
    const response = await apiClient.get<LaboratoryResponse>(`/laboratory/${id}`);

    return response.data;
  }

  /**
   * Update laboratory status
   */
  static async updateStatus(id: string, data: UpdateLaboratoryStatus) {
    const response = await apiClient.patch<LaboratoryResponse>(`/laboratory/${id}/status`, data);

    return response.data;
  }

  /**
   * Enter laboratory result
   */
  static async enterResult(id: string, data: LaboratoryResultInput) {
    const response = await apiClient.patch<LaboratoryResponse>(`/laboratory/${id}/result`, data);

    return response.data;
  }

  /**
   * Cancel laboratory request
   */
  static async cancelRequest(id: string) {
    const response = await apiClient.patch<LaboratoryResponse>(`/laboratory/${id}/cancel`);

    return response.data;
  }

  /**
   * Delete laboratory request
   */
  static async deleteRequest(id: string) {
    const response = await apiClient.delete<LaboratoryResponse>(`/laboratory/${id}`);

    return response.data;
  }
}
