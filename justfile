# Contrato do farm com o repo (branch factory: Next + pnpm + drizzle).
set positional-arguments

port := env_var_or_default("PORT", "3000")

setup:
    pnpm install --frozen-lockfile
    pnpm db:push

dev:
    pnpm exec next dev --hostname 127.0.0.1 --port {{ port }}

lint:
    pnpm lint

test: lint

format *files:
    pnpm exec prettier --write "$@"
