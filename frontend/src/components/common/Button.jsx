import React from 'react';

export const Button = ({ children, onClick, className = '', variant = 'primary', icon: Icon, ...props }) => {
    const baseStyle = 'px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm',
        action: 'bg-indigo-600 text-white hover:bg-indigo-700',
        revert: 'bg-yellow-600 text-white hover:bg-yellow-700',
        confirm: 'bg-green-600 text-white hover:bg-green-700',
        cancel: 'bg-red-600 text-white hover:bg-red-700',
        icon: 'p-2 rounded-full hover:bg-gray-200',
        none: '' // For custom tab styling
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={20} />}
            {children}
        </button>
    );
};
