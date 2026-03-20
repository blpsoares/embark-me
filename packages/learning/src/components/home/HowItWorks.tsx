import { Upload, BookOpen, Trophy } from "lucide-react";
import type { ReactNode } from "react";

interface Step {
  icon: ReactNode;
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: <Upload className="h-6 w-6" />,
    number: "01",
    title: "Importe seu arquivo",
    description: "Arraste um arquivo JSON ou CSV com perguntas e respostas.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    number: "02",
    title: "Estude com flashcards",
    description: "Navegue pelos cards, vire para ver as respostas e embaralhe.",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    number: "03",
    title: "Domine o conteudo",
    description: "Revise quantas vezes quiser ate dominar o assunto.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-100 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 md:text-4xl">
          Como funciona
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-slate-600">
          Tres passos simples para comecar a estudar.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg">
                {step.icon}
              </div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-primary-500">
                Passo {step.number}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
