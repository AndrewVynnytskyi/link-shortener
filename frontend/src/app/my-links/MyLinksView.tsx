"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ShortenUrlForm,
  ShortenUrlFormValues,
} from "@/components/forms/ShortenUrlForm";
import { LinkList } from "@/components/links/LinkList";
import { useAuth } from "@/store/auth-context";
import {
  useCreateOwnLinkMutation,
  useDeleteOwnLinkMutation,
  useOwnLinksQuery,
} from "@/hooks/use-urls";
import { getApiErrorMessage } from "@/services/http-client";

export function MyLinksView() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, user, router]);

  const { data, isLoading: areLinksLoading } = useOwnLinksQuery(
    page,
    Boolean(user),
  );
  const createLink = useCreateOwnLinkMutation();
  const deleteLink = useDeleteOwnLinkMutation();

  async function handleCreate({
    originalUrl,
    customSlug,
  }: ShortenUrlFormValues) {
    await createLink.mutateAsync({
      originalUrl,
      shortUrl: customSlug || undefined,
    });
    toast.success("Link shortened!");
  }

  async function handleDelete(code: string) {
    try {
      await deleteLink.mutateAsync(code);
      toast.success("Link deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this link"));
    }
  }

  if (isAuthLoading || !user) {
    return (
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-10">
      <div className="w-full text-left">
        <h1 className="text-foreground text-3xl font-bold">My links</h1>
        <p className="text-muted mt-1">Welcome back, {user.username}.</p>
      </div>

      <Card className="w-full p-4 sm:p-6">
        <ShortenUrlForm
          onSubmit={handleCreate}
          showCustomSlug
          submitLabel="Create link"
        />
      </Card>

      <section className="w-full">
        <LinkList
          links={data?.urls ?? []}
          total={data?.total ?? 0}
          page={page}
          onPageChange={setPage}
          onDelete={handleDelete}
          deletingCode={deleteLink.isPending ? deleteLink.variables : undefined}
          isLoading={areLinksLoading}
          isOwner
        />
      </section>
    </div>
  );
}
