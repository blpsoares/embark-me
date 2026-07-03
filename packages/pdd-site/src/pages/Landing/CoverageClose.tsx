import { useI18n } from "../../i18n";

export default function CoverageClose() {
  const { t } = useI18n();

  return (
    <section className="px-6 py-24 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-8">{t.coverageClose.title}</h2>
      <a
        href="https://github.com/blpsoares/parity-driven-development"
        className="inline-block bg-accent text-black font-semibold text-sm px-5 py-2.5 rounded-md shadow-[0_0_24px_-4px_#34d399]"
      >
        {t.coverageClose.cta}
      </a>
    </section>
  );
}
