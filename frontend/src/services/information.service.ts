import { httpClient } from "./http-client";

export const informationService = {
  /** Fetches the `<title>` of a destination URL for display purposes. */
  async getPageTitle(originalUrl: string): Promise<string> {
    const { data } = await httpClient.get<{ title: string }>(
      `/information/${encodeURIComponent(originalUrl)}`,
    );
    return data.title;
  },
};
