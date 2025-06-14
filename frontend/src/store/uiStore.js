import { create } from 'zustand';

export const useUiStore = create((set) => ({
  isModalOpen: false,
  modalType: null, // e.g., 'CREATE_CHOICE', 'IGNITION_SEQUENCE', 'QUICK_FORM'
  
  openModal: (type) => set({ isModalOpen: true, modalType: type }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),

  isProjectDetailModalOpen: false,
  selectedProject: null,
  openProjectDetailModal: (project) => set({ isProjectDetailModalOpen: true, selectedProject: project }),
  closeProjectDetailModal: () => set({ isProjectDetailModalOpen: false, selectedProject: null }),
}));
