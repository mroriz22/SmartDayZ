"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { lerRespostas } from "@/lib/product/onboarding";
import { ERRO_WHATSAPP, whatsappValido } from "@/factory/whatsapp";
import { authClient } from "@/lib/auth-client";
import { eventoMedicao, jornada } from "@/lib/medicao";
import { COMO_CONHECEU, guardarResposta } from "@/lib/origem";

/** Traduz o recado técnico do Better Auth pra uma frase que a pessoa entende. */
function recado(bruto: string, modo: "login" | "signup") {
  const t = bruto.toLowerCase();
  if (t.includes("invalid") && t.includes("password")) return "E-mail ou senha não conferem.";
  if (t.includes("invalid email") || t.includes("user not found")) return "E-mail ou senha não conferem.";
  if (t.includes("already") || t.includes("exists")) return "Já existe uma conta com esse e-mail. Tente entrar.";
  if (t.includes("password") && t.includes("short")) return "A senha precisa de pelo menos 8 caracteres.";
  if (t.includes("network") || t.includes("fetch")) return "Não deu pra falar com o servidor. Confira a internet e tente de novo.";
  return modo === "login"
    ? "Não consegui entrar agora. Tente de novo em instantes."
    : "Não consegui criar a conta agora. Tente de novo em instantes.";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  // Opcional de propósito: não trava o cadastro. É o que mostra se grupo, Instagram e busca
  // estão trazendo gente, porque esses caminhos não deixam rastro de anúncio.
  const [comoConheceu, setComoConheceu] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const comecou = useRef(false);

  // Primeiro toque num campo do cadastro: é o degrau "começou o cadastro" da jornada no
  // Lab2AppZ. Quem abre o formulário e não toca em nada desistiu antes dele; quem toca e
  // não termina, desistiu nele (e a jornada mostra em qual campo). Login não conta.
  function aoComecar() {
    if (mode !== "signup" || comecou.current) return;
    comecou.current = true;
    jornada("evento", "cadastro_inicio");
  }
  const id = useId();

  // Vindo do onboarding (/quiz): abre no cadastro e reaproveita nome e e-mail
  // que a pessoa já digitou lá (ficam no aparelho, não na URL).
  // (lido depois da hidratação: localStorage e URL só existem no navegador)
  useEffect(() => {
    const t = setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("modo") === "cadastro") setMode("signup");
      const r = lerRespostas();
      if (r?.email) setEmail((e) => e || r.email || "");
      if (r?.nome) setName((n) => n || r.nome || "");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && !whatsappValido(whatsapp)) {
      setError(ERRO_WHATSAPP);
      jornada("erro", `Cadastro: ${ERRO_WHATSAPP}`);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        // Vai no cookie de origem (lib/origem.ts), que o servidor lê quando a conta nasce.
        guardarResposta(comoConheceu);
        // O WhatsApp vai junto do cadastro e o servidor repassa só pro Lab2AppZ (boas-vindas):
        // não é campo da conta, por isso o tipo do signUp não conhece.
        const res = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
          whatsapp,
        } as Parameters<typeof authClient.signUp.email>[0]);
        if (res.error) throw new Error(res.error.message ?? "signup failed");
        // Conversão que o anúncio persegue. Fica depois do sucesso: conta que falhou não
        // é conversão, e contar errado ensina o anúncio a buscar a pessoa errada.
        eventoMedicao("cadastro");
        // Liga esta jornada à conta, para a compra avisada pelo servidor cair no anúncio
        // certo. É só o id interno, sem nome nem e-mail.
        if (res.data?.user?.id) jornada("conta", res.data.user.id);
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message ?? "login failed");
      }
      router.push("/app");
      router.refresh();
    } catch (err) {
      const frase = recado(err instanceof Error ? err.message : String(err), mode);
      setError(frase);
      // A frase que a pessoa leu, nunca o e-mail: é o que aparece em "Erros que apareceram".
      if (mode === "signup") jornada("erro", `Cadastro: ${frase}`);
    } finally {
      setLoading(false);
    }
  }

  const campo =
    "w-full rounded-btn border border-hairline bg-transparent px-3 py-2.5 text-sm outline-none focus:border-signal";
  const rotulo = "block text-sm font-medium text-ink";

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-1">
        <Link href="/" className="text-sm text-slate hover:text-ink">
          ← voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {mode === "login" ? "Entrar no SmartDayZ" : "Criar sua conta"}
        </h1>
        <p className="text-sm text-slate">
          {mode === "login"
            ? "Sua agenda, a matriz do dia e o aproveitamento do seu pico de energia."
            : "São 7 dias de teste, sem cartão. Depois você decide se continua."}
        </p>
      </div>

      <form onSubmit={onSubmit} onFocus={aoComecar} className="space-y-4" noValidate={false}>
        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className={rotulo} htmlFor={`${id}-nome`}>
              Como quer ser chamada
            </label>
            <input
              id={`${id}-nome`}
              className={campo}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className={rotulo} htmlFor={`${id}-email`}>
            E-mail
          </label>
          <input
            id={`${id}-email`}
            className={campo}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className={rotulo} htmlFor={`${id}-whatsapp`}>
              WhatsApp
            </label>
            <input
              id={`${id}-whatsapp`}
              className={campo}
              type="tel"
              inputMode="tel"
              required
              placeholder="(11) 98765-4321"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              autoComplete="tel"
              aria-describedby={`${id}-whatsapp-dica`}
            />
            <p id={`${id}-whatsapp-dica`} className="text-xs text-slate">
              Pra gente te mandar uma mensagem e ajudar no começo do teste.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className={rotulo} htmlFor={`${id}-senha`}>
            Senha
          </label>
          <div className="relative">
            <input
              id={`${id}-senha`}
              className={`${campo} pr-20`}
              type={verSenha ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              aria-describedby={mode === "signup" ? `${id}-regra` : undefined}
            />
            <button
              type="button"
              onClick={() => setVerSenha(!verSenha)}
              aria-pressed={verSenha}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate hover:text-ink"
            >
              {verSenha ? "ocultar" : "ver"}
            </button>
          </div>
          {mode === "signup" && (
            <p id={`${id}-regra`} className="text-xs text-slate">
              Pelo menos 8 caracteres.
            </p>
          )}
        </div>

        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className={rotulo} htmlFor={`${id}-conheceu`}>
              Como você conheceu o SmartDayZ?{" "}
              <span className="font-normal text-slate">(opcional)</span>
            </label>
            <select
              id={`${id}-conheceu`}
              className={campo}
              value={comoConheceu}
              onChange={(e) => setComoConheceu(e.target.value)}
            >
              <option value="">Escolha uma opção</option>
              {COMO_CONHECEU.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-btn bg-signal/10 px-3 py-2 text-sm text-signal">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-btn bg-signal py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Um instante…" : mode === "login" ? "Entrar" : "Criar conta e começar o teste"}
        </button>
      </form>

      <button
        type="button"
        className="text-sm text-slate hover:text-ink"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setError(null);
        }}
      >
        {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
      </button>
    </main>
  );
}
