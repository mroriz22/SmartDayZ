import Link from "next/link";

/** Peças pequenas da landing e do onboarding (design de 23/09/2026). */

export function Logo({
  claro = false,
  tamanho = "h-7 w-7",
  comNome = true,
}: {
  claro?: boolean;
  tamanho?: string;
  comNome?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icon.svg"
        alt=""
        className={`${tamanho} ${claro ? "brightness-0 invert" : ""}`}
      />
      {comNome ? (
        <span
          className={`text-[17px] font-bold tracking-[-0.01em] ${claro ? "text-white" : "text-navy"}`}
        >
          SmartDayZ
        </span>
      ) : null}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-orange-text">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 max-w-[24ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-navy sm:text-[40px]">
      {children}
    </h2>
  );
}

const base =
  "inline-flex items-center justify-center rounded-[10px] px-5 py-3 text-[15px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

export const botao = {
  primario: `${base} bg-orange text-navy shadow-[0_6px_16px_-6px_rgba(251,121,21,0.7)] hover:brightness-105 active:brightness-95`,
  secundario: `${base} border border-line bg-white text-navy hover:border-navy/30 hover:bg-canvas`,
  escuro: `${base} bg-navy text-white hover:bg-navy-soft`,
};

export function BotaoLink({
  href,
  variante = "primario",
  className = "",
  children,
}: {
  href: string;
  variante?: keyof typeof botao;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${botao[variante]} ${className}`}>
      {children}
    </Link>
  );
}

export function Check({ className = "text-orange" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`mt-[3px] h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}
