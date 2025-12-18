'use client';

import React, { useState } from 'react';
import { useTenants, impersonateTenant, createTenant, deleteTenant } from '@/features/admin/api/tenantApi';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/shared/ui/Toast';
import { client } from '@/shared/api/client';

export default function TenantsPage() {
    const { tenants, isLoading, mutate } = useTenants();
    const { login } = useAuthStore();
    const router = useRouter();
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImpersonate = async (tenantId: number) => {
        setIsProcessing(true);
        try {
            const { accessToken } = await impersonateTenant(tenantId);

            // Set token in headers temporarily to fetch "me"
            client.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            const meResponse = await client.get('/auth/me');

            login(meResponse.data.data, accessToken);
            showToast('Impersonating tenant admin...', 'success');
            router.push('/dashboard');
        } catch (error) {
            console.error('Impersonation failed:', error);
            showToast('Impersonation failed', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tenant?')) return;
        try {
            await deleteTenant(id);
            showToast('Tenant deleted', 'success');
            mutate();
        } catch (error) {
            showToast('Failed to delete tenant', 'error');
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tenants Management</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all tenants in the system including their status and admin.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button onClick={() => alert('Tenant creation modal goes here')}>Create Tenant</Button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Domain</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Admin Email</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-sm">
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading tenants...</td></tr>
                                    ) : tenants.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-10 text-gray-500">No tenants found.</td></tr>
                                    ) : tenants.map((tenant) => (
                                        <tr key={tenant.id}>
                                            <td className="whitespace-nowrap px-3 py-4 text-gray-500">{tenant.id}</td>
                                            <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900">{tenant.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-gray-500">{tenant.domain}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-gray-500">{tenant.adminEmail}</td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {tenant.status}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleImpersonate(tenant.id)}
                                                    isLoading={isProcessing}
                                                >
                                                    Impersonate
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDelete(tenant.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
