import { apiClient } from "@/lib/api-client";

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  _id?: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  items: PrescriptionItem[];
  status: "issued" | "dispensed" | "partially_dispensed" | "cancelled";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/prescriptions";

export const getPrescriptions = async (): Promise<ApiResponse<Prescription[]>> => {
  const response = await apiClient.get<ApiResponse<Prescription[]>>(BASE_URL);
  return response.data;
};

export const getPrescriptionById = async (id: string): Promise<ApiResponse<Prescription>> => {
  const response = await apiClient.get<ApiResponse<Prescription>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createPrescription = async (
  data: Prescription
): Promise<ApiResponse<Prescription>> => {
  const response = await apiClient.post<ApiResponse<Prescription>>(BASE_URL, data);
  return response.data;
};

export const updatePrescription = async (
  id: string,
  data: Partial<Prescription>
): Promise<ApiResponse<Prescription>> => {
  const response = await apiClient.patch<ApiResponse<Prescription>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deletePrescription = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
