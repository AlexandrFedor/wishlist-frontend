"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ImageOff } from "lucide-react";
import type { WishlistItem, ItemStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ITEM_STATUS_LABELS, ITEM_STATUS_VARIANTS } from "@/lib/constants";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ItemDetailModalProps {
  item: WishlistItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailModal({
  item,
  open,
  onOpenChange,
}: ItemDetailModalProps) {
  const { getItemStatusForItem, getItemProgress, getTotalReserved } =
    useWishlist();
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [ogLoading, setOgLoading] = useState(false);

  useEffect(() => {
    if (!open || !item) {
      setOgImage(null);
      return;
    }

    if (item.imageUrl || !item.url) return;

    setOgLoading(true);
    fetch(`/api/og-image?url=${encodeURIComponent(item.url)}`)
      .then((res) => res.json())
      .then((data) => setOgImage(data.ogImage))
      .catch(() => setOgImage(null))
      .finally(() => setOgLoading(false));
  }, [open, item]);

  if (!item) return null;

  const status: ItemStatus = getItemStatusForItem(item.id);
  const progress = getItemProgress(item.id);
  const totalReserved = getTotalReserved(item.id);
  const displayImage = item.imageUrl || ogImage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>

        {ogLoading && (
          <div className="bg-muted flex aspect-video items-center justify-center rounded-md">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}

        {!ogLoading && displayImage && (
          <div className="aspect-video overflow-hidden rounded-md">
            <img
              src={displayImage}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {!ogLoading && !displayImage && (
          <div className="bg-muted text-muted-foreground flex aspect-video items-center justify-center rounded-md">
            <ImageOff className="size-10" />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {formatPrice(item.price)}
            </span>
            <Badge variant={ITEM_STATUS_VARIANTS[status]}>
              {ITEM_STATUS_LABELS[status]}
            </Badge>
          </div>

          {(status === "collecting" || status === "collected") && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {formatPrice(totalReserved)} из {formatPrice(item.price)}{" "}
                &bull; {Math.round(progress)}%
              </p>
            </div>
          )}

          {item.description && (
            <p className="text-muted-foreground text-sm">{item.description}</p>
          )}

          {item.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Перейти к товару
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
