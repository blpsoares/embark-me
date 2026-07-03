import { useI18n } from "../../i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative px-6 pt-24 pb-20 max-w-3xl mx-auto text-center overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent-soft rounded-full blur-3xl pointer-events-none" />
      <div className="relative text-xs uppercase tracking-[.3em] text-accent font-semibold">
        {t.hero.eyebrow}
      </div>
      <h1 className="relative text-4xl md:text-5xl font-bold mt-4 mb-8 text-zinc-50 tracking-tight leading-tight">
        {t.hero.headline}
      </h1>
      <a
        href="#pipeline"
        className="relative inline-block bg-accent text-black font-semibold text-sm px-5 py-2.5 rounded-md shadow-[0_0_24px_-4px_#34d399]"
      >
        {t.hero.cta} ↓
      </a>
    </section>
  );
}
