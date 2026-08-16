"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { AuthUser, LoginInput, SignupInput } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Session state for the whole app. Deliberately thin: it holds only
 * the current user and delegates every network call to
 * `services/auth.service`, so components never talk to axios directly.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    authService
      .getStatus()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  async function login(input: LoginInput): Promise<void> {
    await authService.login(input);
    const currentUser = await authService.getStatus();
    setUser(currentUser);
    await queryClient.invalidateQueries({ queryKey: ["links"] });
  }

  async function signup(input: SignupInput): Promise<void> {
    await authService.signup(input);
  }

  async function logout(): Promise<void> {
    await authService.logout();
    setUser(null);
    await queryClient.invalidateQueries({ queryKey: ["links"] });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Reads session state and auth actions. Must be used inside `<AuthProvider>`. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
