import React from 'react';
import { useUiStore } from '../../store/uiStore';
import Modal from '../common/Modal';

const CreationChoiceModal = () => {
    const { isModalOpen, modalType, closeModal, openModal } = useUiStore();
    if (modalType !== 'CREATE_CHOICE') return null;
    const selectOption = (type) => {
        closeModal();
        setTimeout(() => openModal(type), 150);
    };
    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="p-8 text-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How do you want to begin?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <button onClick={() => selectOption('IGNITION_SEQUENCE')} className="p-6 border rounded-lg hover:bg-white text-left">
                        <h3 className="font-bold text-lg text-blue-600">🚀 Guided Ignition</h3>
                        <p className="text-gray-600 mt-2 text-sm">A step-by-step thinking lab to deconstruct complex problems.</p>
                    </button>
                    <button onClick={() => selectOption('QUICK_FORM')} className="p-6 border rounded-lg hover:bg-white text-left">
                        <h3 className="font-bold text-lg text-green-600">⚡ Quick Create</h3>
                        <p className="text-gray-600 mt-2 text-sm">A simple form to quickly capture a new project or task.</p>
                    </button>
                </div>
            </div>
        </Modal>
    );
};
export default CreationChoiceModal;
