import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/model/types';
import { STORAGE_KEYS } from '@/shared/config/constants';
import Cookies from 'js-cookie';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    _hasHydrated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            _hasHydrated: false,
            login: (user, token) => {
                set({ user, isAuthenticated: true, accessToken: token });
                Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, token, { expires: 7 }); // 7 days
            },
            logout: () => {
                set({ user: null, isAuthenticated: false, accessToken: null });
                Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
            },
            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                return () => state?.setHasHydrated(true);
            },
        }
    )
);

