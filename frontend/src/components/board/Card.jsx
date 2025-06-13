import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { updateProjectStatus } from '../../api';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

// Helper to get priority color
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const Card = ({ project }) => {
  const { openProjectDetailModal, setSelectedProject } = useUiStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ projectId, status }) => updateProjectStatus(projectId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error("Failed to update project status:", error);
    }
  });

  const handleCardClick = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.parentElement.tagName === 'BUTTON') {
      e.stopPropagation();
      return;
    }
    setSelectedProject(project);
    openProjectDetailModal();
  };

  const handleStartProject = () => {
    mutation.mutate({ projectId: project.id, status: 'In Progress' });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg p-4 shadow cursor-pointer flex flex-col justify-between min-h-[180px]"
    >
      <div>
        <h3 className="font-semibold">{project.title}</h3>
        <p className="text-sm text-gray-600 mt-2 truncate">{project.description || "No description"}</p>
      </div>
      
      <div className="mt-4">
        <ProgressBar percentage={project.progress || 0} />

        <div className="flex justify-between items-center mt-3 mb-3">
            <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority || 'Medium'}
                </span>
                {project.due_date && (
                    <span className="text-xs text-gray-500">{formatDate(project.due_date)}</span>
                )}
            </div>
            <Avatar userId={project.lead_id} />
        </div>

        {project.status === 'To Do' && (
          <Button 
            onClick={handleStartProject}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'Starting...' : 'Start'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
