import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

export type IconName = keyof typeof OutlineIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    solid?: boolean;
    className?: string;
}

export const Icon = ({ name, solid = false, className = "w-6 h-6", ...props }: IconProps) => {
    const Icons = solid ? SolidIcons : OutlineIcons;
    const IconComponent = Icons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <IconComponent className={className} {...props} />;
};
