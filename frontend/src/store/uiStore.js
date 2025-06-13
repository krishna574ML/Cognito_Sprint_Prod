import { create } from 'zustand';

// This file manages the state of UI components, like modals.
export const useUiStore = create((set) => ({
  // State for the "New Project" modal
  isNewProjectModalOpen: false,
  openNewProjectModal: () => set({ isNewProjectModalOpen: true }),
  closeNewProjectModal: () => set({ isNewProjectModalOpen: false }),

  // State for the "Project Detail" modal
  isProjectDetailModalOpen: false,
  selectedProject: null,
  openProjectDetailModal: () => set({ isProjectDetailModalOpen: true }),
  closeProjectDetailModal: () => set({ isProjectDetailModalOpen: false }),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));
