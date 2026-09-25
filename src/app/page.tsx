import { factoryConfig } from "@/factory/config";
import { Hero, SiteFooter, SiteNav } from "@/components/product/landing/site";
import { ComoFunciona } from "@/components/product/landing/como-funciona";
import {
  ChamadaFinal,
  Duvidas,
  Planos,
  Recursos,
} from "@/components/product/landing/secoes";

/** Landing do SmartDayZ — design de 23/09/2026 (desvios em DESVIOS-LP-ONBOARDING.md). */
export default function HomePage() {
  return (
    <div className="font-display flex flex-1 flex-col bg-canvas text-navy">
      <SiteNav />
      <main className="flex flex-col">
        <Hero />
        <ComoFunciona />
        <Recursos />
        <Planos trialDias={factoryConfig.trialDays} />
        <Duvidas />
        <ChamadaFinal />
      </main>
      <SiteFooter />
    </div>
  );
}
