import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import apiClient from '../../api';

const addProject = async (newProject) => {
  const { data } = await apiClient.post('/projects', newProject);
  return data;
};

export const NewProjectModal = () => {
  const { isNewProjectModalOpen, closeNewProjectModal } = useUiStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeNewProjectModal();
      setTitle('');
      setDescription('');
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
      alert("Error: Could not create project.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ title, description });
  };

  if (!isNewProjectModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title"
              className="w-full p-3 border border-gray-300 rounded-lg" required
            />
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Project Description (Optional)"
              className="w-full p-3 border border-gray-300 rounded-lg h-24"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={closeNewProjectModal} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
