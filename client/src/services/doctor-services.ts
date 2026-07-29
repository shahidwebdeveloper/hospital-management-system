import { apiClient } from "@/lib/api-client";

export interface Doctor {
  _id?: string;
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  department: string;
  licenseNumber: string;
  availableDays: string[];
  availableTime?: string;
  status: "available" | "busy" | "off_duty" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/doctors";

export const getDoctors = async (): Promise<ApiResponse<Doctor[]>> => {
  const response = await apiClient.get<ApiResponse<Doctor[]>>(BASE_URL);
  return response.data;
};

export const getDoctorById = async (id: string): Promise<ApiResponse<Doctor>> => {
  const response = await apiClient.get<ApiResponse<Doctor>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createDoctor = async (data: Doctor): Promise<ApiResponse<Doctor>> => {
  const response = await apiClient.post<ApiResponse<Doctor>>(BASE_URL, data);
  return response.data;
};

export const updateDoctor = async (
  id: string,
  data: Partial<Doctor>
): Promise<ApiResponse<Doctor>> => {
  const response = await apiClient.patch<ApiResponse<Doctor>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteDoctor = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
