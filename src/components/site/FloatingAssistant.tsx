import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, ArrowUp } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type Msg = { from: "eyvora" | "you"; text: string };

const presets: Array<{ q: string; a: string }> = [
  {
    q: "Where is my order?",
    a: "Share your order number and I'll trace it with our courier. Every EYVORA order ships with live tracking, sent to your email the moment it leaves the atelier.",
  },
  {
    q: "Exchange policy",
    a: "Unworn pieces with tags can be exchanged within 7 days. Size exchanges inside Pakistan are collected and redelivered at our cost — no forms, just a message.",
  },
  {
    q: "Delivery time",
    a: "Karachi, Lahore and Islamabad: 1–2 working days. Rest of Pakistan: 3–5. International express: 4–8 working days, fully tracked.",
  },
  {
    q: "How do sizes fit?",
    a: "Hoodies are cut relaxed with a dropped shoulder — take your usual size, or size down for a cleaner line. Trousers sit at the natural waist with a straight leg.",
  },
  {
    q: "Material information",
    a: "380–420 GSM long-staple loop-back cotton for hoodies; a mid-weight cotton-blend twill with four-way give for trousers. Pre-shrunk, enzyme-washed, garment-dyed.",
  },
  {
    q: "Recommend my size",
    a: "Tell me your height, weight and preferred fit and I'll give you a size within a minute. Our styling desk answers personally on WhatsApp for full fittings.",
  },
  {
    q: "How do I wash it?",
    a: "Cold machine wash inside out, no bleach, dry flat in shade, warm iron on the reverse. The cotton softens with each wash — that's intentional.",
  },
];

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "eyvora",
      text: "Welcome to EYVORA. I'm your client advisor — ask about sizing, fabric, delivery or an existing order.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const reply = (question: string) => {
    const match = presets.find(
      (p) =>
        p.q.toLowerCase() === question.toLowerCase() ||
        question.toLowerCase().includes((p.q.split(" ")[0] ?? "").toLowerCase()),
    );
    setMessages((m) => [
      ...m,
      { from: "you", text: question },
      {
        from: "eyvora",
        text:
          match?.a ??
          "Our styling desk will answer this personally. Continue on WhatsApp and a advisor will reply within minutes during store hours.",
      },
    ]);
  };

  return (
    <>
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Message EYVORA on WhatsApp"
          className="group flex items-center gap-3 border border-border bg-background/90 px-4 py-3 backdrop-blur-xl transition-all duration-500 hover:bg-[var(--ink)] hover:text-[var(--ivory)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.17 8.17 0 0 1-1.25-4.35c0-4.53 3.7-8.22 8.24-8.22 2.2 0 4.27.86 5.83 2.41a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.24 8.21z" />
          </svg>
          <span className="text-[0.625rem] tracking-[0.26em] uppercase">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close client advisor" : "Open client advisor"}
          className="flex items-center gap-3 bg-[var(--ink)] px-5 py-4 text-[var(--ivory)] transition-transform duration-500 hover:-translate-y-0.5"
        >
          {open ? (
            <X className="h-4 w-4" strokeWidth={1.2} />
          ) : (
            <MessageSquare className="h-4 w-4" strokeWidth={1.2} />
          )}
          <span className="text-[0.625rem] tracking-[0.26em] uppercase">
            {open ? "Close" : "Client Advisor"}
          </span>
        </button>
      </div>

      <div
        className={cn(
          "fixed right-4 bottom-28 z-40 flex w-[min(23rem,calc(100vw-2rem))] flex-col border border-border bg-background/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:right-6 sm:bottom-32",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        <div className="border-b border-border px-5 py-4">
          <p className="font-display text-base tracking-[0.3em]">EYVORA</p>
          <p className="mt-1 text-[0.625rem] tracking-[0.24em] text-muted-foreground uppercase">
            Client advisory · Mon–Sat, 11–20 PKT
          </p>
        </div>

        <div ref={scrollRef} className="max-h-72 flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <p
              key={i}
              className={cn(
                "max-w-[85%] text-sm leading-relaxed",
                m.from === "you"
                  ? "ml-auto bg-[var(--ink)] px-4 py-2.5 text-[var(--ivory)]"
                  : "text-foreground",
              )}
            >
              {m.text}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
          {presets.slice(0, 4).map((p) => (
            <button
              key={p.q}
              type="button"
              onClick={() => reply(p.q)}
              className="border border-border px-3 py-1.5 text-[0.625rem] tracking-[0.16em] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)]"
            >
              {p.q}
            </button>
          ))}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="border border-[var(--gold)] px-3 py-1.5 text-[0.625rem] tracking-[0.16em] text-[var(--gold)] uppercase"
          >
            Talk to support
          </a>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            reply(input.trim());
            setInput("");
          }}
          className="flex items-center gap-3 border-t border-border px-5 py-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message"
            aria-label="Message"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <button type="submit" aria-label="Send" className="text-muted-foreground hover:text-foreground">
            <ArrowUp className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </form>
      </div>
    </>
  );
}
