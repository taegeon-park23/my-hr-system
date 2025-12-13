'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { NAVIGATION_ITEMS } from '@/shared/config/navigation';
import { Icon } from '@/shared/ui/Icon';

import { useUIStore } from '@/shared/stores/useUIStore';

export const Sidebar = () => {
    const { isSidebarOpen, setSidebarOpen } = useUIStore();
    const isOpen = isSidebarOpen;
    const onClose = () => setSidebarOpen(false);
    const pathname = usePathname();
    const { user } = useAuthStore();

    const filteredNavigation = NAVIGATION_ITEMS.filter(item => {
        if (!item.requiredRole) return true;
        // Simple role check - adjust logic if role format differs (e.g. ROLE_ADMIN)
        return user?.role === item.requiredRole || user?.role === `ROLE_${item.requiredRole}`;
    });

    const Content = (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800 h-full">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-white font-bold text-xl">HR System</h1>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {filteredNavigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose} // Close sidebar on navigate (mobile)
                                className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                            >
                                <Icon
                                    name={item.icon}
                                    className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <div className="flex-shrink-0 w-full group block">
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
                            <p className="text-xs font-medium text-gray-300">{user?.role || 'View Profile'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                {Content}
            </div>

            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed inset-0 flex z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                />

                {/* Drawer */}
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 transition ease-in-out duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {isOpen && (
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <Icon name="XMarkIcon" className="h-6 w-6 text-white" />
                            </button>
                        </div>
                    )}
                    {Content}
                </div>
                <div className="flex-shrink-0 w-14">

                    {/* Force sidebar to shrink to fit close icon */}
                </div>
            </div>
        </>
    );
};
