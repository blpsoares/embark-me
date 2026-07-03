import { useI18n } from "../../i18n";

export default function ProblemFraming() {
  const { t } = useI18n();

  return (
    <section className="px-6 py-20 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">{t.problem.title}</h2>
      <p className="text-zinc-400 text-[15px] leading-relaxed">{t.problem.body}</p>
    </section>
  );
}
