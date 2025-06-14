import React from 'react';
import { useUiStore } from '../../store/uiStore';
import Modal from '../common/Modal';

// --- NEW SVG ICONS for a more polished look ---
const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);


const CreationChoiceModal = () => {
    const { isModalOpen, modalType, closeModal, openModal } = useUiStore();

    if (modalType !== 'CREATE_CHOICE') return null;

    const selectOption = (type) => {
        closeModal();
        setTimeout(() => openModal(type), 150); // Short delay for a smoother transition
    };

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="p-8 text-center bg-slate-50 rounded-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Ignite a New Project</h2>
                <p className="text-gray-600 mb-8">Choose a starting point that fits your current headspace.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* --- Option 1: Guided Ignition --- */}
                    <div 
                        onClick={() => selectOption('IGNITION_SEQUENCE')} 
                        className="p-8 border-2 border-transparent rounded-lg bg-white shadow-lg hover:shadow-2xl hover:border-blue-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <RocketIcon />
                        <h3 className="font-bold text-xl text-gray-900">Deep Dive & Strategize</h3>
                        <p className="text-gray-500 mt-3 text-sm">Use the guided thinking lab to deconstruct a complex problem into a clear, actionable plan.</p>
                    </div>

                    {/* --- Option 2: Quick Create --- */}
                    <div 
                        onClick={() => selectOption('QUICK_FORM')} 
                        className="p-8 border-2 border-transparent rounded-lg bg-white shadow-lg hover:shadow-2xl hover:border-green-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <BoltIcon />
                        <h3 className="font-bold text-xl text-gray-900">Quick Capture</h3>
                        <p className="text-gray-500 mt-3 text-sm">Instantly capture a task or idea when you're short on time. You can add details later.</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreationChoiceModal;
