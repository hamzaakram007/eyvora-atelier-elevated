import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { FloatingAssistant } from "@/components/site/FloatingAssistant";
import { MobileTabBar } from "@/components/site/MobileTabBar";
import { Toaster } from "@/components/ui/sonner";
import { useCartSync } from "@/hooks/useCartSync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="font-display mt-5 text-5xl">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-9">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[var(--ink)] px-8 py-4 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-[var(--ink)] px-7 py-3.5 text-[0.625rem] tracking-[0.3em] text-[var(--ivory)] uppercase"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-border px-7 py-3.5 text-[0.625rem] tracking-[0.3em] uppercase"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EYVORA — Premium Hoodies & Trousers in Pakistan" },
      {
        name: "description",
        content:
          "Shop EYVORA premium hoodies and trousers online in Pakistan. Olive & black hoodies, grey & black trousers. Cash on Delivery and UBL bank transfer. PKR pricing.",
      },
      {
        name: "keywords",
        content:
          "EYVORA, hoodies Pakistan, trousers Pakistan, couple hoodies, olive hoodie, black hoodie, cash on delivery",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "EYVORA" },
      { property: "og:site_name", content: "EYVORA" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "EYVORA — Premium Hoodies & Trousers in Pakistan",
      },
      {
        property: "og:description",
        content:
          "Everyday essentials elevated. Hoodies and trousers with COD and bank transfer checkout.",
      },
      { property: "og:image", content: "https://eyvora.pk/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_PK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "EYVORA — Premium Hoodies & Trousers" },
      {
        name: "twitter:description",
        content: "Shop olive & black hoodies and grey & black trousers. Pakistan / PKR.",
      },
      { name: "twitter:image", content: "https://eyvora.pk/og.jpg" },
      { name: "theme-color", content: "#F7F5F0" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteChrome() {
  useCartSync();
  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingAssistant />
      <MobileTabBar />
      <Toaster position="top-center" />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome />
    </QueryClientProvider>
  );
}
