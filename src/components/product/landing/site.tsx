import Link from "next/link";
import { BotaoLink, Logo } from "./lp-ui";

const LINKS = [
  { label: "Recursos", href: "#recursos" },
  { label: "Planos", href: "#planos" },
  { label: "Dúvidas", href: "#duvidas" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="SmartDayZ, início" className="rounded-md focus-visible:outline-2 focus-visible:outline-navy">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-medium text-navy hover:text-orange-text">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/login"
            className="rounded-[8px] px-3 py-2 text-sm font-medium text-body hover:bg-white hover:text-navy"
          >
            Entrar
          </Link>
          <BotaoLink href="/quiz" className="!px-3.5 !py-2 !text-sm whitespace-nowrap">
            <span className="sm:hidden">Começar</span>
            <span className="hidden sm:inline">Começar a organizar</span>
          </BotaoLink>
        </div>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-[13px] font-medium text-navy">
            Agenda inteligente de prioridades
          </span>
          <h1 className="mt-6 text-[48px] font-extrabold leading-[1.02] tracking-[-0.035em] text-navy sm:text-[64px] lg:text-[72px]">
            Seu dia,
            <br />
            com <span className="text-orange">direção</span>.
          </h1>
          <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-body sm:text-xl">
            Organize tarefas, enxergue urgência e importância e receba
            sugestões de IA para planejar sua rotina — com a decisão final
            sempre sua.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotaoLink href="/quiz">Começar a organizar</BotaoLink>
            <BotaoLink href="#como-funciona" variante="secundario">
              Ver como funciona
            </BotaoLink>
          </div>
          <p className="mt-5 text-sm text-soft">Gratuito para começar. Sem cartão.</p>
        </div>

        <div className="relative overflow-hidden rounded-[20px] bg-navy shadow-[0_30px_60px_-30px_rgba(11,26,64,0.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lp/hero.jpg"
            alt="Pessoa com a mão na cabeça diante do notebook, sobrecarregada"
            className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
          />
          <div className="absolute inset-x-3 bottom-3 rounded-[14px] bg-navy p-4 text-white shadow-lg sm:inset-x-4 sm:bottom-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange">
                Dica da IA
              </p>
              <span className="rounded-full bg-orange px-2.5 py-0.5 text-[11px] font-semibold text-navy">
                Fazer agora · 15:00
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">
              A proposta vence amanhã. Vale colocá-la antes da revisão sem prazo?
            </p>
            <p className="mt-3 text-[12px] text-white/65">
              É só uma dica: nada muda na agenda sem você.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Logo claro tamanho="h-6 w-6" />
          <span className="text-sm text-white/70">· Seu dia, com direção.</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-white/85 hover:text-orange">
              {l.label}
            </a>
          ))}
          <Link href="/login" className="text-white/85 hover:text-orange">
            Entrar
          </Link>
        </div>
        <p className="text-sm text-white/70">© {new Date().getFullYear()} SmartDayZ</p>
      </div>
    </footer>
  );
}
