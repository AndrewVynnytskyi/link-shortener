import { httpClient } from "./http-client";
import { LinkAnalytics } from "@/types/analytics";

export const analyticsService = {
  async getForAnonymous(anonId: string, code: string): Promise<LinkAnalytics> {
    const { data } = await httpClient.get<LinkAnalytics>(
      `/analytics/anon/${anonId}/${code}`,
    );
    return data;
  },

  async getForOwner(code: string): Promise<LinkAnalytics> {
    const { data } = await httpClient.get<LinkAnalytics>(
      `/analytics/user/${code}`,
    );
    return data;
  },
};
