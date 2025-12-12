'use client';

import { useEffect, useState } from 'react';
import { getOrgTree } from '@/features/org/api/orgApi';
import { OrgTree } from '@/features/org/ui/OrgTree';
import { Department } from '@/features/org/model/types';
import { Button } from '@/shared/ui/Button';

export default function OrgPage() {
    const [data, setData] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tree = await getOrgTree();
                setData(tree);
            } catch (error) {
                console.error('Failed to load org tree', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Organization Management
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Button variant="secondary" className="mr-2">Export</Button>
                    <Button>Add Department</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading organization structure...</p>
                </div>
            ) : (
                <OrgTree nodes={data} />
            )}
        </div>
    );
}
