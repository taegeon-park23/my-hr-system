export interface Department {
    id: number;
    companyId: number;
    parentId: number | null;
    name: string;
    depth: number;
    children?: Department[]; // For recursive tree structure
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    deptId: number | null;
    position: string;
}


export interface OrgNode {
    department: Department;
    members: User[];
}

export interface TeamCountResponse {
    count: number;
}
