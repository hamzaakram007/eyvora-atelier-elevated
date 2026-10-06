import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { isShopifySyncedVariantId } from "@/lib/catalog";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import {
  BANK_TRANSFER_DISCOUNT_CODE,
  orderChannelLabel,
  orderLink,
} from "@/lib/site";

export type CheckoutPaymentMethod = "cod" | "bank";

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        checkoutUrl
        discountCodes { code applicable }
      }
      userErrors { field message }
    }
  }
`;

const CART_NOTE_UPDATE_MUTATION = `
  mutation cartNoteUpdate($cartId: ID!, $note: String!) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

const SHOPIFY_CHECKOUT_HOST =
  (
    import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ||
    "eyvora-premium-essentials-bv3bk-uwdagguc.myshopify.com"
  )
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

/**
 * Shopify returns checkout on the shop primary domain (eyvora.pk), but that host
 * points at Vercel for the headless storefront — /cart/c/... 404s there.
 * Always send checkout to the *.myshopify.com host instead.
 */
function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.protocol = "https:";
    url.host = SHOPIFY_CHECKOUT_HOST;
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

type UserError = { field: string[] | null; message: string };

function isCartNotFoundError(userErrors: UserError[]): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

async function createShopifyCart(item: CartItem) {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error("Cart creation failed:", data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return {
    cartId: cart.id as string,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    lineId: lineId as string,
  };
}

async function addLineToShopifyCart(cartId: string, item: CartItem) {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const userErrors: UserError[] = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Add line failed:", userErrors);
    return { success: false };
  }

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: { node: { id: string; merchandise: { id: string } } }) =>
      l.node.merchandise.id === item.variantId,
  );
  return { success: true, lineId: newLine?.node?.id as string | undefined };
}

async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors: UserError[] = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Update line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors: UserError[] = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Remove line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;
  note: string;
  setOpen: (open: boolean) => void;
  setNote: (note: string) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  /**
   * Returns a Shopify checkout URL (rewritten off the Vercel domain).
   * Bank transfer automatically applies the BANK7 cart discount — no code entry needed.
   */
  prepareCheckout: (paymentMethod?: CheckoutPaymentMethod) => Promise<string | null>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,
      note: "",

      setOpen: (open) => set({ isOpen: open }),
      setNote: (note) => set({ note }),

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);
        const synced = isShopifySyncedVariantId(item.variantId);

        set({ isLoading: true });
        try {
          // Local launch catalogue (Storefront locked on Shopify trial) — bag only, no Storefront cart.
          if (!synced) {
            if (existingItem) {
              set({
                items: items.map((i) =>
                  i.variantId === item.variantId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i,
                ),
              });
            } else {
              set({ items: [...items, { ...item, lineId: null }] });
            }
            const channel = orderChannelLabel();
            toast.message("Saved to bag", {
              description: channel
                ? `Product sync pending — checkout can use ${channel}, or refresh after Shopify sync.`
                : "Refresh the page once Shopify products finish syncing for native checkout.",
            });
            return;
          }

          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
              });
              toast.message("Saved to bag", {
                description: "Ready for secure Shopify checkout.",
              });
            } else {
              toast.error("Could not add to bag", {
                description: "Please try again in a moment.",
              });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) return;
            const result = await updateShopifyCartLine(
              cartId,
              existingItem.lineId,
              newQuantity,
            );
            if (result.success) {
              const currentItems = get().items;
              set({
                items: currentItems.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i,
                ),
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const currentItems = get().items;
              set({ items: [...currentItems, { ...item, lineId: result.lineId ?? null }] });
              toast.message("Saved to bag", {
                description: "Ready for secure Shopify checkout.",
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }
        } catch (error) {
          console.error("Failed to add item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item) return;

        if (!isShopifySyncedVariantId(variantId) || !item.lineId || !cartId) {
          set({
            items: items.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i,
            ),
          });
          return;
        }

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const currentItems = get().items;
            set({
              items: currentItems.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i,
              ),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to update quantity:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item) return;

        if (!isShopifySyncedVariantId(variantId) || !item.lineId || !cartId) {
          const newItems = items.filter((i) => i.variantId !== variantId);
          if (newItems.length === 0) clearCart();
          else set({ items: newItems });
          return;
        }

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const currentItems = get().items;
            const newItems = currentItems.filter((i) => i.variantId !== variantId);
            if (newItems.length === 0) {
              clearCart();
            } else {
              set({ items: newItems });
            }
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error("Failed to remove item:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => {
        const { checkoutUrl, items } = get();
        if (checkoutUrl) return formatCheckoutUrl(checkoutUrl);
        if (items.length === 0) return null;
        if (items.every((i) => !isShopifySyncedVariantId(i.variantId))) {
          const summary = items
            .map((i) => {
              const size =
                i.selectedOptions.find((o) => o.name.toLowerCase() === "size")
                  ?.value ?? i.variantTitle;
              const lineTotal = parseFloat(i.price.amount) * i.quantity;
              return `• ${i.product.node.title} — Size ${size} × ${i.quantity} (PKR ${Math.round(lineTotal).toLocaleString("en-PK")})`;
            })
            .join("\n");
          const subtotal = items.reduce(
            (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
            0,
          );
          return (
            orderLink(
              `Hello EYVORA, I would like to order:\n${summary}\n\nSubtotal: PKR ${Math.round(subtotal).toLocaleString("en-PK")}\nShipping: PKR 249\n(Please confirm delivery city, phone & payment method.)`,
            ) || null
          );
        }
        return null;
      },

      prepareCheckout: async (paymentMethod = "cod") => {
        const { items, cartId } = get();
        if (items.length === 0) {
          toast.message("Your bag is empty");
          return null;
        }

        // Apply BANK7 only for bank transfer; remove it for COD so the Shopify
        // checkout total matches the selected method. The checkout UI extension
        // re-syncs if the customer switches payment method on Shopify checkout.
        if (cartId && items.every((i) => isShopifySyncedVariantId(i.variantId))) {
          set({ isLoading: true });
          try {
            const discountCodes =
              paymentMethod === "bank" ? [BANK_TRANSFER_DISCOUNT_CODE] : [];
            const discountData = await storefrontApiRequest(
              CART_DISCOUNT_CODES_UPDATE_MUTATION,
              { cartId, discountCodes },
            );
            const discountErrors: UserError[] =
              discountData?.data?.cartDiscountCodesUpdate?.userErrors || [];
            if (discountErrors.length > 0) {
              console.error("Discount update failed:", discountErrors);
              if (paymentMethod === "bank") {
                toast.message("Could not apply bank transfer discount", {
                  description: discountErrors[0]?.message || "Try again in a moment.",
                });
              }
            } else {
              const nextUrl =
                discountData?.data?.cartDiscountCodesUpdate?.cart?.checkoutUrl;
              if (nextUrl) {
                set({ checkoutUrl: formatCheckoutUrl(nextUrl) });
              }
            }

            const note =
              paymentMethod === "bank"
                ? `Payment preference: Bank transfer (UBL). ${BANK_TRANSFER_DISCOUNT_CODE} 7% discount applied automatically. Customer will send payment proof after checkout.`
                : "Payment preference: Cash on Delivery (COD). Full price — switch to Bank Deposit on Shopify checkout for automatic 7% off.";
            await storefrontApiRequest(CART_NOTE_UPDATE_MUTATION, {
              cartId,
              note,
            });
          } catch (error) {
            console.error("Failed to prepare checkout discounts:", error);
            if (paymentMethod === "bank") {
              toast.message("Could not apply bank transfer discount", {
                description:
                  "You can still continue — contact EYVORA if the discount is missing.",
              });
            }
          } finally {
            set({ isLoading: false });
          }
        }

        const url = get().getCheckoutUrl();
        if (!url) {
          toast.message("Checkout unavailable", {
            description: "Add items again, then try Checkout.",
          });
          return null;
        }

        if (paymentMethod === "bank") {
          try {
            const withDiscount = new URL(url);
            withDiscount.searchParams.set("discount", BANK_TRANSFER_DISCOUNT_CODE);
            return withDiscount.toString();
          } catch {
            return url;
          }
        }

        // COD: strip any leftover discount query param so checkout opens at full price.
        try {
          const clean = new URL(url);
          if (clean.searchParams.get("discount")?.toUpperCase() === BANK_TRANSFER_DISCOUNT_CODE) {
            clean.searchParams.delete("discount");
          }
          return clean.toString();
        } catch {
          return url;
        }
      },

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;

        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (error) {
          console.error("Failed to sync cart with Shopify:", error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "eyvora-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        note: state.note,
      }),
    },
  ),
);
