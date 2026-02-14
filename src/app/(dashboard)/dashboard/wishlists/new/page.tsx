"use client";

import { WishlistForm } from "@/components/features/wishlist/wishlist-form";
import { PageContainer } from "@/components/shared/page-container";

export default function NewWishlistPage() {
  return (
    <PageContainer className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Новый список желаний</h1>
      <WishlistForm />
    </PageContainer>
  );
}
