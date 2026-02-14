"use client";

import { create } from "zustand";
import type {
  Wishlist,
  WishlistItem,
  Reservation,
  CreateWishlistData,
  CreateItemData,
  CreateReservationData,
} from "@/types";
import { apiClient } from "@/lib/api";

interface WishlistState {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  reservations: Reservation[];
  isLoading: boolean;

  fetchWishlists: () => Promise<void>;
  getWishlistById: (id: string) => Wishlist | undefined;
  fetchWishlistById: (id: string) => Promise<Wishlist>;
  fetchWishlistBySlug: (slug: string) => Promise<Wishlist>;
  getWishlistBySlug: (slug: string) => Wishlist | undefined;
  getItemReservations: (itemId: string) => Reservation[];
  fetchItemReservations: (itemId: string) => Promise<Reservation[]>;

  createWishlist: (data: CreateWishlistData) => Promise<Wishlist>;
  updateWishlist: (
    id: string,
    data: Partial<CreateWishlistData>
  ) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;

  addItem: (wishlistId: string, data: CreateItemData) => Promise<WishlistItem>;
  updateItem: (
    wishlistId: string,
    itemId: string,
    data: Partial<CreateItemData>
  ) => Promise<void>;
  deleteItem: (wishlistId: string, itemId: string) => Promise<void>;

  reserveItem: (
    itemId: string,
    data: CreateReservationData
  ) => Promise<void>;
}

// Map backend WishlistWithItemsResponse to frontend Wishlist
function mapWishlistResponse(data: Record<string, unknown>): Wishlist {
  const raw = data as Record<string, unknown>;
  const items = (raw.items as Record<string, unknown>[] | undefined) ?? [];
  return {
    id: raw.id as string,
    userId: raw.userId as string,
    title: raw.title as string,
    description: raw.description as string | undefined,
    slug: raw.slug as string,
    isPublic: raw.isPublic as boolean,
    eventDate: raw.eventDate as string | undefined,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
    items: items.map((item) => ({
      id: item.id as string,
      wishlistId: raw.id as string,
      title: item.title as string,
      description: item.description as string | undefined,
      url: item.url as string | undefined,
      imageUrl: item.imageUrl as string | undefined,
      price: item.price as number,
      currency: item.currency as string,
      position: item.position as number,
      createdAt: raw.createdAt as string,
      updatedAt: raw.updatedAt as string,
    })),
  };
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  wishlists: [],
  currentWishlist: null,
  reservations: [],
  isLoading: false,

  fetchWishlists: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get("/wishlists");
      const wishlists = (data as Record<string, unknown>[]).map((w) => ({
        ...w,
        items: (w as Record<string, unknown>).items ?? [],
      })) as Wishlist[];
      set({ wishlists, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getWishlistById: (id: string) => {
    return get().wishlists.find((w) => w.id === id) ?? get().currentWishlist ?? undefined;
  },

  fetchWishlistById: async (id: string) => {
    set({ isLoading: true });
    const { data } = await apiClient.get(`/wishlists/${id}`);
    const wishlist = mapWishlistResponse(data);
    set((state) => ({
      currentWishlist: wishlist,
      wishlists: state.wishlists.map((w) => (w.id === id ? wishlist : w)),
      isLoading: false,
    }));
    return wishlist;
  },

  fetchWishlistBySlug: async (slug: string) => {
    set({ isLoading: true });
    const { data } = await apiClient.get(`/w/${slug}`);
    const wishlist = mapWishlistResponse(data);
    set({ currentWishlist: wishlist, isLoading: false });
    return wishlist;
  },

  getWishlistBySlug: (slug: string) => {
    const { currentWishlist, wishlists } = get();
    if (currentWishlist?.slug === slug) return currentWishlist;
    return wishlists.find((w) => w.slug === slug);
  },

  getItemReservations: (itemId: string) => {
    return get().reservations.filter((r) => r.itemId === itemId);
  },

  fetchItemReservations: async (itemId: string) => {
    const { data } = await apiClient.get<Reservation[]>(
      `/items/${itemId}/reservations`
    );
    set((state) => ({
      reservations: [
        ...state.reservations.filter((r) => r.itemId !== itemId),
        ...data,
      ],
    }));
    return data;
  },

  createWishlist: async (data: CreateWishlistData) => {
    set({ isLoading: true });
    const { data: wishlist } = await apiClient.post<Wishlist>(
      "/wishlists",
      data
    );
    set((state) => ({
      wishlists: [...state.wishlists, { ...wishlist, items: [] }],
      isLoading: false,
    }));
    return { ...wishlist, items: [] };
  },

  updateWishlist: async (id: string, data: Partial<CreateWishlistData>) => {
    set({ isLoading: true });
    const { data: updated } = await apiClient.put(`/wishlists/${id}`, data);
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === id ? { ...w, ...updated } : w
      ),
      isLoading: false,
    }));
  },

  deleteWishlist: async (id: string) => {
    set({ isLoading: true });
    await apiClient.delete(`/wishlists/${id}`);
    set((state) => ({
      wishlists: state.wishlists.filter((w) => w.id !== id),
      isLoading: false,
    }));
  },

  addItem: async (wishlistId: string, data: CreateItemData) => {
    set({ isLoading: true });
    const { data: newItem } = await apiClient.post<WishlistItem>(
      `/wishlists/${wishlistId}/items`,
      data
    );
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === wishlistId
          ? { ...w, items: [...w.items, newItem] }
          : w
      ),
      isLoading: false,
    }));
    return newItem;
  },

  updateItem: async (
    wishlistId: string,
    itemId: string,
    data: Partial<CreateItemData>
  ) => {
    set({ isLoading: true });
    const { data: updated } = await apiClient.put(`/items/${itemId}`, data);
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === wishlistId
          ? {
              ...w,
              items: w.items.map((item) =>
                item.id === itemId ? { ...item, ...updated } : item
              ),
            }
          : w
      ),
      isLoading: false,
    }));
  },

  deleteItem: async (wishlistId: string, itemId: string) => {
    set({ isLoading: true });
    await apiClient.delete(`/items/${itemId}`);
    set((state) => ({
      wishlists: state.wishlists.map((w) =>
        w.id === wishlistId
          ? { ...w, items: w.items.filter((item) => item.id !== itemId) }
          : w
      ),
      reservations: state.reservations.filter((r) => r.itemId !== itemId),
      isLoading: false,
    }));
  },

  reserveItem: async (itemId: string, data: CreateReservationData) => {
    set({ isLoading: true });
    const { data: reservation } = await apiClient.post<Reservation>(
      `/items/${itemId}/reserve`,
      data
    );
    set((state) => ({
      reservations: [...state.reservations, reservation],
      isLoading: false,
    }));
  },
}));
