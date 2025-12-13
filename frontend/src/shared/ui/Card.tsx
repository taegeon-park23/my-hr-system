import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
            {title && <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>}
            {children}
        </div>
    );
};
