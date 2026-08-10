import { apiClient } from "@/lib/api-client";

export type UserRole =
  | "super_admin"
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "pharmacist"
  | "lab_technician"
  | "patient";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/users";

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await apiClient.get<ApiResponse<User[]>>(BASE_URL);
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}): Promise<ApiResponse<User>> => {
  const response = await apiClient.post<ApiResponse<User>>(BASE_URL, data);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: Partial<Pick<User, "name" | "email" | "phone" | "role" | "isActive" | "isVerified">> & {
    password?: string;
  }
): Promise<ApiResponse<User>> => {
  const response = await apiClient.patch<ApiResponse<User>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
