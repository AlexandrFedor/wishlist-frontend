"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, Gift } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { WishlistCard } from "@/components/features/wishlist/wishlist-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistsPage() {
  const { wishlists, isLoading, fetchWishlists } = useWishlistStore();

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  return (
    <PageContainer>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Мои списки</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте вашими списками желаний
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/wishlists/new">
            <Plus className="mr-2 h-4 w-4" />
            Создать список
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlists.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="Нет списков желаний"
          description="Создайте свой первый список и поделитесь им с друзьями"
          actionLabel="Создать список"
          onAction={() => {
            window.location.href = "/dashboard/wishlists/new";
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
