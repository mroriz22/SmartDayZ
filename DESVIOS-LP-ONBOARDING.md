# Desvios do design — Landing e Onboarding

Data: 23/09/2026 · Branch `design-lp-onboarding`

Fonte: `SmartDayZ landing page design.pdf` e `SmartDayZ onboarding design.pdf`.
Layout, cores (marinho `#0b1a40`, laranja `#fb7915`, fundo `#f6f7f9`), tipografia
(Inter) e a copy foram seguidos. Abaixo, onde o design dizia algo que o produto não faz,
e o que ficou no lugar. Regra: vale o que o app (`public/agenda.html`) faz hoje.

## Preço
- **Pro a R$ 19,90/mês (design) → R$ 14,90/mês.** Preço oficial desde o commit `c06dc20`
  (pricing, paywall e painel do app). Landing e tela 7/7 mostram R$ 14,90 e os 7 dias de
  teste sem cartão.

## Nomes dos quadrantes
- Design: *Fazer agora, Planejar, Delegar ou negociar, Reavaliar*.
  App: *Fazer agora, Foco / Agendar, Delegar, Eliminar* (`const QUAD` em agenda.html).
  Landing e onboarding usam os nomes do app (`src/lib/product/matriz.ts`), para a pessoa
  achar na agenda o que viu na venda. **Decisão pendente:** se quiserem os nomes do design,
  é trocar 3 strings no `QUAD` do agenda.html e em `matriz.ts`.
- A frase "Em lista no celular" virou "No celular vira uma coluna só" — é o que o app faz
  (grid de 1 coluna abaixo de 760px).

## Pico de energia
- O app tem pico fixo **15h–22h** para todo mundo (`PEAK_START/PEAK_END`). O design
  sugere "Tarde 11h–15h" e promete "Vamos proteger esse horário… Dá para ajustar depois".
- A pergunta "Quando você rende melhor?" ficou (com as 4 opções literais) e a resposta é
  guardada, mas o texto de apoio diz a verdade: hoje o pico é 15h–22h para todo mundo. O
  selo "Sugerido" virou "Pico do app" e está em Tarde/Noite (15h–22h).
- Tela 6/7 e card da landing usam o pico 15h–22h (tarefas às 15:00, 17:00…).

## IA
- O app não tem sugestão com **Aceitar / Editar / Recusar / desfazer**. A IA (Pro) escreve
  a resposta de uma tarefa travada e dá uma "Dica da IA" no relatório; não mexe na agenda.
- Hero: o card virou "Dica da IA" sem os três botões, com "É só uma dica: nada muda na
  agenda sem você."
- "Como funciona" e tela 6/7: o bloco se chama "Sugestão" (é regra da matriz, não IA) e
  termina em "Você decide o que muda" em vez de "aceitar, editar ou recusar".
- Recurso "Sugestões de IA" reescrito com o que a IA faz de fato, marcado como Pro.
- Tela 6/7: "se um compromisso aparecer, eu aviso" → "se o dia mudar, é só arrastar na
  agenda" (o app não manda aviso).

## Contextos
- Design: Pessoal / Trabalho / **Projeto**. O app só cria agendas predefinidas
  (Pessoal, Estudos, Trabalho, Meta Principal) — não existe "Projeto".
  Ficou **Meta Principal** (sigla M), com a descrição do design ("Uma meta específica com
  prazo próprio"), que é o que essa agenda é.

## Planos
- Pro ganhou a linha "IA na tarefa travada e sincronia entre aparelhos" (está no Pro de
  verdade e o design omitia). "Relatório semanal do pico" → "Relatório do pico de energia:
  dia, semana e 30 dias" (o relatório tem as três faixas).
- "Cancele quando quiser, nas configurações" → "direto na sua conta" (mesma frase do /pricing).

## Dúvidas
- O PDF só traz a resposta da primeira pergunta. As outras quatro foram escritas a partir
  do comportamento do app (IA não decide, pico 15h–22h, arrastar tarefa / prazo ≤ 2 dias
  vira urgente, cancelamento e teste).

## Rodapé
- "Privacidade" e "Termos" saíram: essas páginas não existem. No lugar, "Entrar".
  Quando existirem, é só voltar os links em `src/components/product/landing/site.tsx`.

## Onboarding — navegação
- O design não mostra botão de avançar. Entrou um rodapé **Voltar / Continuar** em todas as
  telas (sem ele não há como sair das telas de nome/e-mail e de tarefas).
- A tela 8 do PDF (em branco, barra cheia) virou o estado "Abrindo sua agenda…".
- Passos 4 e 5 ficaram interativos: marcar urgente/importante mostra o quadrante na hora.

## O que o onboarding grava (novo)
- Respostas em `localStorage["smartdayz:onboarding"]`; o /login lê nome e e-mail dali
  (nada de dado pessoal na URL) e abre direto no cadastro com `?modo=cadastro`.
- Se o aparelho ainda não tem agenda, o dia montado vira a agenda real (`agenda.v3`, no
  contexto escolhido). Grava com `updatedAt: 0`, então uma agenda que já exista na nuvem
  sempre vence — o onboarding nunca sobrescreve dado.
- "Começar grátis" → `/app` (plano gratuito, local). "Experimentar o Pro" → cadastro
  (trial de 7 dias no signup). Evento `onboarding_concluido` vai pro control plane.

## Outros
- As fotos do hero e do CTA final foram extraídas do PDF (`public/lp/`). Confirmar a
  licença delas antes de publicar.
- A pasta dos componentes da landing mudou de `components/product/marketing` para
  `components/product/landing`: o `.gitignore` tem `marketing/` (documentos do Drive), que
  fazia o git e o Tailwind ignorarem os arquivos novos.
