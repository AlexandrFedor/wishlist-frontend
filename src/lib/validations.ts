import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Минимум 2 символа"),
    email: z.string().email("Введите корректный email"),
    password: z.string().min(8, "Минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const wishlistSchema = z.object({
  title: z.string().min(1, "Введите название").max(100, "Максимум 100 символов"),
  description: z.string().max(500, "Максимум 500 символов").optional(),
  isPublic: z.boolean(),
  eventDate: z.string().optional(),
});
export type WishlistFormData = z.infer<typeof wishlistSchema>;

export const itemSchema = z.object({
  title: z.string().min(1, "Введите название"),
  description: z.string().max(500).optional(),
  url: z.union([z.string().url("Некорректная ссылка"), z.literal("")]).optional(),
  price: z.number().min(1, "Укажите цену"),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
});
export type ItemFormData = z.infer<typeof itemSchema>;

export const guestReservationSchema = z.object({
  guestName: z.string().min(1, "Введите ваше имя"),
  guestEmail: z
    .union([z.string().email("Введите корректный email"), z.literal("")])
    .optional(),
  amount: z.number().min(1, "Минимальная сумма 1 ₽"),
  message: z.string().max(200).optional(),
});
export type GuestReservationFormData = z.infer<typeof guestReservationSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
});
export type ProfileFormData = z.infer<typeof profileSchema>;
