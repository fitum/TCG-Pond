import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Order } from '../types';

interface AuthStore {
  user: User | null;
  orders: Order[];
  isAuthOpen: boolean;
  authMode: 'login' | 'register';
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (order: Order) => void;
  openAuth: (mode?: 'login' | 'register') => void;
  closeAuth: () => void;
}

// Simulated auth — replace with real API calls when backend is ready
const FAKE_DELAY = 600;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      user: null,
      orders: [],
      isAuthOpen: false,
      authMode: 'login',

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, FAKE_DELAY));
        if (!email || !password) return false;
        // Simulate: any valid email/password logs in
        const user: User = {
          id: btoa(email),
          email,
          name: email.split('@')[0],
        };
        set({ user, isAuthOpen: false });
        return true;
      },

      register: async (name, email, password) => {
        await new Promise((r) => setTimeout(r, FAKE_DELAY));
        if (!name || !email || !password) return false;
        const user: User = { id: btoa(email), email, name };
        set({ user, orders: [], isAuthOpen: false });
        return true;
      },

      logout: () => set({ user: null, orders: [] }),

      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

      openAuth: (mode = 'login') => set({ isAuthOpen: true, authMode: mode }),
      closeAuth: () => set({ isAuthOpen: false }),
    }),
    {
      name: 'tcg-pond-auth',
      partialize: (s) => ({ user: s.user, orders: s.orders }),
    }
  )
);
