"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { urlService } from "@/services/url.service";
import { CreateLinkInput, PaginatedLinks } from "@/types/url";

const LINKS_QUERY_KEY = "links";

/**
 * Lists links owned by an anonymous client id. Disabled until the id
 * cookie has been read/generated client-side (see `useAnonId`).
 */
export function useAnonLinksQuery(
  anonId: string | undefined,
  page: number,
  initialData?: PaginatedLinks,
) {
  return useQuery({
    queryKey: [LINKS_QUERY_KEY, "anon", anonId, page],
    queryFn: () => urlService.listAnonymous(anonId as string, page),
    enabled: Boolean(anonId),
    initialData: page === 0 ? initialData : undefined,
  });
}

/** Lists links owned by the authenticated user. */
export function useOwnLinksQuery(
  page: number,
  enabled: boolean,
  initialData?: PaginatedLinks,
) {
  return useQuery({
    queryKey: [LINKS_QUERY_KEY, "own", page],
    queryFn: () => urlService.listOwn(page),
    enabled,
    initialData: page === 0 ? initialData : undefined,
  });
}

export function useCreateAnonLinkMutation(anonId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLinkInput) =>
      urlService.createAnonymous({ ...input, userId: anonId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [LINKS_QUERY_KEY, "anon", anonId],
      }),
  });
}

export function useCreateOwnLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLinkInput) => urlService.createForUser(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [LINKS_QUERY_KEY, "own"] }),
  });
}

export function useDeleteAnonLinkMutation(anonId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) =>
      urlService.deleteAnonymous(anonId as string, code),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [LINKS_QUERY_KEY, "anon", anonId],
      }),
  });
}

export function useDeleteOwnLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => urlService.deleteOwn(code),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [LINKS_QUERY_KEY, "own"] }),
  });
}
