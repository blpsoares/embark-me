import { useI18n } from "../../i18n";

const TIER_COLOR = ["text-red-400", "text-yellow-400", "text-fuchsia-400", "text-accent"];
const TIER_BORDER = ["border-red-400/30", "border-yellow-400/30", "border-fuchsia-400/30", "border-accent-soft"];

export default function ConfidenceTiers() {
  const { t } = useI18n();

  return (
    <section id="tiers" className="bg-[#0c0d10] border-y border-white/[0.06] scroll-mt-24">
      <div className="px-6 py-28 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-zinc-100 mb-4 tracking-tight leading-tight">
            {t.tiers.title}
          </h2>
          <p className="text-zinc-500 text-[16px] max-w-xl mx-auto">{t.tiers.body}</p>
        </div>
        <div className="font-mono border-y border-zinc-800 divide-y divide-zinc-900">
          {t.tiers.rows.map((row, i) => (
            <div key={row.tier} className="flex items-center gap-4 py-4">
              <span className={`w-16 shrink-0 font-semibold ${TIER_COLOR[i]}`}>{row.tier}</span>
              <span className="flex-1 text-zinc-400 text-[14px]">{row.evidence}</span>
              <span className={`shrink-0 border rounded-full px-3 py-1 text-[11px] uppercase tracking-wide ${TIER_COLOR[i]} ${TIER_BORDER[i]}`}>
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
