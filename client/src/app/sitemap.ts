import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://127.0.0.1:43123";
  return ["/", "/about", "/faq", "/pricing", "/terms", "/privacy", "/login", "/signup"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
  }));
}
