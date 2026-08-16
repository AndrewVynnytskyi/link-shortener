"use client";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from "typescript-cookie";

const ANON_ID_COOKIE = "anonId";
const ANON_ID_LENGTH = 12;
const ANON_ID_TTL_DAYS = 365;

function generateAnonId(): string {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(ANON_ID_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

/**
 * Identifies an unauthenticated visitor across sessions via a
 * long-lived, non-sensitive cookie (not the auth JWT). Used so
 * anonymous users can list/delete the links they created without
 * signing up.
 */
export function useAnonId(): string | undefined {
  const [anonId, setAnonId] = useState<string>();

  useEffect(() => {
    const existing = getCookie(ANON_ID_COOKIE);
    if (existing) {
      setAnonId(existing);
      return;
    }
    const generated = generateAnonId();
    setCookie(ANON_ID_COOKIE, generated, { expires: ANON_ID_TTL_DAYS });
    setAnonId(generated);
  }, []);

  return anonId;
}
