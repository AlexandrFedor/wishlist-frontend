"use client";

import { useWishlistStore } from "@/store/wishlist-store";
import type { ItemStatus } from "@/types";
import { getItemStatus, getReservationProgress } from "@/lib/utils";

export function useWishlist() {
  const store = useWishlistStore();

  const getItemStatusForItem = (itemId: string): ItemStatus => {
    const item = store.wishlists
      .flatMap((w) => w.items)
      .find((i) => i.id === itemId);
    if (!item) return "available";
    const reservations = store.getItemReservations(itemId);
    return getItemStatus(item, reservations);
  };

  const getItemProgress = (itemId: string): number => {
    const item = store.wishlists
      .flatMap((w) => w.items)
      .find((i) => i.id === itemId);
    if (!item) return 0;
    const reservations = store.getItemReservations(itemId);
    return getReservationProgress(item, reservations);
  };

  const getTotalReserved = (itemId: string): number => {
    const reservations = store.getItemReservations(itemId);
    return reservations.reduce((sum, r) => sum + r.amount, 0);
  };

  return {
    ...store,
    getItemStatusForItem,
    getItemProgress,
    getTotalReserved,
  };
}
