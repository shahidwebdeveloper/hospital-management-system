import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { LoginInput, RegisterInput } from "@hms/contracts";

import { authClient } from "@/lib/auth-client";
import { authService } from "@/services/auth-services";
import type { AuthContextType } from "@/types/auth-types";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const session = authClient.useSession();

  async function login(data: LoginInput) {
    await authService.login(data);
    await session.refetch();
  }

  async function register(data: RegisterInput) {
    await authService.register(data);
    await session.refetch();
  }

  async function logout() {
    await authService.logout();
    await session.refetch();
  }

  const user = useMemo(() => {
    const sessionUser = session.data?.user;

    if (!sessionUser) {
      return null;
    }

    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      role: "patient" as const,
      image: sessionUser.image ?? undefined
    };
  }, [session.data?.user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: session.isPending,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
