import { describe, expect, it } from "vitest";
import { getItemStatus, getReservationProgress } from "@/lib/utils";
import type { Reservation, WishlistItem } from "@/types";

const baseItem: WishlistItem = {
  id: "item-1",
  wishlistId: "wl-1",
  title: "Test",
  price: 1000,
  currency: "RUB",
  position: 0,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const fullReservation: Reservation = {
  id: "res-1",
  itemId: "item-1",
  amount: 1000,
  isFullReservation: true,
  createdAt: "2025-01-02T00:00:00Z",
};

const partialReservation: Reservation = {
  id: "res-2",
  itemId: "item-1",
  amount: 200,
  isFullReservation: false,
  createdAt: "2025-01-02T00:00:00Z",
};

describe("getItemStatus", () => {
  it("returns available when no reservations and no aggregates", () => {
    expect(getItemStatus(baseItem, [])).toBe("available");
  });

  it("uses reservation list when present", () => {
    expect(getItemStatus(baseItem, [partialReservation])).toBe("collecting");
    expect(getItemStatus(baseItem, [fullReservation])).toBe("collected");
  });

  it("falls back to item aggregates when reservations list is empty", () => {
    const itemWithAggregates: WishlistItem = {
      ...baseItem,
      reservedAmount: 500,
      isFullyReserved: false,
    };
    expect(getItemStatus(itemWithAggregates, [])).toBe("collecting");
  });
});

describe("getReservationProgress", () => {
  it("returns 0 for invalid price", () => {
    expect(getReservationProgress({ ...baseItem, price: 0 }, [])).toBe(0);
  });

  it("uses reservation list when present", () => {
    expect(getReservationProgress(baseItem, [partialReservation])).toBe(20);
  });

  it("falls back to item aggregates when reservations list is empty", () => {
    const itemWithAggregates: WishlistItem = {
      ...baseItem,
      reservedAmount: 250,
    };
    expect(getReservationProgress(itemWithAggregates, [])).toBe(25);
  });
});
