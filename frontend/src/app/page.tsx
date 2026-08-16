import { cookies } from "next/headers";
import { HomeView } from "./HomeView";
import { urlService } from "@/services/url.service";
import { PaginatedLinks } from "@/types/url";

const EMPTY_LINKS: PaginatedLinks = { total: 0, urls: [] };

/**
 * Server component: prefetches the first page of an anonymous client's
 * links when they already have an `anonId` cookie (returning visitor),
 * so the list renders without a loading flash. First-time visitors get
 * an empty initial list — their id cookie is generated client-side.
 */
export default async function Page() {
  const cookieStore = await cookies();
  const anonId = cookieStore.get("anonId")?.value;

  if (!anonId) {
    return <HomeView initialData={EMPTY_LINKS} />;
  }

  try {
    const data = await urlService.listAnonymous(anonId, 0);
    return <HomeView initialData={data} />;
  } catch {
    return <HomeView initialData={EMPTY_LINKS} />;
  }
}
