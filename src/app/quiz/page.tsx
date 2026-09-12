import type { Metadata } from "next";
import { QuizFlow } from "@/components/product/quiz-flow";

export const metadata: Metadata = {
  title: "Quiz — SmartDayZ",
  description:
    "4 perguntas sobre a sua agenda. Sem cadastro. No fim você entra no teste de 7 dias.",
  robots: { index: true },
};

export default function QuizPage() {
  return <QuizFlow />;
}
