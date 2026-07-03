import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";

const DRACULA = {
  bg: "#282a36",
  fg: "#f8f8f2",
  comment: "#6272a4",
  keyword: "#ff79c6",
  type: "#8be9fd",
  fn: "#50fa7b",
  number: "#bd93f9",
  string: "#f1fa8c",
};

const KEYWORDS = new Set([
  "public", "class", "double", "for", "return", "function", "const", "new", "void",
]);
const TYPES = new Set(["CheckoutService", "Cart", "Item", "number", "Checkout"]);

function highlightLine(line: string) {
  const commentIdx = line.indexOf("//");
  const codePart = commentIdx === -1 ? line : line.slice(0, commentIdx);
  const commentPart = commentIdx === -1 ? "" : line.slice(commentIdx);
  const tokens = codePart.split(/(\s+|[(){}.,;:+*=>]|"[^"]*")/g).filter((t) => t !== "");

  return (
    <>
      {tokens.map((tok, i) => {
        let color = DRACULA.fg;
        const nextTok = tokens[i + 1];
        if (/^\s+$/.test(tok)) color = DRACULA.fg;
        else if (KEYWORDS.has(tok)) color = DRACULA.keyword;
        else if (TYPES.has(tok)) color = DRACULA.type;
        else if (/^"[^"]*"$/.test(tok)) color = DRACULA.string;
        else if (/^\d+(\.\d+)?$/.test(tok)) color = DRACULA.number;
        else if (/^[(){}.,;:+*=>]$/.test(tok)) color = DRACULA.keyword;
        else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tok) && nextTok === "(") color = DRACULA.fn;
        return (
          <span key={i} style={{ color }}>
            {tok}
          </span>
        );
      })}
      {commentPart && <span style={{ color: DRACULA.comment, fontStyle: "italic" }}>{commentPart}</span>}
    </>
  );
}

const LEGACY_LINES = [
  "public class CheckoutService {",
  "  public double calculateTotal(Cart cart) {",
  "    double subtotal = 0.0;",
  "    for (Item item : cart.getItems()) {",
  "      subtotal += round2(item.getPrice());",
  "    }",
  "    double tax = subtotal * TAX_RATE;",
  "    return round2(subtotal + tax);",
  "    // rounds twice — legacy bug",
  "  }",
  "}",
];

const NEW_LINES = [
  "function calculateTotal(cart: Cart): number {",
  "  const subtotal = cart.items.reduce(",
  "    (sum, item) => sum + item.price,",
  "    0,",
  "  );",
  "  const total = subtotal * (1 + TAX_RATE);",
  "  return round2(total); // rounds once",
  "}",
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

function CodeEditor({
  filename,
  lines,
  badge,
  badgeColor,
}: {
  filename: string;
  lines: string[];
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="shadow-2xl h-full flex flex-col" style={{ backgroundColor: DRACULA.bg }}>
      <div className="flex items-center border-b border-black/30">
        <div className="px-4 py-2.5 text-[12px] font-mono border-r border-black/30" style={{ color: DRACULA.fg, backgroundColor: "#21222c" }}>
          {filename}
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex flex-1 overflow-x-auto">
        <div className="select-none text-right px-3 py-4 font-mono text-[12px] leading-[1.7]" style={{ color: DRACULA.comment }}>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 px-2 py-4 font-mono text-[12px] leading-[1.7] whitespace-pre">
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line) || " "}</div>
          ))}
        </pre>
      </div>
      <div className="px-4 py-2 font-mono text-[10px] uppercase tracking-wide border-t border-black/30" style={{ color: badgeColor, backgroundColor: "#21222c" }}>
        {badge}
      </div>
    </div>
  );
}

function LegacyUI() {
  return (
    <div
      className="w-full h-full bg-[#d4d0c8] border-2 border-[#808080] flex flex-col"
      style={{ boxShadow: "inset -2px -2px 0 #404040, inset 2px 2px 0 #fff" }}
    >
      <div
        className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white text-[13px] px-3 py-1.5 flex items-center justify-between shrink-0"
        style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
      >
        <span>CheckoutApp v1.2</span>
        <span className="flex gap-1">
          <span className="w-4 h-4 bg-[#d4d0c8] border border-[#404040] inline-flex items-center justify-center text-black text-[10px]">_</span>
          <span className="w-4 h-4 bg-[#d4d0c8] border border-[#404040] inline-flex items-center justify-center text-black text-[10px]">□</span>
          <span className="w-4 h-4 bg-[#d4d0c8] border border-[#404040] inline-flex items-center justify-center text-black text-[10px]">×</span>
        </span>
      </div>
      <div className="text-[11px] text-black px-3 py-1 border-b border-[#808080] shrink-0" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
        File &nbsp; Edit &nbsp; View &nbsp; Help
      </div>
      <div className="p-6 flex-1" style={{ fontFamily: "Times New Roman, serif" }}>
        <div className="text-[15px] text-black mb-3">Order #4471</div>
        <table className="w-full text-[14px] text-black mb-3 border-collapse">
          <tbody>
            <tr>
              <td className="border border-[#808080] px-2 py-1.5 bg-white font-bold">Item</td>
              <td className="border border-[#808080] px-2 py-1.5 bg-white font-bold text-right">Qty</td>
              <td className="border border-[#808080] px-2 py-1.5 bg-white font-bold text-right">Price</td>
            </tr>
            <tr>
              <td className="border border-[#808080] px-2 py-1.5 bg-[#f4f2ee]">Widget</td>
              <td className="border border-[#808080] px-2 py-1.5 bg-[#f4f2ee] text-right">2</td>
              <td className="border border-[#808080] px-2 py-1.5 bg-[#f4f2ee] text-right">119.90</td>
            </tr>
            <tr>
              <td className="border border-[#808080] px-2 py-1.5 bg-[#f4f2ee]" colSpan={2}>Tax</td>
              <td className="border border-[#808080] px-2 py-1.5 bg-[#f4f2ee] text-right">10.00</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between text-[16px] text-black mb-4">
          <span>Total:</span>
          <span className="font-bold">$129.90</span>
        </div>
        <button
          className="bg-[#d4d0c8] border-2 px-5 py-1.5 text-[13px] text-black"
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
    <div className="w-full h-full overflow-hidden shadow-2xl flex flex-col" style={{ boxShadow: "0 25px 60px -12px rgba(124,58,237,.35)" }}>
      <div className="bg-[#eceef2] px-4 py-2.5 flex items-center gap-2 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 font-sans">
          checkout.app
        </span>
      </div>
      <div className="bg-white p-7 font-sans flex-1">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase tracking-wide mb-5">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500" />
          Order #4471
        </div>
        <div className="flex justify-between items-center py-3 border-b border-slate-100">
          <div>
            <div className="text-[15px] text-slate-800 font-medium">Widget</div>
            <div className="text-[12px] text-slate-400">Qty 2</div>
          </div>
          <div className="text-[15px] text-slate-700">$119.90</div>
        </div>
        <div className="flex justify-between py-3 text-[14px] text-slate-500">
          <span>Tax</span>
          <span>$10.00</span>
        </div>
        <div className="flex justify-between items-baseline py-3 mb-5">
          <span className="text-[14px] text-slate-500">Total</span>
          <span className="text-3xl font-bold text-slate-900">$129.90</span>
        </div>
        <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-[15px] py-3.5 rounded-lg shadow-lg shadow-violet-600/30">
          Confirm order
        </button>
      </div>
    </div>
  );
}

const REVEAL_RADIUS = 170;

function RevealCompare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  function updatePosition(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (revealRef.current) {
      revealRef.current.style.clipPath = `circle(${REVEAL_RADIUS}px at ${x}px ${y}px)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${x - REVEAL_RADIUS}px, ${y - REVEAL_RADIUS}px)`;
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => updatePosition(e.clientX, e.clientY)}
      onMouseEnter={(e) => {
        setActive(true);
        updatePosition(e.clientX, e.clientY);
      }}
      onMouseLeave={() => setActive(false)}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] cursor-none select-none"
    >
      <div className="absolute inset-0">
        <LegacyUI />
      </div>
      <div
        ref={revealRef}
        className="absolute inset-0 transition-[clip-path] duration-75 ease-out"
        style={{ clipPath: `circle(0px at 50% 50%)` }}
      >
        <NewUI />
      </div>
      <div
        ref={ringRef}
        className={`absolute top-0 left-0 pointer-events-none rounded-full border-2 border-accent transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
        style={{ width: REVEAL_RADIUS * 2, height: REVEAL_RADIUS * 2, boxShadow: "0 0 40px rgba(94,184,255,.4)" }}
      />
      {!active && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <span className="font-mono text-[11px] uppercase tracking-wide text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Hover to reveal the new UI
          </span>
        </div>
      )}
    </div>
  );
}

export default function LegacyVsNew() {
  const { t } = useI18n();
  const [ref, inView] = useInView<HTMLDivElement>();

  const delay = (ms: number) => (inView ? { transitionDelay: `${ms}ms` } : undefined);

  return (
    <section ref={ref} className="px-6 py-28 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold text-[#f2f8fc] mb-4 tracking-tight leading-tight">
          {t.legacyVsNew.title}
        </h2>
        <p className="text-[#8fb3cc] text-[16px] max-w-xl mx-auto">{t.legacyVsNew.body}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-4">
        <div className="text-center font-mono text-[11px] uppercase tracking-[.15em] text-red-400 mb-1">
          {t.legacyVsNew.legacyLabel}
        </div>
        <div className="text-center font-mono text-[11px] uppercase tracking-[.15em] text-emerald-400 mb-1">
          {t.legacyVsNew.newLabel}
        </div>

        <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={delay(0)}>
          <CodeEditor filename="CheckoutService.java" lines={LEGACY_LINES} badge="− rounds twice" badgeColor="#ff5555" />
        </div>
        <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={delay(150)}>
          <CodeEditor filename="checkout.ts" lines={NEW_LINES} badge="+ rounds once" badgeColor="#50fa7b" />
        </div>
      </div>

      <div className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={delay(300)}>
        <RevealCompare />
      </div>
    </section>
  );
}
