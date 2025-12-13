'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Organization', href: '/dashboard/org' },
        { name: 'Approval', href: '/dashboard/approval' },
        { name: 'Vacation', href: '/dashboard/vacation' },
        { name: 'Payroll', href: '/dashboard/payroll' },
        { name: 'Assets (Admin)', href: '/admin/assets/manage' },
        { name: 'My Assets', href: '/assets/my' },
        { name: 'Evaluations (Admin)', href: '/admin/evaluations/cycles' },
        { name: 'Evaluations', href: '/evaluations/dashboard' },
        { name: 'Settings', href: '/dashboard/settings' },
    ];

    const Content = (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800 h-full">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-white font-bold text-xl">HR System</h1>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigation.map((item) => {
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
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs font-medium text-gray-300">View Profile</p>
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
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
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
