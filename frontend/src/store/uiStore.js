import { create } from 'zustand';

export const useUiStore = create((set) => ({
  // --- New Project Modal (Existing) ---
  isNewProjectModalOpen: false,
  openNewProjectModal: () => set({ isNewProjectModalOpen: true }),
  closeNewProjectModal: () => set({ isNewProjectModalOpen: false }),

  // --- Project Detail Modal (Add these new lines) ---
  isProjectDetailModalOpen: false,
  viewingProjectId: null,
  openProjectDetailModal: (projectId) => set({ isProjectDetailModalOpen: true, viewingProjectId: projectId }),
  closeProjectDetailModal: () => set({ isProjectDetailModalOpen: false, viewingProjectId: null }),
}));