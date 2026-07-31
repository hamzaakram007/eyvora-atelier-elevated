import { Link } from "@tanstack/react-router";
import { ShoppingBag, Heart, Home, LayoutGrid } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export function MobileTabBar() {
  const setCartOpen = useCartStore((s) => s.setOpen);
  const count = useCartStore((s) => s.items.reduce((t, i) => t + i.quantity, 0));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      <Link to="/" className="flex flex-col items-center gap-1 py-3">
        <Home className="h-4 w-4" strokeWidth={1.2} />
        <span className="text-[0.5625rem] tracking-[0.18em] uppercase">Home</span>
      </Link>
      <Link to="/shop" className="flex flex-col items-center gap-1 py-3">
        <LayoutGrid className="h-4 w-4" strokeWidth={1.2} />
        <span className="text-[0.5625rem] tracking-[0.18em] uppercase">Shop</span>
      </Link>
      <Link to="/wishlist" className="flex flex-col items-center gap-1 py-3">
        <Heart className="h-4 w-4" strokeWidth={1.2} />
        <span className="text-[0.5625rem] tracking-[0.18em] uppercase">Saved</span>
      </Link>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="flex flex-col items-center gap-1 py-3"
      >
        <span className="relative">
          <ShoppingBag className="h-4 w-4" strokeWidth={1.2} />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-2 text-[0.5rem]">{count}</span>
          )}
        </span>
        <span className="text-[0.5625rem] tracking-[0.18em] uppercase">Bag</span>
      </button>
    </nav>
  );
}
