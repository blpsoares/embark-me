import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, BookMarked, ArrowRight } from "lucide-react";
import { useTypewriter } from "../../hooks/useTypewriter";

const phrases = [
  "O que vamos estudar hoje?",
  "Pronto pra mais um desafio?",
  "Bora dominar mais um assunto?",
  "Qual o proximo topico?",
  "Mais um dia de evolucao!",
  "Vamos conquistar mais conhecimento?",
  "Foco total nos estudos!",
  "Cada dia mais perto do objetivo.",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  if (hour >= 18) return "Boa noite";
  return "Boa madrugada";
}

const quickActions = [
  {
    to: "/study",
    icon: BookOpen,
    label: "Estudar",
    description: "Flashcards interativos",
    gradient: "from-primary-500 to-primary-700",
    shadow: "shadow-primary-500/20",
  },
  {
    to: "/notion",
    icon: BookMarked,
    label: "Recursos",
    description: "Material de estudo",
    gradient: "from-accent-500 to-accent-600",
    shadow: "shadow-accent-500/20",
  },
  {
    to: "/planing",
    icon: CalendarDays,
    label: "Planejamento",
    description: "Progresso e metas",
    gradient: "from-violet-500 to-violet-700",
    shadow: "shadow-violet-500/20",
  },
];

export function Hero() {
  const { text } = useTypewriter(phrases);
  const greeting = getGreeting();

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.22_265_/_0.3),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />

      {/* Floating orbs */}
      <div className="animate-float absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="animate-float absolute bottom-[10%] right-[15%] h-96 w-96 rounded-full bg-accent-500/8 blur-3xl" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-32 lg:pt-28">
        {/* Greeting */}
        <div className="animate-fade-in-up mb-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-accent-400 to-primary-300 bg-clip-text text-transparent">
              Bryan
            </span>
          </h1>
        </div>

        {/* Typewriter */}
        <div className="animate-fade-in-up mb-14 min-h-[2.5rem] sm:min-h-[3rem]" style={{ animationDelay: "150ms" }}>
          <p className="typewriter-cursor text-xl text-primary-200/60 sm:text-2xl lg:text-3xl">
            {text}
          </p>
        </div>

        {/* Quick actions */}
        <div className="animate-fade-in-up grid gap-4 sm:grid-cols-3" style={{ animationDelay: "300ms" }}>
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg ${action.shadow}`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm font-bold text-white">
                  {action.label}
                  <ArrowRight className="h-3.5 w-3.5 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/70" />
                </div>
                <p className="text-xs text-primary-300/50">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
