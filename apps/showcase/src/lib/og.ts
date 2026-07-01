import type { Metadata } from "next";

// A single /api/og implementation renders every card; each page passes its own
// title and description through this helper to get a matching OG + Twitter image.
export function ogMetadata(title: string, description: string): Metadata {
  const image = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
