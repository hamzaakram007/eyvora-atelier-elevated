import { whatsappConfigured, whatsappLink } from "@/lib/site";

export function FloatingAssistant() {
  if (!whatsappConfigured()) return null;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with EYVORA on WhatsApp"
      className="fixed right-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 flex items-center gap-3 border border-border bg-background px-4 py-3 shadow-sm transition-colors hover:bg-[var(--ink)] hover:text-[var(--ivory)] sm:right-6 lg:bottom-6"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-[0.65rem] font-medium tracking-[0.08em] text-white">
        WA
      </span>
      <span className="hidden text-[0.625rem] tracking-[0.24em] uppercase sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
