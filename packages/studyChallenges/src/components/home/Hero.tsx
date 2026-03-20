import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-4 py-20 text-white md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Estude de forma inteligente
        </div>
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Domine qualquer assunto com{" "}
          <span className="text-primary-200">Flashcards Interativos</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
          Importe suas perguntas e respostas via JSON ou CSV e estude com cards
          interativos. Simples, rapido e eficiente.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/study"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Comece a Estudar
          </Link>
          <Link
            to="/notion"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
          >
            Ver Recursos
          </Link>
        </div>
      </div>
    </section>
  );
}
