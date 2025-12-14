import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md ${className}`}>
            {title && <h3 className="text-lg font-semibold leading-6 text-text-title mb-4">{title}</h3>}
            {children}
        </div>
    );
};
