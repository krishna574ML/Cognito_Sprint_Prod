import React from 'react';
import { useQuery } from '@tanstack/react-query';
// Corrected import: 'Avatar' is a default export.
import Column from './Column';
import { fetchProjects } from '../../api';

const Board = () => {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  if (isLoading) return <div>Loading projects...</div>;
  if (isError) return <div>Error fetching projects.</div>;

  const columns = {
    'To Do': projects?.filter((p) => p.status === 'To Do') || [],
    'In Progress': projects?.filter((p) => p.status === 'In Progress') || [],
    'In Review': projects?.filter((p) => p.status === 'In Review') || [],
    'Completed': projects?.filter((p) => p.status === 'Completed') || [],
  };

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {Object.entries(columns).map(([status, projectList]) => (
        <Column key={status} status={status} projects={projectList} />
      ))}
    </div>
  );
};

export default Board;
