import { useI18n } from "../../i18n";

export default function ProblemFraming() {
  const { t } = useI18n();

  return (
    <section id="problem" className="bg-[#0c0d10] border-y border-white/[0.06] scroll-mt-24">
      <div className="px-6 py-28 max-w-3xl mx-auto text-center">
        <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-zinc-100 mb-6 tracking-tight leading-tight">
          {t.problem.title}
        </h2>
        <p className="text-zinc-400 text-[18px] leading-relaxed">{t.problem.body}</p>
      </div>
    </section>
  );
}
