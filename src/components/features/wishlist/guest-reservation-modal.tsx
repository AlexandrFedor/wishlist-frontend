"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  guestReservationSchema,
  type GuestReservationFormData,
} from "@/lib/validations";
import { useWishlistStore } from "@/store/wishlist-store";
import { useWishlist } from "@/hooks/useWishlist";
import type { WishlistItem } from "@/types";
import { formatPrice, getMinContribution } from "@/lib/utils";
import { storeReservationId } from "@/lib/reservation-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface GuestReservationModalProps {
  item: WishlistItem;
  mode: "full" | "partial";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestReservationModal({
  item,
  mode,
  open,
  onOpenChange,
}: GuestReservationModalProps) {
  const { reserveItem, isLoading } = useWishlistStore();
  const { getItemProgress, getTotalReserved } = useWishlist();

  const progress = getItemProgress(item.id);
  const totalReserved = getTotalReserved(item.id);
  const remaining = item.price - totalReserved;
  const minContribution = getMinContribution(item.price);

  const form = useForm<GuestReservationFormData>({
    resolver: zodResolver(guestReservationSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      amount: mode === "full" ? item.price : Math.min(minContribution, remaining),
      message: "",
    },
  });

  const onSubmit = async (data: GuestReservationFormData) => {
    const amount = mode === "full" ? item.price : data.amount;

    if (mode === "partial" && amount > remaining) {
      toast.error(`Максимальная сумма: ${formatPrice(remaining)}`);
      return;
    }

    try {
      const reservation = await reserveItem(item.id, {
        guestName: data.guestName,
        guestEmail: data.guestEmail || undefined,
        amount,
        isFullReservation: mode === "full",
        message: data.message || undefined,
      });
      storeReservationId(item.id, reservation.id);
      toast.success(
        mode === "full" ? "Подарок зарезервирован!" : "Спасибо за вклад!"
      );
      form.reset();
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
            {mode === "full" ? "Зарезервировать подарок" : "Внести вклад"}
          </DialogTitle>
          <DialogDescription>
            {item.title} &mdash; {formatPrice(item.price)}
          </DialogDescription>
        </DialogHeader>

        {mode === "partial" && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-muted-foreground text-xs">
              Собрано {formatPrice(totalReserved)} из {formatPrice(item.price)}{" "}
              &bull; Осталось {formatPrice(remaining)}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ваше имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Как вас зовут?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (необязательно)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Для получения уведомлений
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "partial" && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сумма вклада (₽)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={remaining}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Мин. {formatPrice(minContribution)}, макс.{" "}
                      {formatPrice(remaining)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сообщение (необязательно)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Пожелание..."
                      className="resize-none"
                      rows={2}
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
                  ? "Обработка..."
                  : mode === "full"
                    ? "Зарезервировать"
                    : `Внести ${formatPrice(form.watch("amount") || 0)}`}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
