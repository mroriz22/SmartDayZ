import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/product/landing/site";

export const metadata: Metadata = {
  title: "Política de privacidade · SmartDayZ",
  description:
    "Que dados o SmartDayZ guarda, para quê, por quanto tempo, com quem compartilha e como exercer seus direitos pela LGPD.",
};

const CONTATO = "lab2appz.contato@gmail.com";

export default function PrivacidadePage() {
  return (
    <PaginaLegal
      titulo="Política de privacidade"
      atualizado="4 de outubro de 2026"
    >
      <section>
        <p>
          Esta política explica como o SmartDayZ, mantido pela Lab2AppZ, trata
          os seus dados pessoais, seguindo a Lei Geral de Proteção de Dados (Lei
          13.709/2018, a LGPD). A Lab2AppZ é a controladora dos dados e responde
          por eles pelo contato <a href={`mailto:${CONTATO}`}>{CONTATO}</a>.
        </p>
      </section>

      <section>
        <h2>1. Que dados guardamos</h2>
        <ul>
          <li>
            <strong>Conta:</strong> nome, e-mail, senha protegida por
            criptografia e os registros de sessão (data de acesso, endereço IP e
            navegador).
          </li>
          <li>
            <strong>Uso do app:</strong> tarefas, agendas, pico de energia,
            respostas do questionário inicial e as preferências que você salva,
            além de eventos simples de uso (por exemplo, que uma tela foi
            aberta).
          </li>
          <li>
            <strong>Pagamento, quando houver:</strong> status da assinatura,
            plano e datas de cobrança, informados pela Quack (AmploPay). Os
            dados do cartão ficam com o processador de pagamento e nunca passam
            pelo SmartDayZ.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Para que usamos</h2>
        <ul>
          <li>
            Criar e manter sua conta e deixar sua agenda sincronizada entre
            aparelhos (execução do contrato).
          </li>
          <li>
            Liberar o teste grátis e a assinatura e cuidar da cobrança (execução
            do contrato).
          </li>
          <li>
            Gerar as sugestões de IA que você pede, com base nas tarefas do dia
            (execução do contrato).
          </li>
          <li>
            Entender o uso do app para corrigir erros e melhorar o produto
            (legítimo interesse).
          </li>
          <li>
            Saber quais anúncios e canais trazem gente para o SmartDayZ
            (legítimo interesse).
          </li>
          <li>
            Responder seus pedidos de suporte e cumprir obrigações legais, como
            guardar registros fiscais.
          </li>
        </ul>
        <p>
          Não vendemos seus dados e não usamos o conteúdo das suas tarefas para
          publicidade.
        </p>
      </section>

      <section>
        <h2>3. Por quanto tempo</h2>
        <ul>
          <li>
            Dados da conta e da agenda: enquanto a conta existir. Ao apagar a
            conta, são removidos em até 30 dias.
          </li>
          <li>
            Registros de acesso: 6 meses, como pede o Marco Civil da Internet.
          </li>
          <li>
            Registros de pagamento: pelo prazo exigido pela legislação fiscal,
            em geral 5 anos.
          </li>
          <li>
            Cópias de segurança são sobrescritas no ciclo normal de backup.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Com quem compartilhamos</h2>
        <p>
          Só com os serviços necessários para o SmartDayZ funcionar e com os
          que medem os nossos anúncios:
        </p>
        <ul>
          <li>
            <strong>Hospedagem:</strong> os servidores e o banco de dados onde o
            app e a sua agenda ficam guardados.
          </li>
          <li>
            <strong>E-mail:</strong> o serviço que envia mensagens de acesso,
            avisos da conta e respostas de suporte.
          </li>
          <li>
            <strong>Pagamento:</strong> a Quack (AmploPay), que processa a
            assinatura quando você assina.
          </li>
          <li>
            <strong>IA:</strong> quando você pede uma sugestão, o texto das
            tarefas envolvidas é enviado ao provedor de IA (Google Gemini) só
            para gerar a resposta.
          </li>
          <li>
            <strong>Medição de anúncios:</strong> a Meta (Facebook e Instagram)
            e o Google recebem que houve uma visita a uma página pública, um
            cadastro ou um clique para assinar. Nunca recebem suas tarefas nem
            sua agenda.
          </li>
        </ul>
        <p>
          Também podemos compartilhar dados quando uma autoridade exigir por
          lei. Alguns desses serviços podem guardar dados fora do Brasil, sempre
          com as garantias previstas na LGPD.
        </p>
      </section>

      <section>
        <h2>5. Seus direitos</h2>
        <p>Pela LGPD, você pode pedir a qualquer momento:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos ou desatualizados;</li>
          <li>exportação dos seus dados em formato aberto (portabilidade);</li>
          <li>
            exclusão da conta e dos dados, salvo o que a lei obriga a guardar;
          </li>
          <li>
            informação sobre com quem compartilhamos e revogação do
            consentimento, quando ele for a base.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Como pedir</h2>
        <p>
          Escreva para <a href={`mailto:${CONTATO}`}>{CONTATO}</a> a partir do
          e-mail da sua conta, dizendo o que precisa. A gente responde em até 15
          dias. Se não ficar satisfeito com a resposta, você também pode
          procurar a Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </section>

      <section>
        <h2>7. Segurança e cookies</h2>
        <p>
          O acesso ao app usa conexão criptografada (HTTPS) e senhas guardadas
          com criptografia. O app instalado no celular guarda uma cópia da
          agenda no próprio aparelho para funcionar sem internet.
        </p>
        <p>
          Além dos cookies necessários para manter você conectado, as páginas
          públicas (apresentação, planos, termos, esta política, questionário
          inicial e login) e o cadastro usam cookies de medição da Meta e do
          Google. Eles servem para sabermos quais anúncios e canais trazem gente
          que realmente usa o SmartDayZ, e não são usados para montar perfil de
          consumo seu. Dentro do app, as telas que você abre não são enviadas:
          a Meta e o Google só ficam sabendo que uma conta foi criada ou que
          alguém clicou para assinar. Você pode bloquear essa medição no seu
          navegador ou com um bloqueador de anúncios, sem perder nada do app.
        </p>
      </section>

      <section>
        <h2>8. Mudanças nesta política</h2>
        <p>
          Quando esta política mudar, a data no topo é atualizada e mudanças
          importantes são avisadas no app ou por e-mail. O uso do SmartDayZ
          também segue os <Link href="/termos">Termos de uso</Link>.
        </p>
      </section>
    </PaginaLegal>
  );
}
