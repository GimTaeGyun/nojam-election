import type { MetadataRoute } from "next";
import { REGIONS_META } from "@/data/regions";

const SITE = "https://nojam.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/stats/parties`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/stats/wealth`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/stats/mayors`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/stats/councilors`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/stats/local-councilors`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...REGIONS_META.map((r) => ({
      url: `${SITE}/${r.code}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
