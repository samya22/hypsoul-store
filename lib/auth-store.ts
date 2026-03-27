"use client";

import { create } from "zustand";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user ?? null, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
