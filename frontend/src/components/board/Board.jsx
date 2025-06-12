import React from 'react';
import { Folder, CheckSquare, MoveRight } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { ProgressBar } from '../common/ProgressBar';
import { useUiStore } from '../../store/uiStore';
import { Button } from '../common/Button';

export const Card = ({ project, onMoveProject }) => {
    const openProjectDetailModal = useUiStore((state) => state.openProjectDetailModal);

    const impactColors = {
        Critical: "bg-red-500", High: "bg-orange-500",
        Medium: "bg-yellow-500", Low: "bg-green-500",
    };
    const leadName = project.lead_name || 'N/A';
    const progress = 0; // Simplified for now
    const subtaskSummary = '0/0';

    const handleMoveClick = (e) => {
        e.stopPropagation(); 
        onMoveProject({ projectId: project.id, newStatus: 'In Progress' });
    };

    return (
        <div 
          onClick={() => openProjectDetailModal(project.id)}
          className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-200 transition-all duration-200 hover:shadow-xl hover:border-blue-500 cursor-pointer"
        >
            <h4 className="text-lg font-medium text-gray-900 truncate flex items-center">
                <Folder size={16} className="inline-block mr-2" />
                <span>{project.title}</span>
            </h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={project.description}>
                {project.description || 'No description.'}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                    <Avatar name={leadName} color="bg-indigo-500" size="sm" />
                    <span>{leadName}</span>
                </div>
                <span>Due: {project.due_date || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                    <span className={`w-2.5 h-2.5 rounded-full mr-1 ${impactColors[project.priority || 'Medium']}`}></span>
                    <span>{project.priority || 'Medium'} Impact</span>
                </div>
                <div className="flex items-center">
                    <CheckSquare size={14} className="mr-1" />
                    <span>{subtaskSummary}</span>
                </div>
            </div>
            <ProgressBar progress={progress} />

            {project.status === 'To Do' && (
                <div className="border-t border-gray-200 mt-4 pt-3">
                    <Button
                      onClick={handleMoveClick}
                      variant="secondary"
                      className="w-full"
                      icon={MoveRight}
                    >
                        Move to In Progress
                    </Button>
                </div>
            )}
        </div>
    );
};
