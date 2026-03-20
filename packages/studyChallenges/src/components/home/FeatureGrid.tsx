import { Upload, Layers, BarChart3, BookMarked } from "lucide-react";
import type { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Upload className="h-7 w-7 text-primary-500" />,
    title: "Importe seu Material",
    description: "Carregue arquivos JSON ou CSV com suas perguntas e respostas em segundos.",
  },
  {
    icon: <Layers className="h-7 w-7 text-primary-500" />,
    title: "Flashcards Interativos",
    description: "Vire os cards para revelar respostas e navegue no seu ritmo.",
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-primary-500" />,
    title: "Acompanhe seu Progresso",
    description: "Veja quantos cards ja revisou e navegue pela sua sessao de estudo.",
  },
  {
    icon: <BookMarked className="h-7 w-7 text-primary-500" />,
    title: "Recursos do Notion",
    description: "Acesse materiais de estudo curados diretamente no app.",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-slate-900 md:text-4xl">
          Tudo que voce precisa para estudar
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
          Ferramentas simples e poderosas para turbinar seus estudos.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
