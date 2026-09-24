import type { Metadata } from "next";
import { factoryConfig } from "@/factory/config";
import { OnboardingFlow } from "@/components/product/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Monte seu primeiro dia — SmartDayZ",
  description:
    "Quatro passos curtos: seu horário, seu contexto e a primeira tarefa na matriz. Sem cartão.",
  robots: { index: true },
};

export default function QuizPage() {
  return <OnboardingFlow trialDias={factoryConfig.trialDays} />;
}
