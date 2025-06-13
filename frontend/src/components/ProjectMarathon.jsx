import React from 'react';
import Header from './layout/Header';
import Board from './board/Board';
import NewProjectModal from './board/NewProjectModal';
import ProjectDetailModal from './board/ProjectDetailModal';

// This component is the main dashboard layout
const ProjectMarathon = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-grow overflow-x-auto">
        <Board />
      </div>
      {/* Modals are rendered here so they can be triggered from anywhere */}
      <NewProjectModal />
      <ProjectDetailModal />
    </div>
  );
};

export default ProjectMarathon;
