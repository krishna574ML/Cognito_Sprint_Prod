import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { createProject } from '../../api';
import Modal from '../common/Modal';

const NewProjectModal = () => {
  const { isNewProjectModalOpen, closeNewProjectModal } = useUiStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeNewProjectModal();
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, description, priority, due_date: dueDate });
  };

  return (
    <Modal isOpen={isNewProjectModalOpen} onClose={closeNewProjectModal}>
      <form onSubmit={handleSubmit} className="p-6">
        <h2 className="text-2xl font-bold mb-4">New Project</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
          <div className="flex gap-4">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={closeNewProjectModal} className="px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewProjectModal;
