import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { analytics } from "@/factory/analytics";
import { startTrial } from "@/factory/billing";
import { db, schema } from "./db";
import { origemDoCabecalho } from "./origem";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db(), {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          try {
            const ent = await startTrial(user.id);
            // De onde a pessoa veio (cookie de primeiro toque, lib/origem.ts), junto com a
            // resposta opcional de "Como você conheceu". Vai pro painel da fábrica com o
            // cadastro. Sem cookie, segue como antes.
            const origem = origemDoCabecalho(
              context?.headers?.get("cookie") ?? context?.request?.headers.get("cookie"),
            );
            void analytics.signedUp(user.id, { source: "signup", ...(origem ? { origem } : {}) });
            if (ent?.trialEndsAt) {
              void analytics.trialStarted(user.id, ent.trialEndsAt);
            }
          } catch {
            // não bloqueia signup se trial falhar
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
