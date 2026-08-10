export type UserRole =
  | "super_admin"
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "pharmacist"
  | "lab_technician"
  | "patient";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
}
