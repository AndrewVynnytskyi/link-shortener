import { httpClient } from "./http-client";
import { AuthUser, LoginInput, SignupInput } from "@/types/auth";

/**
 * All authentication HTTP calls. The JWT itself is never handled here
 * or anywhere in the frontend — it lives in an httpOnly cookie the
 * browser attaches automatically (`withCredentials: true`).
 */
export const authService = {
  async signup(
    input: SignupInput,
  ): Promise<{ username: string; email: string }> {
    const { data } = await httpClient.post("/auth/signup", input);
    return data;
  },

  async login(input: LoginInput): Promise<void> {
    await httpClient.post("/auth/login", input);
  },

  async logout(): Promise<void> {
    await httpClient.post("/auth/logout");
  },

  /** Resolves with the current user, or `null` if not authenticated. */
  async getStatus(): Promise<AuthUser | null> {
    try {
      const { data } = await httpClient.get<AuthUser>("/auth/status");
      return data;
    } catch {
      return null;
    }
  },
};
