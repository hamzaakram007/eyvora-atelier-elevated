import { whatsappConfigured, whatsappLink } from "@/lib/site";

export function FloatingAssistant() {
  if (!whatsappConfigured()) return null;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with EYVORA on WhatsApp"
      className="fixed right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-105 sm:right-6 sm:bottom-6 sm:h-auto sm:w-auto sm:flex sm:items-center sm:gap-3 sm:rounded-none sm:border sm:border-border sm:bg-background sm:px-4 sm:py-3 sm:text-foreground sm:shadow-sm sm:hover:scale-100 sm:hover:bg-[var(--ink)] sm:hover:text-[var(--ivory)]"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-[0.65rem] font-medium tracking-[0.08em] text-white sm:h-8 sm:w-8">
        WA
      </span>
      <span className="hidden text-[0.625rem] tracking-[0.24em] uppercase sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
