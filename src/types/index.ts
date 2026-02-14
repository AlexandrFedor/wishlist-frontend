export type ItemStatus = "available" | "reserved" | "collecting" | "collected";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  slug: string;
  isPublic: boolean;
  eventDate?: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  price: number;
  currency: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  itemId: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  amount: number;
  isFullReservation: boolean;
  message?: string;
  createdAt: string;
}

export interface ItemWithReservations extends WishlistItem {
  reservations: Reservation[];
  totalReserved: number;
  status: ItemStatus;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CreateWishlistData {
  title: string;
  description?: string;
  isPublic: boolean;
  eventDate?: string;
}

export interface CreateItemData {
  title: string;
  description?: string;
  url?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
}

export interface CreateReservationData {
  guestName: string;
  guestEmail?: string;
  amount: number;
  isFullReservation: boolean;
  message?: string;
}
