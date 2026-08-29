import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity/client";

// Validates the `sanity-preview-secret` query param (from a Studio "Open
// preview" link) against a secret document in the dataset, then enables
// Next's draft mode. Requires SANITY_API_TOKEN — never exposed to the client.
export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  }),
});
