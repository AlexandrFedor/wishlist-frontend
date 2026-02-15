"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { wishlistSchema, type WishlistFormData } from "@/lib/validations";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Wishlist } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface WishlistFormProps {
  wishlist?: Wishlist;
}

export function WishlistForm({ wishlist }: WishlistFormProps) {
  const router = useRouter();
  const { createWishlist, updateWishlist, isLoading } = useWishlistStore();
  const isEditing = !!wishlist;
  const [calendarOpen, setCalendarOpen] = useState(false);

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
    const payload = {
      ...data,
      eventDate: data.eventDate || undefined,
    };
    try {
      if (isEditing) {
        await updateWishlist(wishlist.id, payload);
        toast.success("Список обновлён");
      } else {
        await createWishlist(payload);
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
                <Input placeholder="Напишите название события" {...field} />
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
          render={({ field }) => {
            const dateValue = field.value ? new Date(field.value) : undefined;
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Дата события</FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(dateValue!, "d MMMM yyyy", { locale: ru })
                          : "Выберите дату"}
                        <div className="ml-auto flex items-center gap-1">
                          {field.value && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.stopPropagation();
                                  field.onChange("");
                                }
                              }}
                              className="text-muted-foreground hover:text-foreground rounded-sm p-0.5"
                            >
                              <X className="size-4" />
                            </span>
                          )}
                          <CalendarIcon className="size-4 opacity-50" />
                        </div>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) => {
                        field.onChange(
                          date ? format(date, "yyyy-MM-dd") : ""
                        );
                        setCalendarOpen(false);
                      }}
                      defaultMonth={dateValue}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Опционально. Укажите дату вашего события.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
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
            {isLoading ? "Сохранение..." : isEditing ? "Сохранить" : "Создать"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}
