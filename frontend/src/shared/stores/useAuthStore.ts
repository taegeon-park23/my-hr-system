import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/model/types';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            login: (user, token) => {
                set({ user, isAuthenticated: true, accessToken: token });
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
            },
            logout: () => {
                set({ user: null, isAuthenticated: false, accessToken: null });
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

