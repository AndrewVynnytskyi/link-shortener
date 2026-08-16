"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import {
  ShortenUrlForm,
  ShortenUrlFormValues,
} from "@/components/forms/ShortenUrlForm";
import { LinkList } from "@/components/links/LinkList";
import { useAnonId } from "@/hooks/use-anon-id";
import {
  useAnonLinksQuery,
  useCreateAnonLinkMutation,
  useDeleteAnonLinkMutation,
} from "@/hooks/use-urls";
import { getApiErrorMessage } from "@/services/http-client";
import { PaginatedLinks } from "@/types/url";

export function HomeView({ initialData }: { initialData: PaginatedLinks }) {
  const anonId = useAnonId();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useAnonLinksQuery(anonId, page, initialData);
  const createLink = useCreateAnonLinkMutation(anonId);
  const deleteLink = useDeleteAnonLinkMutation(anonId);

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

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-10">
      <div className="text-center">
        <h1 className="text-foreground text-4xl font-bold sm:text-5xl">
          Shorten your links
        </h1>
        <p className="text-muted mt-2">
          Fast, private, and with built-in analytics.
        </p>
      </div>

      <Card className="w-full p-4 sm:p-6">
        <ShortenUrlForm onSubmit={handleCreate} showCustomSlug />
      </Card>

      <section className="w-full">
        <LinkList
          links={data?.urls ?? []}
          total={data?.total ?? 0}
          page={page}
          onPageChange={setPage}
          onDelete={handleDelete}
          deletingCode={deleteLink.isPending ? deleteLink.variables : undefined}
          isLoading={isLoading}
          anonId={anonId}
          isOwner={false}
        />
      </section>
    </div>
  );
}
