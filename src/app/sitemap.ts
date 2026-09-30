import type { MetadataRoute } from "next";

/** Domínio de produção fixo: o sitemap nunca pode sair com localhost. */
const SITE_URL = "https://smartdayz.com";

const PAGINAS_PUBLICAS = [
  { path: "/", priority: 1 },
  { path: "/pricing", priority: 0.8 },
  { path: "/quiz", priority: 0.7 },
  { path: "/termos", priority: 0.3 },
  { path: "/privacidade", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGINAS_PUBLICAS.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
