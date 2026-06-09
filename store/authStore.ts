import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface AuthState {
  user: { id: string; email: string } | null;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  fetchUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      set({ user: { id: user.id, email: user.email! } });
    } else {
      set({ user: null });
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    useAuthStore.getState().fetchUser();
  } else {
    useAuthStore.getState().logout();
  }
});
