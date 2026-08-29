import { createClient, type QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

// ponytail: "placeholder-project" keeps createClient() from throwing when
// env vars are absent (no .env.local yet). A real fetch against it still
// fails at request time with a normal network/auth error — never at build.
export const sanityClient = createClient({
  projectId: projectId ?? "placeholder-project",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

// Server-token client for draft mode: reads drafts, never cached.
const previewClient = sanityClient.withConfig({
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "drafts",
});

/**
 * Perspective- and cache-aware fetch for server components/route handlers.
 * - Draft mode enabled (editor preview): reads drafts with the server
 *   token, `no-store` so nothing is cached.
 * - Draft mode disabled (normal visitors): reads published content through
 *   the CDN, tagged so `/api/revalidate` can invalidate just what changed.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  const { isEnabled: preview } = await draftMode();

  if (preview) {
    return previewClient.fetch<T>(query, params, { cache: "no-store" });
  }

  return sanityClient.fetch<T>(query, params, { next: { tags } });
}
