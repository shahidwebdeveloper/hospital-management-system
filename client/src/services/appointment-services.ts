import { apiClient } from "@/lib/api-client";

export interface Appointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  reason?: string;
  status: "scheduled" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/appointments";

export const getAppointments = async (): Promise<ApiResponse<Appointment[]>> => {
  const response = await apiClient.get<ApiResponse<Appointment[]>>(BASE_URL);
  return response.data;
};

export const createAppointment = async (data: Appointment): Promise<ApiResponse<Appointment>> => {
  const response = await apiClient.post<ApiResponse<Appointment>>(BASE_URL, data);
  return response.data;
};

export const updateAppointment = async (
  id: string,
  data: Partial<Appointment>
): Promise<ApiResponse<Appointment>> => {
  const response = await apiClient.patch<ApiResponse<Appointment>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
