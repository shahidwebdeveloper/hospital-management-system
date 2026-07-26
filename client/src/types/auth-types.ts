import type { HmsUser, LoginInput, RegisterInput } from "@hms/contracts";

export interface AuthContextType {
  user: HmsUser | null;
  loading: boolean;

  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}
