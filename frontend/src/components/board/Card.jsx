import React from 'react';
import { useUiStore } from '../../store/uiStore';
import Avatar from '../common/Avatar';
import ProgressBar from '../common/ProgressBar';

const Card = ({ project }) => {
  const { openProjectDetailModal } = useUiStore();

  const handleCardClick = () => {
    openProjectDetailModal(project);
  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow">
        <h3 className="font-semibold">{project.title}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate">{project.goal || "No goal defined."}</p>
        <div className="mt-4">
            <ProgressBar percentage={project.progress || 0} />
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded-full">{project.priority || 'Medium'}</span>
                <Avatar userId={project.lead_id} />
            </div>
        </div>
    </div>
  );
};

export default Card;
