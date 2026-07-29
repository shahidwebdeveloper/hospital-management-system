import { apiClient } from "@/lib/api-client";

export interface MedicalRecord {
  _id?: string;
  patientId: string;
  appointmentId?: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string[];
  treatmentPlan?: string;
  doctorNotes?: string;
  followUpDate?: string;
  status: "draft" | "active" | "closed" | "follow_up";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/medical-records";

export const getMedicalRecords = async (): Promise<ApiResponse<MedicalRecord[]>> => {
  const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(BASE_URL);
  return response.data;
};

export const getMedicalRecordById = async (id: string): Promise<ApiResponse<MedicalRecord>> => {
  const response = await apiClient.get<ApiResponse<MedicalRecord>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createMedicalRecord = async (
  data: MedicalRecord
): Promise<ApiResponse<MedicalRecord>> => {
  const response = await apiClient.post<ApiResponse<MedicalRecord>>(BASE_URL, data);
  return response.data;
};

export const updateMedicalRecord = async (
  id: string,
  data: Partial<MedicalRecord>
): Promise<ApiResponse<MedicalRecord>> => {
  const response = await apiClient.patch<ApiResponse<MedicalRecord>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteMedicalRecord = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
