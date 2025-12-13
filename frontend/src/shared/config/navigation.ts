import { IconName } from "../ui/Icon";

export interface NavigationItem {
    name: string;
    href: string;
    icon: IconName;
    requiredRole?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'Organization', href: '/dashboard/org', icon: 'UserGroupIcon' },
    { name: 'Approval', href: '/dashboard/approval', icon: 'ClipboardDocumentCheckIcon' },
    { name: 'Vacation', href: '/dashboard/vacation', icon: 'SunIcon' },
    { name: 'Payroll', href: '/dashboard/payroll', icon: 'BanknotesIcon' },
    { name: 'Assets (Admin)', href: '/admin/assets/manage', icon: 'ComputerDesktopIcon', requiredRole: 'ADMIN' },
    { name: 'My Assets', href: '/assets/my', icon: 'DevicePhoneMobileIcon' },
    { name: 'Evaluations (Admin)', href: '/admin/evaluations/cycles', icon: 'ChartBarSquareIcon', requiredRole: 'ADMIN' },
    { name: 'Evaluations', href: '/evaluations/dashboard', icon: 'ChartBarIcon' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'Cog6ToothIcon' },
];
