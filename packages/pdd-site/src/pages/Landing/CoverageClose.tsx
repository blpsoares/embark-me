import { useI18n } from "../../i18n";

export default function CoverageClose() {
  const { t } = useI18n();

  return (
    <section className="relative bg-[#0a1b2e] border-t border-accent-soft overflow-hidden">
      <div className="absolute inset-0 bg-accent-soft blur-[120px] opacity-40 pointer-events-none" />
      <div className="relative px-6 py-32 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-10 tracking-tight leading-tight">
          {t.coverageClose.title}
        </h2>
        <a
          href="https://github.com/blpsoares/parity-driven-development"
          className="inline-block bg-accent text-[#06131f] font-mono font-semibold text-sm px-7 py-3.5 shadow-[0_0_40px_-6px_#5eb8ff] hover:shadow-[0_0_56px_-6px_#5eb8ff] transition-shadow"
        >
          {t.coverageClose.cta}
        </a>
      </div>
    </section>
  );
}
