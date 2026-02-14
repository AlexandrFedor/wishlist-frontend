"use client";

import { use } from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";
import { WishlistForm } from "@/components/features/wishlist/wishlist-form";
import { ItemList } from "@/components/features/items/item-list";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function EditWishlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const wishlist = useWishlistStore((s) => s.getWishlistById(id));

  if (!wishlist) {
    return (
      <PageContainer className="py-16 text-center">
        <h1 className="text-2xl font-bold">Список не найден</h1>
        <p className="text-muted-foreground mt-2">
          Возможно, он был удалён.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/wishlists">К моим спискам</Link>
        </Button>
      </PageContainer>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/w/${wishlist.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована");
  };

  return (
    <PageContainer className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Редактирование</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Копировать ссылку
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/w/${wishlist.slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Открыть
            </Link>
          </Button>
        </div>
      </div>

      <WishlistForm wishlist={wishlist} />

      <Separator className="my-8" />

      <ItemList wishlistId={wishlist.id} items={wishlist.items} />
    </PageContainer>
  );
}
