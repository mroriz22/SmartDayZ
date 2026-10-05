# Coolify / production — Next.js standalone
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Placeholders só pro `next build` (runtime usa env do Coolify)
ENV DATABASE_URL=postgres://build:build@127.0.0.1:5432/build
ENV BETTER_AUTH_SECRET=build-time-secret-not-used-in-prod-32
ENV BETTER_AUTH_URL=http://localhost:3000
ENV REDIS_URL=redis://127.0.0.1:6379
# Medição de anúncio (pixel da Meta, tag do Google) e verificação de domínio: o Next grava
# estes valores no HTML na hora do build, não quando o site roda. Sem o ARG aqui, chegam
# vazios no build do Coolify e nada aparece no site, sem erro nenhum. No Coolify, cada uma
# precisa estar marcada como "Build Variable". Vazias = medição desligada.
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_GOOGLE_TAG_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO_CADASTRO
ARG GOOGLE_SITE_VERIFICATION
ARG META_DOMAIN_VERIFICATION
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_PUBLIC_GOOGLE_TAG_ID=$NEXT_PUBLIC_GOOGLE_TAG_ID \
    NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO_CADASTRO=$NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO_CADASTRO \
    GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION \
    META_DOMAIN_VERIFICATION=$META_DOMAIN_VERIFICATION
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
