import { useI18n } from "../../i18n";

const LEGACY_CODE = `public class CheckoutService {
  public double calculateTotal(Cart cart) {
    double subtotal = 0.0;
    for (Item item : cart.getItems()) {
      subtotal += round2(item.getPrice());
    }
    double tax = subtotal * TAX_RATE;
    return round2(subtotal + tax);
    // rounds twice — legacy bug
  }
}`;

const NEW_CODE = `function calculateTotal(cart: Cart): number {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const total = subtotal * (1 + TAX_RATE);
  return round2(total); // rounds once
}`;

function CodePane({ code, tone }: { code: string; tone: "legacy" | "new" }) {
  const accentColor = tone === "legacy" ? "text-red-400" : "text-emerald-400";
  return (
    <div className="bg-[#0d2438] border border-accent-soft p-4 h-full">
      <div className="flex gap-1.5 mb-3">
        <span className="w-2 h-2 rounded-full bg-zinc-700" />
        <span className="w-2 h-2 rounded-full bg-zinc-700" />
        <span className="w-2 h-2 rounded-full bg-zinc-700" />
      </div>
      <pre className="font-mono text-[11px] sm:text-[12px] leading-relaxed text-[#8fb3cc] overflow-x-auto whitespace-pre">
        {code}
      </pre>
      <div className={`mt-3 font-mono text-[10px] uppercase tracking-wide ${accentColor}`}>
        {tone === "legacy" ? "− rounds twice" : "+ rounds once"}
      </div>
    </div>
  );
}

function LegacyUI() {
  return (
    <div className="bg-[#d4d0c8] border-2 border-[#808080] h-full overflow-hidden" style={{ boxShadow: "inset -2px -2px 0 #404040, inset 2px 2px 0 #fff" }}>
      <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white text-[11px] px-2 py-1 flex items-center justify-between" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
        <span>CheckoutApp v1.2</span>
        <span className="flex gap-1">
          <span className="w-3 h-3 bg-[#d4d0c8] border border-[#404040] inline-block text-center text-black leading-3">_</span>
          <span className="w-3 h-3 bg-[#d4d0c8] border border-[#404040] inline-block text-center text-black leading-3">□</span>
          <span className="w-3 h-3 bg-[#d4d0c8] border border-[#404040] inline-block text-center text-black leading-3">×</span>
        </span>
      </div>
      <div className="p-3" style={{ fontFamily: "Times New Roman, serif" }}>
        <div className="text-[12px] text-black mb-2">Order #4471</div>
        <table className="w-full text-[11px] text-black mb-2 border-collapse">
          <tbody>
            <tr>
              <td className="border border-[#808080] px-1.5 py-0.5 bg-white">Item</td>
              <td className="border border-[#808080] px-1.5 py-0.5 bg-white text-right">Qty</td>
              <td className="border border-[#808080] px-1.5 py-0.5 bg-white text-right">Price</td>
            </tr>
            <tr>
              <td className="border border-[#808080] px-1.5 py-0.5 bg-[#f4f2ee]">Widget</td>
              <td className="border border-[#808080] px-1.5 py-0.5 bg-[#f4f2ee] text-right">2</td>
              <td className="border border-[#808080] px-1.5 py-0.5 bg-[#f4f2ee] text-right">119.90</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between text-[12px] text-black mb-3">
          <span>Total:</span>
          <span className="font-bold">$129.90</span>
        </div>
        <button
          className="bg-[#d4d0c8] border-2 px-4 py-1 text-[11px] text-black"
          style={{ borderColor: "#fff #404040 #404040 #fff" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function NewUI() {
  return (
    <div className="bg-[#0a1b2e] border border-accent-soft h-full p-5 flex flex-col">
      <div className="font-mono text-[10px] uppercase tracking-wide text-[#6fa5c7] mb-3">Order #4471</div>
      <div className="flex-1 space-y-2 mb-4">
        <div className="flex justify-between text-[13px] text-[#dbeaf5] pb-2 border-b border-accent-soft">
          <span>Widget × 2</span>
          <span>$119.90</span>
        </div>
        <div className="flex justify-between text-[13px] text-[#8fb3cc]">
          <span>Tax</span>
          <span>$10.00</span>
        </div>
      </div>
      <div className="flex justify-between items-baseline mb-4">
        <span className="text-[13px] text-[#8fb3cc]">Total</span>
        <span className="font-display text-xl font-bold text-[#f2f8fc]">$129.90</span>
      </div>
      <button className="bg-accent text-[#06131f] font-mono font-semibold text-[12px] px-4 py-2.5 w-full">
        Confirm order
      </button>
    </div>
  );
}

export default function LegacyVsNew() {
  const { t } = useI18n();

  return (
    <section className="px-6 py-28 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-4 tracking-tight leading-tight">
          {t.legacyVsNew.title}
        </h2>
        <p className="text-[#8fb3cc] text-[16px] max-w-xl mx-auto">{t.legacyVsNew.body}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        <div className="text-center font-mono text-[11px] uppercase tracking-[.15em] text-red-400 mb-1">
          {t.legacyVsNew.legacyLabel}
        </div>
        <div className="text-center font-mono text-[11px] uppercase tracking-[.15em] text-emerald-400 mb-1">
          {t.legacyVsNew.newLabel}
        </div>

        <CodePane code={LEGACY_CODE} tone="legacy" />
        <CodePane code={NEW_CODE} tone="new" />

        <LegacyUI />
        <NewUI />
      </div>
    </section>
  );
}
