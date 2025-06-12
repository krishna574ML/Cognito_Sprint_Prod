import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto ${className}`}>
                <Button onClick={onClose} variant="icon" className="absolute top-3 right-3">
                    <X size={24} />
                </Button>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
};
