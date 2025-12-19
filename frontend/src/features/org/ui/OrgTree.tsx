'use client';

import React, { useState } from 'react';
import { Department } from '../model/types';
import { Icon } from '@/shared/ui/Icon';

interface OrgTreeProps {
    nodes: Department[];
    selectedId?: number | null;
    onSelect: (node: Department) => void;
}

const TreeNode = ({
    node,
    selectedId,
    onSelect
}: {
    node: Department;
    selectedId?: number | null;
    onSelect: (node: Department) => void;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;

    return (
        <div className="ml-4">
            <div className="flex items-center py-2 group">
                {hasChildren && (
                    <button
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                        className="mr-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {isOpen ? (
                            <Icon name="ChevronDownIcon" className="w-4 h-4" />
                        ) : (
                            <Icon name="ChevronRightIcon" className="w-4 h-4" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-5" />}

                <div
                    onClick={() => onSelect(node)}
                    className={`
                        flex items-center px-3 py-1.5 rounded-lg border cursor-pointer transition-all
                        ${isSelected
                            ? 'bg-primary-50 border-primary-200 shadow-sm ring-1 ring-primary-200'
                            : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                        }
                    `}
                >
                    <Icon
                        name={node.parentId === null ? 'HomeIcon' : 'FolderIcon'}
                        className={`w-4 h-4 mr-2 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`}
                    />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                        {node.name}
                    </span>
                    <span className="ml-2 text-[10px] text-gray-400 uppercase tracking-tighter">
                        {node.id}
                    </span>
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="border-l border-gray-100 ml-2.5">
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const OrgTree = ({ nodes, selectedId, onSelect }: OrgTreeProps) => {
    return (
        <div className="p-4 bg-white shadow-sm border border-slate-200 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">조직 구조</h3>
            <div className="-ml-4">
                {nodes.map((node) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        selectedId={selectedId}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
};
