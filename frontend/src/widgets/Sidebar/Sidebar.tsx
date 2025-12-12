'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Organization', href: '/dashboard/org' },
        { name: 'Approval', href: '/dashboard/approval' },
        { name: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
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
        </div>
    );
};
