import type { LoginInput, RegisterInput } from "@hms/contracts";

import { authClient } from "@/lib/auth-client";

class AuthService {
  async login(data: LoginInput) {
    const response = await authClient.signIn.email(data);

    if (response.error) {
      throw new Error(response.error.message ?? "Unable to sign in");
    }

    return response.data;
  }

  async register(data: RegisterInput) {
    const response = await authClient.signUp.email(data);

    if (response.error) {
      throw new Error(response.error.message ?? "Unable to create account");
    }

    return response.data;
  }

  async logout() {
    const response = await authClient.signOut();

    if (response.error) {
      throw new Error(response.error.message ?? "Unable to sign out");
    }
  }

  getCurrentUser() {
    return authClient.getSession();
  }
}

export const authService = new AuthService();
