import React, { useState } from 'react';
import { Department } from '../model/types';

interface OrgTreeProps {
    nodes: Department[];
}

const TreeNode = ({ node }: { node: Department }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4">
            <div className="flex items-center py-2">
                {hasChildren && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {isOpen ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                )}
                <div className={`
          flex items-center px-3 py-1.5 rounded-md border 
          ${node.id === 1 ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}
        `}>
                    <span className="text-sm font-medium text-gray-900">{node.name}</span>
                    <span className="ml-2 text-xs text-gray-400">({node.depth})</span>
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="border-l-2 border-gray-100 ml-2">
                    {node.children!.map((child) => (
                        <TreeNode key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const OrgTree = ({ nodes }: OrgTreeProps) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Structure</h3>
            {nodes.map((node) => (
                <TreeNode key={node.id} node={node} />
            ))}
        </div>
    );
};
