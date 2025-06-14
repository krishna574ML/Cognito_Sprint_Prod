import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { updateProject } from '../../api'; // Make sure this is imported
import Avatar from '../common/Avatar';

const Card = ({ project, isNew }) => {
  const { openProjectDetailModal } = useUiStore();
  const [isAnimating, setIsAnimating] = useState(isNew);
  const queryClient = useQueryClient();

  // --- Animation Logic ---
  useEffect(() => {
    if (isNew) {
      // After the animation plays, remove the class so it doesn't re-animate on every render
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  // --- API Mutation for updating project status ---
  const updateMutation = useMutation({
    mutationFn: ({ projectId, data }) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleStartProject = (e) => {
    e.stopPropagation(); // Prevent the modal from opening when this button is clicked
    updateMutation.mutate({ projectId: project.id, data: { status: 'In Progress' } });
  };

  // --- UI Helper for Priority Styling ---
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'High': return { text: 'High Priority', color: 'bg-red-100 text-red-800' };
      case 'Medium': return { text: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' };
      case 'Low': return { text: 'Low Priority', color: 'bg-green-100 text-green-800' };
      default: return { text: 'Standard Priority', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  const priorityInfo = getPriorityInfo(project.priority);

  return (
    <div 
        className={`bg-white rounded-xl p-5 shadow-lg flex flex-col justify-between min-h-[220px] hover:shadow-2xl hover:-translate-y-1.5 ring-2 ring-transparent hover:ring-blue-500 transition-all duration-300 cursor-pointer 
                   ${isAnimating ? 'animate-pop-in' : ''}`}
        onClick={() => openProjectDetailModal(project)}
    >
        {/* Card Header */}
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-gray-900 pr-2">{project.title}</h3>
            {project.emotional_tag && (
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full flex-shrink-0">{project.emotional_tag}</span>
            )}
        </div>
        
        {/* Card Body */}
        <div className="my-3">
            <p className="text-gray-600 text-sm line-clamp-2">
                <span className="font-semibold text-gray-800">Goal:</span> {project.goal || "No goal defined."}
            </p>
        </div>

        {/* Card Footer */}
        <div className="border-t-2 border-dashed border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-4">
                 <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityInfo.color}`}>
                    {priorityInfo.text}
                </div>
                <Avatar userId={project.lead_id} />
            </div>
             {project.status === 'To Do' && (
                <button 
                    onClick={handleStartProject}
                    disabled={updateMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg disabled:opacity-50 transition-all transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {updateMutation.isPending ? 'Starting...' : 'Start Progress'}
                </button>
            )}
        </div>
    </div>
  );
};

export default Card;
