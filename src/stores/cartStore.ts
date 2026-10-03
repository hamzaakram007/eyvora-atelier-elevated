import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { isShopifySyncedVariantId } from "@/lib/catalog";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { normalizePakistanPhone, orderChannelLabel, orderLink } from "@/lib/site";

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

const CART_BUYER_IDENTITY_UPDATE = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
        buyerIdentity { phone email countryCode }
      }
      userErrors { field message code }
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

async function updateCartBuyerIdentity(
  cartId: string,
  identity: { phone: string; email?: string },
) {
  const data = await storefrontApiRequest(CART_BUYER_IDENTITY_UPDATE, {
    cartId,
    buyerIdentity: {
      phone: identity.phone,
      countryCode: "PK",
      ...(identity.email ? { email: identity.email } : {}),
    },
  });

  const payload = data?.data?.cartBuyerIdentityUpdate;
  const userErrors: UserError[] = payload?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false as const, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Buyer identity update failed:", userErrors);
    return {
      success: false as const,
      message: userErrors.map((e) => e.message).join(", ") || "Could not save phone number",
    };
  }

  const checkoutUrl = payload?.cart?.checkoutUrl
    ? formatCheckoutUrl(payload.cart.checkoutUrl)
    : null;
  return { success: true as const, checkoutUrl };
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;
  note: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  setOpen: (open: boolean) => void;
  setNote: (note: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerEmail: (email: string) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  /** Validates required phone, syncs to Shopify cart, returns checkout URL. */
  prepareCheckout: () => Promise<string | null>;
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
      customerName: "",
      customerPhone: "",
      customerEmail: "",

      setOpen: (open) => set({ isOpen: open }),
      setNote: (note) => set({ note }),
      setCustomerName: (customerName) => set({ customerName }),
      setCustomerPhone: (customerPhone) => set({ customerPhone }),
      setCustomerEmail: (customerEmail) => set({ customerEmail }),

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
        const { checkoutUrl, items, customerPhone, customerName, customerEmail } = get();
        if (checkoutUrl) return formatCheckoutUrl(checkoutUrl);
        if (items.length === 0) return null;
        if (items.every((i) => !isShopifySyncedVariantId(i.variantId))) {
          const phone = normalizePakistanPhone(customerPhone);
          if (!phone) return null;
          const summary = items
            .map((i) => {
              const size =
                i.selectedOptions.find((o) => o.name.toLowerCase() === "size")
                  ?.value ?? i.variantTitle;
              const lineTotal =
                parseFloat(i.price.amount) * i.quantity;
              return `• ${i.product.node.title} — Size ${size} × ${i.quantity} (PKR ${Math.round(lineTotal).toLocaleString("en-PK")})`;
            })
            .join("\n");
          const subtotal = items.reduce(
            (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
            0,
          );
          const contactLines = [
            customerName.trim() ? `Name: ${customerName.trim()}` : null,
            `Phone: ${phone}`,
            customerEmail.trim() ? `Email: ${customerEmail.trim()}` : null,
          ]
            .filter(Boolean)
            .join("\n");
          return (
            orderLink(
              `Hello EYVORA, I would like to order:\n${summary}\n\n${contactLines}\nSubtotal: PKR ${Math.round(subtotal).toLocaleString("en-PK")}\n(Please confirm delivery city & payment method.)`,
            ) || null
          );
        }
        return null;
      },

      prepareCheckout: async () => {
        const {
          cartId,
          checkoutUrl,
          items,
          customerPhone,
          customerEmail,
          clearCart,
        } = get();

        if (items.length === 0) {
          toast.message("Your bag is empty");
          return null;
        }

        const phone = normalizePakistanPhone(customerPhone);
        if (!phone) {
          toast.message("Phone number required", {
            description: "Enter a valid Pakistan mobile number (e.g. 03XX XXXXXXX).",
          });
          return null;
        }

        // Local / WhatsApp-email fallback checkout
        if (items.every((i) => !isShopifySyncedVariantId(i.variantId))) {
          return get().getCheckoutUrl();
        }

        if (!cartId) {
          toast.message("Checkout unavailable", {
            description: "Add items again, then enter your phone number.",
          });
          return null;
        }

        set({ isLoading: true });
        try {
          const email = customerEmail.trim();
          const result = await updateCartBuyerIdentity(cartId, {
            phone,
            ...(email ? { email } : {}),
          });
          if (result.cartNotFound) {
            clearCart();
            toast.message("Bag expired", {
              description: "Please add your pieces again.",
            });
            return null;
          }
          if (!result.success) {
            toast.error("Could not save phone number", {
              description: result.message || "Please check the number and try again.",
            });
            return null;
          }
          const nextUrl = result.checkoutUrl || checkoutUrl;
          if (nextUrl) set({ checkoutUrl: nextUrl });
          return nextUrl;
        } catch (error) {
          console.error("prepareCheckout failed:", error);
          toast.error("Checkout failed", {
            description: "Please try again in a moment.",
          });
          return null;
        } finally {
          set({ isLoading: false });
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
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        customerEmail: state.customerEmail,
      }),
    },
  ),
);
