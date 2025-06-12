import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '../../store/uiStore';
import apiClient from '../../api';
import { ProgressBar } from '../common/ProgressBar';
import { Calendar, User, Flag, Info } from 'lucide-react';

const fetchProjectById = async (projectId) => {
  if (!projectId) return null;
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data;
};

export const ProjectDetailModal = () => {
  const { isProjectDetailModalOpen, closeProjectDetailModal, viewingProjectId } = useUiStore();
  
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', viewingProjectId],
    queryFn: () => fetchProjectById(viewingProjectId),
    enabled: !!viewingProjectId,
  });

  if (!isProjectDetailModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
        {isLoading && <p>Loading project details...</p>}
        {isError && <p className="text-red-500">Error loading project details.</p>}
        {project && (
          <>
            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-6">{project.description}</p>
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-x-6 gap-y-2">
                <span className="flex items-center"><User size={16} className="mr-2" /> Lead: <span className="font-semibold ml-1">{project.lead_name || 'N/A'}</span></span>
                <span className="flex items-center"><Calendar size={16} className="mr-2" /> Due: <span className="font-semibold ml-1">{project.due_date || 'N/A'}</span></span>
                <span className="flex items-center"><Info size={16} className="mr-2" /> Status: <span className="font-semibold ml-1">{project.status}</span></span>
                <span className="flex items-center"><Flag size={16} className="mr-2" /> Impact: <span className="font-semibold ml-1">{project.priority}</span></span>
            </div>
            <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Overall Progress</h4>
                <ProgressBar progress={project.progress || 0} />
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={closeProjectDetailModal} className="px-6 py-2 bg-gray-200 font-semibold rounded-lg">Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
