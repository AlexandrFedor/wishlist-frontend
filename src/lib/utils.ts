import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ItemStatus, Reservation, WishlistItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "RUB"): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateSlug(title: string): string {
  const transliterated = title
    .replace(/[а-яё]/gi, (char) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
        ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
        н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
        ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[char.toLowerCase()] || char;
    });

  return (
    transliterated
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

export function getItemStatus(
  item: WishlistItem,
  reservations: Reservation[]
): ItemStatus {
  const totalReserved = reservations.reduce((sum, r) => sum + r.amount, 0);
  const hasFullReservation = reservations.some((r) => r.isFullReservation);

  if (hasFullReservation || totalReserved >= item.price) {
    return totalReserved >= item.price ? "collected" : "reserved";
  }
  if (totalReserved > 0) {
    return "collecting";
  }
  return "available";
}

export function getReservationProgress(
  item: WishlistItem,
  reservations: Reservation[]
): number {
  const totalReserved = reservations.reduce((sum, r) => sum + r.amount, 0);
  if (item.price <= 0) return 0;
  return Math.min(100, (totalReserved / item.price) * 100);
}

export function getMinContribution(price: number): number {
  return Math.min(price * 0.1, 100);
}
