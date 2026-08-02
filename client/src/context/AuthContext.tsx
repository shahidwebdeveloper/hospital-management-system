import { createContext, useContext, useMemo, useEffect, useState, type ReactNode } from "react";

import type { LoginInput, RegisterInput } from "@hms/contracts";

import { authClient } from "@/lib/auth-client";
import { authService } from "@/services/auth-services";
import type { AuthContextType } from "@/types/auth-types";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [userState, setUserState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchSession() {
    setLoading(true);
    try {
      const resp = await authService.getCurrentUser();

      // authClient.getSession() returns { data, error } shape or similar
      if (resp?.data?.user) {
        setUserState(resp.data.user);
      } else if (resp?.user) {
        setUserState(resp.user);
      } else {
        setUserState(null);
      }
    } catch (err) {
      // network or server error; treat as no session
      // console.warn(err);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSession();
  }, []);

  async function login(data: LoginInput) {
    await authService.login(data);
    await fetchSession();
  }

  async function register(data: RegisterInput) {
    await authService.register(data);
    await fetchSession();
  }

  async function logout() {
    await authService.logout();
    await fetchSession();
  }

  const user = useMemo(() => {
    const sessionUser = userState;

    if (!sessionUser) return null;

    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
      image: sessionUser.image ?? undefined
    };
  }, [userState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
