"use client";

import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { WishlistItem, ItemStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ITEM_STATUS_LABELS, ITEM_STATUS_VARIANTS } from "@/lib/constants";
import { useWishlistStore } from "@/store/wishlist-store";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ItemCardProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
}

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const { deleteItem } = useWishlistStore();
  const { getItemStatusForItem, getItemProgress, getTotalReserved } =
    useWishlist();

  const status: ItemStatus = getItemStatusForItem(item.id);
  const progress = getItemProgress(item.id);
  const totalReserved = getTotalReserved(item.id);

  const handleDelete = async () => {
    await deleteItem(item.wishlistId, item.id);
    toast.success("Подарок удалён");
  };

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      {item.imageUrl && (
        <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-md sm:block">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-medium">{item.title}</h3>
            {item.description && (
              <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {item.url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(item)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить подарок?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Все резервации для этого подарка будут удалены.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold">{formatPrice(item.price)}</span>
          <Badge variant={ITEM_STATUS_VARIANTS[status]}>
            {ITEM_STATUS_LABELS[status]}
          </Badge>
        </div>

        {(status === "collecting" || status === "collected") && (
          <div className="mt-2 space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-muted-foreground text-xs">
              {formatPrice(totalReserved)} из {formatPrice(item.price)} &bull;{" "}
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
