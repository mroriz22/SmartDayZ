// Service worker do SmartDayZ (PWA).
// O app (/app) é um HTML único que já roda offline: fontes embutidas e dados no
// localStorage. Aqui só guardamos a última versão dele para abrir sem rede.
// Regras:
//  - /api/** nunca passa pelo cache (sessão, sync, paywall e IA são sempre ao vivo).
//  - Navegação: rede primeiro; sem rede, a cópia guardada (ou /app como reserva).
//  - Ícones e manifest: cache primeiro.
// Ao mudar a lista abaixo, suba a versão para limpar o cache antigo.
const VERSION = "smartdayz-v2";
const PRECACHE = [
  "/app",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // só guarda o app; as outras páginas dependem do servidor (login, checkout)
          if (res.ok && url.pathname === "/app") {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put("/app", copy));
          }
          return res;
        })
        .catch(() => caches.match("/app"))
    );
    return;
  }

  if (url.pathname.startsWith("/icons/") || url.pathname === "/manifest.webmanifest") {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
});
