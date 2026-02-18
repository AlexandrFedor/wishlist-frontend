"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { Calendar, Gift, ArrowLeft, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { useRealtime } from "@/hooks/useRealtime";
import { PublicItemCard } from "@/components/features/wishlist/public-item-card";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { PageContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PublicWishlistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const wishlist = useWishlistStore((s) => s.getWishlistBySlug(slug));
  const fetchWishlistBySlug = useWishlistStore((s) => s.fetchWishlistBySlug);
  const isLoading = useWishlistStore((s) => s.isLoading);
  const currentUser = useAuthStore((s) => s.user);
  const tokens = useAuthStore((s) => s.tokens);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useRealtime(slug);

  useEffect(() => {
    fetchWishlistBySlug(slug);
  }, [slug, fetchWishlistBySlug]);

  useEffect(() => {
    if (tokens && !currentUser) {
      fetchMe().catch(() => {});
    }
  }, [tokens, currentUser, fetchMe]);

  const isOwner = currentUser?.id === wishlist?.userId;

  if (isLoading && !wishlist) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Gift className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-2 text-2xl font-bold">Список не найден</h1>
            <p className="text-muted-foreground mb-4">
              Этот список не существует или был удалён
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                На главную
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = wishlist.eventDate
    ? new Date(wishlist.eventDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/w/${wishlist.slug}`;
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <PageContainer>
          {/* Hero section */}
          <div className="mb-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <h1 className="text-3xl font-bold sm:text-4xl">
                {wishlist.title}
              </h1>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Скопировать ссылку
              </Button>
            </div>
            {wishlist.description && (
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                {wishlist.description}
              </p>
            )}
            {formattedDate && (
              <Badge variant="secondary" className="mt-3 gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </Badge>
            )}
          </div>

          {/* Items grid */}
          {wishlist.items.length === 0 ? (
            <EmptyState
              icon={Gift}
              title="Список пуст"
              description="В этом списке пока нет подарков"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.items.map((item) => (
                <PublicItemCard
                  key={item.id}
                  item={item}
                  isOwner={isOwner}
                />
              ))}
            </div>
          )}
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}
