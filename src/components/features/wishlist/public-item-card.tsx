"use client";

import { useState } from "react";
import { ExternalLink, Heart, HandCoins } from "lucide-react";
import type { WishlistItem, ItemStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ITEM_STATUS_LABELS, ITEM_STATUS_VARIANTS } from "@/lib/constants";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GuestReservationModal } from "./guest-reservation-modal";

interface PublicItemCardProps {
  item: WishlistItem;
  isOwner: boolean;
}

export function PublicItemCard({ item, isOwner }: PublicItemCardProps) {
  const { getItemStatusForItem, getItemProgress, getTotalReserved } =
    useWishlist();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"full" | "partial">("full");

  const status: ItemStatus = getItemStatusForItem(item.id);
  const progress = getItemProgress(item.id);
  const totalReserved = getTotalReserved(item.id);
  const remaining = item.price - totalReserved;
  const isAvailable = status === "available";
  const isCollecting = status === "collecting";

  const handleReserve = () => {
    setModalMode("full");
    setModalOpen(true);
  };

  const handleContribute = () => {
    setModalMode("partial");
    setModalOpen(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        {item.imageUrl && (
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight">{item.title}</h3>
            <Badge variant={ITEM_STATUS_VARIANTS[status]} className="shrink-0">
              {ITEM_STATUS_LABELS[status]}
            </Badge>
          </div>

          {item.description && (
            <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
              {item.description}
            </p>
          )}

          <div className="mb-3 text-lg font-bold">
            {formatPrice(item.price)}
          </div>

          {(isCollecting || status === "collected") && (
            <div className="mb-3 space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {formatPrice(totalReserved)} из {formatPrice(item.price)}{" "}
                &bull; {Math.round(progress)}%
              </p>
            </div>
          )}

          {!isOwner && (
            <div className="flex flex-wrap gap-2">
              {isAvailable && (
                <>
                  <Button size="sm" onClick={handleReserve} className="flex-1">
                    <Heart className="mr-2 h-4 w-4" />
                    Зарезервировать
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleContribute}
                    className="flex-1"
                  >
                    <HandCoins className="mr-2 h-4 w-4" />
                    Скинуться
                  </Button>
                </>
              )}

              {isCollecting && remaining > 0 && (
                <Button
                  size="sm"
                  onClick={handleContribute}
                  className="flex-1"
                >
                  <HandCoins className="mr-2 h-4 w-4" />
                  Внести вклад
                </Button>
              )}

              {item.url && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ссылка
                  </a>
                </Button>
              )}
            </div>
          )}

          {isOwner && status !== "available" && (
            <p className="text-muted-foreground text-sm italic">
              {status === "reserved"
                ? "Кто-то зарезервировал этот подарок"
                : status === "collecting"
                  ? "Друзья скидываются на этот подарок"
                  : "Подарок собран!"}
            </p>
          )}
        </div>
      </div>

      {!isOwner && (
        <GuestReservationModal
          item={item}
          mode={modalMode}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );
}
