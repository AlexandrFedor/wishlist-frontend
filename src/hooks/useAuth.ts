"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const store = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    user: mounted ? store.user : null,
    tokens: mounted ? store.tokens : null,
    isAuthenticated: mounted && !!store.user,
    isLoading: store.isLoading,
    mounted,
    login: store.login,
    register: store.register,
    logout: store.logout,
    updateProfile: store.updateProfile,
  };
}
