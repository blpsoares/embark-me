import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Brain,
  Zap,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.22_265_/_0.3),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />

      {/* Floating orbs */}
      <div className="animate-float absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="animate-float absolute bottom-[10%] right-[15%] h-96 w-96 rounded-full bg-accent-500/8 blur-3xl delay-300" style={{ animationDelay: "2s" }} />
      <div className="animate-float absolute left-[60%] top-[60%] h-48 w-48 rounded-full bg-primary-400/10 blur-2xl" style={{ animationDelay: "4s" }} />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-200 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span>Estude de forma inteligente</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl" style={{ animationDelay: "100ms" }}>
            Transforme seus
            <br />
            <span className="bg-gradient-to-r from-accent-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
              estudos em desafios
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-200/70 sm:text-xl" style={{ animationDelay: "200ms" }}>
            Importe seus materiais, estude com flashcards interativos e
            acompanhe sua jornada de aprendizado em tempo real.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: "300ms" }}>
            <Link
              to="/study"
              className="group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-primary-900 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary-500/20"
            >
              <BookOpen className="h-4 w-4" />
              Comece a Estudar
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/notion"
              className="flex items-center gap-2 rounded-2xl border border-primary-400/20 bg-white/5 px-8 py-4 text-sm font-semibold text-primary-100 backdrop-blur-sm transition-all duration-300 hover:border-primary-400/40 hover:bg-white/10"
            >
              Ver Recursos
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up mx-auto mt-16 grid max-w-md grid-cols-3 gap-8" style={{ animationDelay: "400ms" }}>
            {[
              { icon: Brain, label: "Flashcards", value: "Interativos" },
              { icon: Zap, label: "Upload", value: "Instantaneo" },
              { icon: BookOpen, label: "Notion", value: "Integrado" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15">
                  <stat.icon className="h-5 w-5 text-primary-300" />
                </div>
                <div className="text-sm font-bold text-white">{stat.value}</div>
                <div className="text-xs text-primary-300/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
