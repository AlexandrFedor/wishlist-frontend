"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, User } from "@/types";
import { apiClient } from "@/lib/api";
import { clearAccessTokenCookie, setAccessTokenCookie } from "@/lib/auth-cookie";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data: tokens } = await apiClient.post<AuthTokens>(
            "/auth/login",
            { email, password }
          );
          set({ tokens });
          setAccessTokenCookie(tokens.accessToken);

          const { data: user } = await apiClient.get<User>("/auth/me");
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (
        fullName: string,
        email: string,
        password: string
      ) => {
        set({ isLoading: true });
        try {
          const { data: tokens } = await apiClient.post<AuthTokens>(
            "/auth/register",
            { email, password, fullName }
          );
          set({ tokens });
          setAccessTokenCookie(tokens.accessToken);

          const { data: user } = await apiClient.get<User>("/auth/me");
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiClient.post("/auth/logout").catch(() => {});
        clearAccessTokenCookie();
        set({ user: null, tokens: null });
      },

      fetchMe: async () => {
        const { tokens } = get();
        if (!tokens) return;
        try {
          const { data: user } = await apiClient.get<User>("/auth/me");
          set({ user });
        } catch {
          set({ user: null, tokens: null });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true });
        set((state) => ({
          user: state.user
            ? { ...state.user, ...data, updatedAt: new Date().toISOString() }
            : null,
          isLoading: false,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
      }),
    }
  )
);
