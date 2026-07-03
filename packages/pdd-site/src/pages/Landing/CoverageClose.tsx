import { useI18n } from "../../i18n";

export default function CoverageClose() {
  const { t } = useI18n();

  return (
    <section className="relative px-6 py-32 max-w-2xl mx-auto text-center overflow-hidden">
      <div className="absolute inset-0 bg-accent-soft blur-[120px] opacity-40 pointer-events-none" />
      <h2 className="relative text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-zinc-100 mb-10 tracking-tight leading-tight">
        {t.coverageClose.title}
      </h2>
      <a
        href="https://github.com/blpsoares/parity-driven-development"
        className="relative inline-block bg-accent text-black font-semibold text-base px-7 py-3.5 rounded-lg shadow-[0_0_40px_-6px_#34d399] hover:shadow-[0_0_56px_-6px_#34d399] transition-shadow"
      >
        {t.coverageClose.cta}
      </a>
    </section>
  );
}
