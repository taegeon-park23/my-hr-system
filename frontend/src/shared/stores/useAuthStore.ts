import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    companyId: number;
}

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
                localStorage.setItem('accessToken', token);
            },
            logout: () => {
                set({ user: null, isAuthenticated: false, accessToken: null });
                localStorage.removeItem('accessToken');
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Don't persist everything if needed, but here we persist essential auth info
        }
    )
);
