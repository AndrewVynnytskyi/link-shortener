import { httpClient } from "./http-client";
import { getApiUrl } from "@/utils/env";
import { CreateLinkInput, PaginatedLinks, ShortLink } from "@/types/url";

/**
 * All link CRUD HTTP calls. Split into "anonymous" (identified by a
 * client-generated id cookie) and "own" (identified by the auth
 * cookie) variants, mirroring the backend's two-route split per
 * operation — see `backend/src/urls/url.controller.ts`.
 */
export const urlService = {
  async createAnonymous(input: CreateLinkInput): Promise<ShortLink> {
    const { data } = await httpClient.post<ShortLink>("/urls/anon", input);
    return data;
  },

  async createForUser(input: CreateLinkInput): Promise<ShortLink> {
    const { data } = await httpClient.post<ShortLink>("/urls/user", input);
    return data;
  },

  async listAnonymous(anonId: string, page: number): Promise<PaginatedLinks> {
    const { data } = await httpClient.get<PaginatedLinks>(
      `/urls/anon/${anonId}/${page}`,
    );
    return data;
  },

  async listOwn(page: number): Promise<PaginatedLinks> {
    const { data } = await httpClient.get<PaginatedLinks>(`/urls/user/${page}`);
    return data;
  },

  async deleteAnonymous(anonId: string, code: string): Promise<void> {
    await httpClient.delete(`/urls/anon/${anonId}/${code}`);
  },

  async deleteOwn(code: string): Promise<void> {
    await httpClient.delete(`/urls/user/${code}`);
  },

  /** Builds the publicly shareable short link for a given code. */
  getShortLinkUrl(code: string): string {
    return `${getApiUrl()}/r/${code}`;
  },
};
