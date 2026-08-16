import axios from "axios";
import { getApiUrl } from "@/utils/env";

/**
 * Shared axios instance for every API call in the app. `withCredentials`
 * is required so the browser sends/receives the httpOnly `jwt` cookie
 * set by the backend — no service should construct its own axios
 * instance or read a token from JS-accessible storage.
 */
export const httpClient = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

/** Shape of the uniform error body returned by the backend's exception filter. */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

/** Extracts a single human-readable message from any error thrown by `httpClient`. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === "string") return message;
  }
  return fallback;
}
