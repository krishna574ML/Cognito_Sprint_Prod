import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import { updateProject } from '../../api';
import Avatar from '../common/Avatar';

const Card = ({ project, isNew }) => {
  const { openProjectDetailModal } = useUiStore();
  const [isAnimating, setIsAnimating] = useState(isNew);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const updateMutation = useMutation({
    mutationFn: ({ projectId, data }) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleStartProject = (e) => {
    e.stopPropagation();
    updateMutation.mutate({ projectId: project.id, data: { status: 'In Progress' } });
  };

  const handleLogUpdate = (e) => {
    e.stopPropagation();
    // This would open a new, specialized modal for logging updates.
    // For now, it opens the existing detail modal.
    openProjectDetailModal(project);
  };

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'High': return { text: 'High', color: 'bg-red-100 text-red-800' };
      case 'Medium': return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 'Low': return { text: 'Low', color: 'bg-green-100 text-green-800' };
      default: return { text: 'Standard', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  const priorityInfo = getPriorityInfo(project.priority);
  const isInProgress = project.status === 'In Progress';

  return (
    <div 
        className={`bg-white rounded-xl p-5 shadow-lg flex flex-col justify-between min-h-[200px] hover:shadow-2xl hover:-translate-y-1.5 ring-2 ring-transparent hover:ring-blue-500 transition-all duration-300 cursor-pointer 
                   ${isAnimating ? 'animate-pop-in' : ''}`}
        onClick={() => openProjectDetailModal(project)}
    >
        {/* Card Header */}
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-gray-900 pr-2">{project.title}</h3>
            {isInProgress ? (
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-700">ACTIVE</span>
                </div>
            ) : (
                 project.emotional_tag && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full flex-shrink-0">{project.emotional_tag}</span>
                )
            )}
        </div>
        
        {/* Card Body */}
        {isInProgress ? (
            <div className="my-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none" style={{ width: `${project.progress || 0}%` }}>
                       {project.progress || 0}%
                    </div>
                </div>
            </div>
        ) : (
            <div className="my-3">
                <p className="text-gray-600 text-sm line-clamp-2">
                    <span className="font-semibold text-gray-800">Goal:</span> {project.goal || "No goal defined."}
                </p>
            </div>
        )}

        {/* Card Footer */}
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
             <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityInfo.color}`}>
                {priorityInfo.text}
            </div>
             {project.status === 'To Do' ? (
                <button onClick={handleStartProject} disabled={updateMutation.isPending} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Start →
                </button>
             ) : (
                <button onClick={handleLogUpdate} className="text-sm font-semibold text-gray-600 hover:text-black">
                    Log Update
                </button>
             )}
        </div>
    </div>
  );
};

export default Card;
