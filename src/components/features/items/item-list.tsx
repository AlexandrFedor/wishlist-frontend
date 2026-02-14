"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import type { WishlistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { ItemCard } from "./item-card";
import { ItemForm } from "./item-form";
import { EmptyState } from "@/components/shared/empty-state";

interface ItemListProps {
  wishlistId: string;
  items: WishlistItem[];
}

export function ItemList({ wishlistId, items }: ItemListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>();

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Подарки ({items.length})
        </h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Добавить подарок
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Нет подарков"
          description="Добавьте первый подарок в ваш список"
          actionLabel="Добавить подарок"
          onAction={handleAdd}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <ItemForm
        wishlistId={wishlistId}
        item={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
