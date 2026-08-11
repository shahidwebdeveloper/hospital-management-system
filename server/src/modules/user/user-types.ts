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
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;

  /**
   * Password is accepted by the input type so the frontend
   * can eventually support password changes, but it must NOT
   * be written into the HMS User collection.
   *
   * Password changes should be handled through Better Auth.
   */
  password?: string;
}
