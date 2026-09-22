import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // O Next 16 bloqueia os recursos de dev (/_next/*, HMR) para qualquer host
  // que não seja localhost. Sem isso, um preview aberto por outro endereço
  // (a tailnet do farm, por exemplo) mostra o HTML mas nunca hidrata: nenhum
  // botão funciona. Lista separada por vírgula; só vale no `next dev`.
  allowedDevOrigins: process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
    .map((h) => h.trim())
    .filter(Boolean),
  // "/" é a landing (src/app/page.tsx). O produto, a agenda de arquivo
  // único, é servido em /app. O paywall e a sincronização continuam
  // checados no servidor, nas rotas /api.
  async rewrites() {
    return [{ source: "/app", destination: "/agenda.html" }];
  },
};

export default nextConfig;
