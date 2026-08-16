import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyLinksView } from "./MyLinksView";

/**
 * Server-guarded route: redirects to `/login` if no `jwt` cookie is
 * present at all. The cookie's *validity* is still re-checked
 * client-side via `useAuth`/`GET /auth/status`, since a cookie merely
 * existing doesn't mean it's unexpired or unforged.
 */
export default async function Page() {
  const cookieStore = await cookies();
  if (!cookieStore.get("jwt")) {
    redirect("/login");
  }

  return <MyLinksView />;
}
