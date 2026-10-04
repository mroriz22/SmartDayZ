# saas-template

OS da **fábrica de SaaS** — multi-repo, Next only.

| Peça       | Tech                                |
| ---------- | ----------------------------------- |
| App        | Next.js (App Router)                |
| Auth       | Better Auth                         |
| DB / cache | Postgres + Drizzle · Redis          |
| Billing    | Quack Checkout + trial + paywall    |
| Analytics  | → [`saas-control`](../saas-control) |
| Deploy     | Coolify / VPS BR                    |

## Ideia

```
src/factory/**     ← NÃO toque (trial, paywall, quack, analytics)
src/app/**         ← UI do produto (Lovable cola aqui)
```

Guia de merge: **[LOVABLE.md](./LOVABLE.md)**  
Novo SaaS: **[scripts/new-saas.md](./scripts/new-saas.md)**

## Quick start

```bash
docker compose up -d   # postgres :5435 · redis :6380
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

## Externo → SaaS no ar (agente)

```bash
./scripts/new-saas.sh leadflow "LeadFlow"
cd ../saas-leadflow
pnpm factory:import /path/to/lovable-export   # ou .zip
# agente lê .factory/import-report.md e reescreve auth/billing → @/factory
pnpm factory:smoke
# depois: Quack + Coolify (scripts/ship.md)
```

Skill do agente: `saas-factory` · playbook: `scripts/ship.md` · regras: `AGENTS.md`

Com control plane local:

```bash
# outro terminal — ver saas-control README
cd ../saas-control && pnpm dev
# template .env:
# FACTORY_CONTROL_URL=http://localhost:3100
# FACTORY_INGEST_KEY=dev-ingest-key-change-me
# SAAS_SLUG=saas-template
```

## Fluxo de acesso

```
signup → trial (TRIAL_DAYS)
       → <RequireAccess> libera app
       → trial expira → PaywallScreen → QUACK_CHECKOUT_URL
       → order.paid webhook → status active
       → eventos → saas-control
```

## API fábrica (pro front)

| Endpoint                   |                               |
| -------------------------- | ----------------------------- |
| `GET /api/factory/me`      | session + access snapshot     |
| `POST /api/factory/track`  | analytics (proxy pro control) |
| `POST /api/webhooks/quack` | entrega Quack (HMAC)          |

```ts
import {
  RequireAccess,
  useAccess,
  trackClient,
  factoryConfig,
} from "@/factory";
```

## Variáveis de ambiente

A lista completa está em [`.env.example`](./.env.example), com um comentário por chave dizendo pra que serve e se é obrigatória. Copie com `cp .env.example .env` e preencha; valores reais nunca vão pro git.

| var                                          | obrigatória? | pra que serve                                       |
| -------------------------------------------- | ------------ | --------------------------------------------------- |
| `DATABASE_URL`                               | sim          | Postgres do app, drizzle e `/api/product/setup`     |
| `BETTER_AUTH_URL`                            | sim          | URL pública do app (baseURL do auth)                |
| `BETTER_AUTH_SECRET`                         | sim          | segredo de sessão (`openssl rand -base64 32`)       |
| `QUACK_WEBHOOK_SECRET`                       | em produção  | HMAC do `POST /api/webhooks/quack`                  |
| `QUACK_CHECKOUT_URL`                         | em produção  | CTA do paywall                                      |
| `QUACK_PRODUCT_ID`                           | não          | product ID principal na Quack                       |
| `APP_NAME`                                   | não          | nome exibido no app                                 |
| `SAAS_SLUG`                                  | não          | id estável no admin                                 |
| `NODE_ENV`                                   | não          | ambiente (o Next define sozinho)                    |
| `TRIAL_DAYS`                                 | não          | dias de trial no signup (0 = sem trial)             |
| `PAYWALL_PREFIXES`                           | não          | rotas atrás do paywall                              |
| `NEXT_ALLOWED_DEV_ORIGINS`                   | não          | origens extras no `next dev`                        |
| `SETUP_TOKEN`                                | não          | libera `POST /api/product/setup`; vazio = desligado |
| `REDIS_URL` + `REDIS_PREFIX`                 | não          | Redis compartilhado e prefixo das chaves            |
| `GEMINI_API_KEY` + `AI_MODEL`                | não          | IA em `/api/product/ai`; sem chave = IA desligada   |
| `FACTORY_CONTROL_URL` + `FACTORY_INGEST_KEY` | não          | analytics central (saas-control)                    |
| `BASE` / `E2E_PORT`                          | não          | alvo do smoke `scripts/e2e-smoke.mjs`               |

Agent key Quack **não** entra no runtime do app.
