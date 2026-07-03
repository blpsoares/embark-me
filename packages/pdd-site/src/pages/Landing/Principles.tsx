import { useI18n } from "../../i18n";

export default function Principles() {
  const { t } = useI18n();

  return (
    <section className="px-6 py-28 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-zinc-100 mb-4 tracking-tight leading-tight">
          {t.principles.title}
        </h2>
        <p className="text-zinc-500 text-[16px] max-w-xl mx-auto">{t.principles.body}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
        {t.principles.items.map((item, i) => (
          <div key={item} className="bg-black p-6 flex gap-4">
            <span className="text-accent font-mono text-sm shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-zinc-300 text-[14.5px] leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
