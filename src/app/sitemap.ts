import { MetadataRoute } from "next";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jhxt-itsolutions.ph";

  const serviceUrls = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const routes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/managed-services",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  return [...routes, ...serviceUrls];
}
