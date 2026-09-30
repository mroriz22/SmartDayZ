import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/product/landing/site";

export const metadata: Metadata = {
  title: "Termos de uso · SmartDayZ",
  description:
    "As regras de uso do SmartDayZ: conta, teste grátis, assinatura, cancelamento e responsabilidades.",
};

const CONTATO = "lab2appz.contato@gmail.com";

export default function TermosPage() {
  return (
    <PaginaLegal titulo="Termos de uso" atualizado="30 de setembro de 2026">
      <section>
        <p>
          Estes termos explicam como funciona o uso do SmartDayZ, a agenda
          inteligente de prioridades mantida pela Lab2AppZ. Ao criar uma conta
          ou usar o app, você concorda com o que está escrito aqui. Se algo não
          fizer sentido para você, é só não usar e falar com a gente.
        </p>
      </section>

      <section>
        <h2>1. O que é o SmartDayZ</h2>
        <p>
          O SmartDayZ ajuda você a organizar tarefas, enxergar urgência e
          importância com a matriz de Eisenhower e montar o dia a partir do seu
          pico de energia. As sugestões de IA são só sugestões: nada muda na sua
          agenda sem a sua confirmação, e a decisão final é sempre sua.
        </p>
      </section>

      <section>
        <h2>2. Sua conta</h2>
        <ul>
          <li>
            Você precisa informar um e-mail válido e manter seus dados de acesso
            em segurança.
          </li>
          <li>A conta é pessoal. Você responde pelo que for feito com ela.</li>
          <li>
            Se perceber qualquer uso que não reconhece, avise pelo {CONTATO}.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Teste grátis, assinatura e pagamento</h2>
        <ul>
          <li>
            Ao criar a conta você ganha um período de teste sem cartão. Os dias
            de teste aparecem na página de planos.
          </li>
          <li>
            Depois do teste, o uso continua com a assinatura do plano descrito
            em <Link href="/pricing">Planos</Link>. O pagamento é processado
            pela Quack (AmploPay). O SmartDayZ não recebe nem guarda o número do
            seu cartão.
          </li>
          <li>
            Preços e condições podem mudar. Qualquer mudança vale só para a
            cobrança seguinte e é avisada antes.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Cancelamento</h2>
        <p>
          Você pode cancelar quando quiser. O acesso segue até o fim do período
          já pago e a assinatura não é renovada. Para pedir ajuda com
          cancelamento ou reembolso, escreva para {CONTATO}. Pedidos de
          arrependimento feitos em até 7 dias da primeira cobrança são atendidos
          conforme o Código de Defesa do Consumidor.
        </p>
      </section>

      <section>
        <h2>5. Uso aceitável</h2>
        <p>Ao usar o SmartDayZ, você se compromete a não:</p>
        <ul>
          <li>tentar acessar contas ou dados de outras pessoas;</li>
          <li>
            sobrecarregar, copiar ou explorar o serviço por meios automatizados
            sem autorização;
          </li>
          <li>usar o app para qualquer atividade ilegal.</li>
        </ul>
        <p>Se essas regras forem quebradas, a conta pode ser suspensa.</p>
      </section>

      <section>
        <h2>6. Seu conteúdo</h2>
        <p>
          Tarefas, agendas e anotações que você cadastra continuam sendo suas. A
          gente só usa esse conteúdo para fazer o app funcionar para você, como
          explicado na <Link href="/privacidade">Política de privacidade</Link>.
        </p>
      </section>

      <section>
        <h2>7. Disponibilidade e responsabilidade</h2>
        <p>
          A gente trabalha para manter o SmartDayZ no ar e seus dados seguros,
          mas o serviço pode ter pausas para manutenção ou falhas fora do nosso
          controle. O app é uma ferramenta de organização: as escolhas sobre o
          seu dia e os resultados delas são seus.
        </p>
      </section>

      <section>
        <h2>8. Mudanças nestes termos</h2>
        <p>
          Quando estes termos mudarem, a data no topo desta página é atualizada.
          Mudanças importantes são avisadas no app ou por e-mail antes de valer.
        </p>
      </section>

      <section>
        <h2>9. Contato</h2>
        <p>
          O SmartDayZ é mantido pela Lab2AppZ. Dúvidas sobre estes termos:{" "}
          <a href={`mailto:${CONTATO}`}>{CONTATO}</a>.
        </p>
      </section>
    </PaginaLegal>
  );
}
