import { createContext, useContext, useMemo, useEffect, useState, type ReactNode } from "react";

import type { LoginInput, RegisterInput, UserRole } from "@hms/contracts";

import { authService } from "@/services/auth-services";

import type { AuthContextType } from "@/types/auth-types";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [userState, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchSession() {
    setLoading(true);

    try {
      /*
       * Step 1:
       * Get the Better Auth session.
       */
      const sessionResponse = await authService.getCurrentUser();

      const sessionUser = sessionResponse.data?.user ?? null;

      if (!sessionUser) {
        setUserState(null);
        return;
      }

      /*
       * Step 2:
       * Get the HMS user.
       *
       * The HMS user contains the actual application role:
       *
       * patient
       * doctor
       * admin
       * nurse
       * ...
       */
      const hmsUserResponse = await fetch("http://localhost:5000/api/v1/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!hmsUserResponse.ok) {
        throw new Error("Unable to get HMS user");
      }

      const hmsResponse = (await hmsUserResponse.json()) as {
        success: boolean;
        data?: {
          id: string;
          name: string;
          email: string;
          role: UserRole;
          image?: string;
        };
      };

      if (!hmsResponse.success || !hmsResponse.data) {
        throw new Error("HMS user not found");
      }

      /*
       * Step 3:
       * Store the HMS user, including their role.
       */
      setUserState({
        id: hmsResponse.data.id,
        name: hmsResponse.data.name,
        email: hmsResponse.data.email,
        role: hmsResponse.data.role,
        image: hmsResponse.data.image
      });
    } catch (error) {
      console.error("Failed to fetch current user:", error);
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

    setUserState(null);

    window.location.assign("/");
  }

  const user = useMemo(() => {
    if (!userState) {
      return null;
    }

    return {
      id: userState.id,
      name: userState.name,
      email: userState.email,
      role: userState.role,
      image: userState.image
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

