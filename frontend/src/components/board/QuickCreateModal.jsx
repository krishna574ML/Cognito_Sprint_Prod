import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { createProject } from '../../api';
import Modal from '../common/Modal';

// --- NEW SVG ICON for a polished look ---
const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const QuickCreateModal = () => {
    const { isModalOpen, modalType, closeModal } = useUiStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            closeModal();
            // Reset form on success
            setTitle('');
            setDescription('');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return; // Basic validation
        mutation.mutate({ title, description });
    };

    if (modalType !== 'QUICK_FORM') return null;

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl">
                <div className="flex items-center mb-6">
                    <div className="p-2 bg-green-100 rounded-full">
                       <BoltIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 ml-4">Quick Capture</h2>
                </div>

                <p className="text-gray-500 mb-6 -mt-2">Instantly capture a new project or idea. You can add the strategic details later.</p>
                
                <div className="space-y-5">
                    <div>
                        <label htmlFor="quick-title" className="text-sm font-semibold text-gray-700">Project Title</label>
                        <input
                            id="quick-title"
                            type="text"
                            placeholder="e.g., Analyze user churn rate for Q2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="quick-desc" className="text-sm font-semibold text-gray-700">Brief Description (Optional)</label>
                        <textarea
                            id="quick-desc"
                            placeholder="A few key notes or objectives..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            rows="4"
                        />
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={closeModal} 
                        className="px-6 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition-all transform hover:scale-105"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default QuickCreateModal;
