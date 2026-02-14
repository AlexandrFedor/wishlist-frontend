"use client";

import Link from "next/link";
import { Calendar, Globe, Lock, MoreVertical, Gift, Trash2, Pencil, Copy } from "lucide-react";
import { toast } from "sonner";
import type { Wishlist } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useWishlistStore } from "@/store/wishlist-store";

interface WishlistCardProps {
  wishlist: Wishlist;
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
  const { deleteWishlist } = useWishlistStore();

  const handleDelete = async () => {
    await deleteWishlist(wishlist.id);
    toast.success("Список удалён");
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/w/${wishlist.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована");
  };

  const formattedDate = wishlist.eventDate
    ? new Date(wishlist.eventDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link href={`/dashboard/wishlists/${wishlist.id}/edit`}>
              <CardTitle className="truncate text-lg hover:underline">
                {wishlist.title}
              </CardTitle>
            </Link>
            {wishlist.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {wishlist.description}
              </CardDescription>
            )}
          </div>

          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/wishlists/${wishlist.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Редактировать
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Копировать ссылку
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить список?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Все подарки и резервации будут
                  удалены.
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
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Gift className="h-3 w-3" />
            {wishlist.items.length}{" "}
            {wishlist.items.length === 1 ? "подарок" : "подарков"}
          </Badge>

          <Badge variant={wishlist.isPublic ? "secondary" : "outline"} className="gap-1">
            {wishlist.isPublic ? (
              <Globe className="h-3 w-3" />
            ) : (
              <Lock className="h-3 w-3" />
            )}
            {wishlist.isPublic ? "Публичный" : "Приватный"}
          </Badge>

          {formattedDate && (
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
