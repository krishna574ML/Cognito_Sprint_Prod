import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { deleteProject } from '../../api'; // This import will now work correctly
import Modal from '../common/Modal';

const ProjectDetailModal = () => {
    const { isProjectDetailModalOpen, selectedProject, closeProjectDetailModal } = useUiStore();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    
    const [confirmText, setConfirmText] = useState("");

    const isLead = user?.id === selectedProject?.lead_id;

    const deleteMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            closeProjectDetailModal();
        }
    });

    const handleDelete = () => {
        if (confirmText === selectedProject?.title) {
            deleteMutation.mutate(selectedProject.id);
        }
    };
    
    // Reset confirmation text when the modal is closed or the project changes
    React.useEffect(() => {
        if (!isProjectDetailModalOpen) {
            setConfirmText("");
        }
    }, [isProjectDetailModalOpen]);

    if (!isProjectDetailModalOpen || !selectedProject) return null;

    return (
        <Modal isOpen={isProjectDetailModalOpen} onClose={closeProjectDetailModal}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
                <p className="text-gray-600 mb-6">{selectedProject.goal || "No goal defined."}</p>
                {/* Other project details (tasks, members) would go here */}

                {/* --- DANGER ZONE FOR DELETION --- */}
                {isLead && (
                    <div className="mt-8 border-t-2 border-red-200 pt-4">
                        <h3 className="font-bold text-red-600">Danger Zone</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Deleting a project is permanent and cannot be undone.
                        </p>
                        <div className="mt-4">
                            <label className="font-semibold text-gray-700">
                                To confirm, type the project title: <strong className="text-red-700">{selectedProject.title}</strong>
                            </label>
                            <input 
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                            />
                            <button
                                onClick={handleDelete}
                                disabled={confirmText !== selectedProject.title || deleteMutation.isPending}
                                className="w-full mt-2 px-4 py-2 bg-red-600 text-white font-bold rounded-md disabled:bg-red-300"
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Delete This Project Forever"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ProjectDetailModal;
