import { Department } from '../model/types';

// Mock Data
const MOCK_DEPARTMENTS: Department[] = [
    { id: 1, companyId: 100, parentId: null, name: 'CEO Office', depth: 0 },
    { id: 2, companyId: 100, parentId: 1, name: 'Engineering', depth: 1 },
    { id: 3, companyId: 100, parentId: 1, name: 'HR & Admin', depth: 1 },
    { id: 4, companyId: 100, parentId: 2, name: 'Backend Team', depth: 2 },
    { id: 5, companyId: 100, parentId: 2, name: 'Frontend Team', depth: 2 },
    { id: 6, companyId: 100, parentId: 3, name: 'Recruiting', depth: 2 },
];

export const getOrgTree = async (): Promise<Department[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Transform flat list to tree
            const deptMap = new Map<number, Department>();
            const roots: Department[] = [];

            // 1. Initialize map
            MOCK_DEPARTMENTS.forEach(dept => {
                deptMap.set(dept.id, { ...dept, children: [] });
            });

            // 2. Build tree
            MOCK_DEPARTMENTS.forEach(dept => {
                const node = deptMap.get(dept.id)!;
                if (dept.parentId === null) {
                    roots.push(node);
                } else {
                    const parent = deptMap.get(dept.parentId);
                    if (parent) {
                        parent.children?.push(node);
                    }
                }
            });

            resolve(roots);
        }, 800);
    });
};
