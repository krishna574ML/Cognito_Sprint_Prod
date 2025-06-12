import React from 'react';

const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export const Avatar = ({ name, color, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
    };
    const initials = getInitials(name);

    return (
        <div title={name} className={`flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold ${color || 'bg-gray-400'} ${sizeClasses[size]} ${className}`}>
            {initials}
        </div>
    );
};