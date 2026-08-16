"use client";

import { useCallback } from "react";
import { toast } from "react-hot-toast";

/** Copies text to the clipboard and surfaces a toast on success/failure. */
export function useClipboard() {
  return useCallback((text: string, successMessage = "Copied to clipboard") => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(successMessage))
      .catch(() => toast.error("Couldn't copy to clipboard"));
  }, []);
}
