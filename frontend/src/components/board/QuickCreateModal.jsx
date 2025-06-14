import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { createProject } from '../../api';
import Modal from '../common/Modal';

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
            setTitle('');
            setDescription('');
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ title, description });
    };
    if (modalType !== 'QUICK_FORM') return null;
    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-2xl font-bold mb-4">Quick Create Project</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required/>
                    <textarea placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows="4"/>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="px-4 py-2 rounded text-gray-700">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
export default QuickCreateModal;
