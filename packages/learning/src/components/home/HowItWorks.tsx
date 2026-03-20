import { Upload, BookOpen, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: Upload,
    title: "Importe seus arquivos",
    description:
      "Faca upload de um arquivo JSON ou CSV contendo suas perguntas e respostas. O sistema detecta o formato automaticamente.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Estude com flashcards",
    description:
      "Navegue pelos cards com animacoes 3D. Use teclado ou mouse. Embaralhe para testar sua memoria.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Domine o conteudo",
    description:
      "Repita os decks, acompanhe seu progresso no Notion e conquiste seus objetivos de estudo.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-surface-dim py-24 sm:py-32">
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,oklch(0.55_0.22_265_/_0.03),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
            Como funciona
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tres passos para{" "}
            <span className="text-gradient">comecar a estudar</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative mx-auto grid max-w-5xl gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent lg:block" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="animate-fade-in-up relative text-center"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Icon box */}
              <div className="relative mx-auto mb-6">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-600 shadow-md ring-2 ring-primary-100">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
