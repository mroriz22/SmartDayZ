"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SuporteWhatsApp } from "@/factory/SuporteWhatsApp";

export function SignOutButton() {
  const router = useRouter();
  return (
    <span className="inline-flex items-center gap-2">
    <SuporteWhatsApp
      produto={"SmartDayZ"}
      variante="menu"
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
    />
    <button
      type="button"
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      Sair
    </button>
    </span>
  );
}
