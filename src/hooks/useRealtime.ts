"use client";

import { useEffect } from "react";
import { socketManager } from "@/lib/socket";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";

export function useRealtime(wishlistSlug: string) {
  const tokens = useAuthStore((s) => s.tokens);
  const fetchWishlistBySlug = useWishlistStore((s) => s.fetchWishlistBySlug);

  useEffect(() => {
    const socket = socketManager.connect(tokens?.accessToken);
    socket.connect();

    socket.emit("join:wishlist", { slug: wishlistSlug });

    const handleUpdate = () => {
      fetchWishlistBySlug(wishlistSlug);
    };

    socket.on("item:reserved", handleUpdate);
    socket.on("item:unreserved", handleUpdate);
    socket.on("item:contribution", handleUpdate);
    socket.on("item:updated", handleUpdate);
    socket.on("item:deleted", handleUpdate);
    socket.on("wishlist:updated", handleUpdate);

    return () => {
      socket.emit("leave:wishlist", { slug: wishlistSlug });
      socket.off("item:reserved", handleUpdate);
      socket.off("item:unreserved", handleUpdate);
      socket.off("item:contribution", handleUpdate);
      socket.off("item:updated", handleUpdate);
      socket.off("item:deleted", handleUpdate);
      socket.off("wishlist:updated", handleUpdate);
    };
  }, [wishlistSlug, tokens?.accessToken, fetchWishlistBySlug]);
}
