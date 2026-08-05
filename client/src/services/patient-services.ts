import { apiClient } from "@/lib/api-client";

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Patient {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  gender: "male" | "female" | "other";
  dateOfBirth?: string;
  bloodGroup?:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";
  address?: string;
  emergencyContact?: EmergencyContact;
  allergies: string[];
  medicalHistory: string[];
  status: "registered" | "admitted" | "discharged";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const BASE_URL = "/patients";


/**
 * Get all patients
 */
export const getPatients = async (search = ""): Promise<ApiResponse<Patient[]>> => {
  const response = await apiClient.get<ApiResponse<Patient[]>>(BASE_URL, {
    params: search ? { search } : undefined
  });

  return response.data;
};


/**
 * Get patient by ID
 */
export const getPatientById = async (
  id: string
): Promise<ApiResponse<Patient>> => {
  const response = await apiClient.get<
    ApiResponse<Patient>
  >(`${BASE_URL}/${id}`);

  return response.data;
};


/**
 * Create patient
 */
export const createPatient = async (
  data: Patient
): Promise<ApiResponse<Patient>> => {
  const response = await apiClient.post<
    ApiResponse<Patient>
  >(BASE_URL, data);

  return response.data;
};


/**
 * Update patient
 */
export const updatePatient = async (
  id: string,
  data: Partial<Patient>
): Promise<ApiResponse<Patient>> => {
  const response = await apiClient.patch<
    ApiResponse<Patient>
  >(`${BASE_URL}/${id}`, data);

  return response.data;
};


/**
 * Delete patient
 */
export const deletePatient = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<
    ApiResponse<null>
  >(`${BASE_URL}/${id}`);

  return response.data;
};