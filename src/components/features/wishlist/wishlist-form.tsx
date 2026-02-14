"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { wishlistSchema, type WishlistFormData } from "@/lib/validations";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Wishlist } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface WishlistFormProps {
  wishlist?: Wishlist;
}

export function WishlistForm({ wishlist }: WishlistFormProps) {
  const router = useRouter();
  const { createWishlist, updateWishlist, isLoading } = useWishlistStore();
  const isEditing = !!wishlist;

  const form = useForm<WishlistFormData>({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      title: wishlist?.title ?? "",
      description: wishlist?.description ?? "",
      isPublic: wishlist?.isPublic ?? true,
      eventDate: wishlist?.eventDate ?? "",
    },
  });

  const onSubmit = async (data: WishlistFormData) => {
    try {
      if (isEditing) {
        await updateWishlist(wishlist.id, data);
        toast.success("Список обновлён");
      } else {
        await createWishlist(data);
        toast.success("Список создан");
        router.push("/dashboard/wishlists");
      }
    } catch {
      toast.error("Ошибка. Попробуйте позже.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="День рождения 2025" {...field} />
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
                  placeholder="Опишите ваш список желаний..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата события</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Опционально. Укажите дату вашего события.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Публичный список</FormLabel>
                <FormDescription>
                  Доступен по ссылке без авторизации
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Сохранение..."
              : isEditing
                ? "Сохранить"
                : "Создать"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
