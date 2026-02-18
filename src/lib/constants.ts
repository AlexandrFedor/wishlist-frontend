import type { ItemStatus } from "@/types";

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  available: "Доступен",
  reserved: "Зарезервирован",
  collecting: "Собирается",
  collected: "Собран",
};

export const ITEM_STATUS_VARIANTS: Record<
  ItemStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  available: "outline",
  reserved: "secondary",
  collecting: "default",
  collected: "destructive",
};

export const MIN_CONTRIBUTION_PERCENT = 0.1;
export const MIN_CONTRIBUTION_AMOUNT = 100;
export const DEFAULT_CURRENCY = "RUB";
