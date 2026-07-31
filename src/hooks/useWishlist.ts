import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  handles: string[];
  toggle: (handle: string) => void;
  has: (handle: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (handle) => {
        const { handles } = get();
        set({
          handles: handles.includes(handle)
            ? handles.filter((h) => h !== handle)
            : [...handles, handle],
        });
      },
      has: (handle) => get().handles.includes(handle),
    }),
    {
      name: "eyvora-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
