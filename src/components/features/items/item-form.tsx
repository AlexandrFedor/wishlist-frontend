"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { itemSchema, type ItemFormData } from "@/lib/validations";
import { useWishlistStore } from "@/store/wishlist-store";
import type { WishlistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ItemFormProps {
  wishlistId: string;
  item?: WishlistItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemForm({
  wishlistId,
  item,
  open,
  onOpenChange,
}: ItemFormProps) {
  const { addItem, updateItem, isLoading } = useWishlistStore();
  const isEditing = !!item;

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: item?.title ?? "",
      description: item?.description ?? "",
      url: item?.url ?? "",
      price: item?.price ?? 0,
      imageUrl: item?.imageUrl ?? "",
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    try {
      if (isEditing) {
        await updateItem(wishlistId, item.id, {
          title: data.title,
          description: data.description,
          url: data.url || undefined,
          price: data.price,
          imageUrl: data.imageUrl || undefined,
        });
        toast.success("Подарок обновлён");
      } else {
        await addItem(wishlistId, {
          title: data.title,
          description: data.description,
          url: data.url || undefined,
          price: data.price,
          imageUrl: data.imageUrl || undefined,
        });
        toast.success("Подарок добавлен");
        form.reset();
      }
      onOpenChange(false);
    } catch {
      toast.error("Ошибка. Попробуйте позже.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Редактировать подарок" : "Добавить подарок"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Название подарка" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на товар</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена (₽)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Укажите цену"
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Сохранение..."
                  : isEditing
                    ? "Сохранить"
                    : "Добавить"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
