import {
  Upload,
  Layers,
  BarChart3,
  BookMarked,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Upload,
    title: "Importe seu Material",
    description:
      "Arraste ou selecione arquivos JSON e CSV com perguntas e respostas para criar seus decks de estudo.",
    gradient: "from-blue-500/10 to-primary-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Layers,
    title: "Flashcards 3D",
    description:
      "Navegue entre cards com animacoes 3D, vire com um clique ou teclado, e embaralhe quando quiser.",
    gradient: "from-primary-500/10 to-violet-500/10",
    iconColor: "text-primary-500",
  },
  {
    icon: BarChart3,
    title: "Planejamento Integrado",
    description:
      "Acompanhe seu progresso e planejamento de estudos diretamente integrado com o Notion.",
    gradient: "from-accent-500/10 to-emerald-500/10",
    iconColor: "text-accent-500",
  },
  {
    icon: BookMarked,
    title: "Recursos Curados",
    description:
      "Acesse uma biblioteca de recursos de estudo organizada e mantida no Notion, sempre atualizada.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-500",
  },
];

export function FeatureGrid() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
            Funcionalidades
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tudo que voce precisa para{" "}
            <span className="text-gradient">estudar melhor</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-500">
            Ferramentas pensadas para tornar seu estudo mais eficiente e prazeroso.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in-up group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} ring-1 ring-slate-100`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
