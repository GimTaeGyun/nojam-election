import type { MetadataRoute } from "next";
import { REGIONS_META } from "@/data/regions";

const SITE = "https://nojam.vote";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...REGIONS_META.map((r) => ({
      url: `${SITE}/${r.code}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
