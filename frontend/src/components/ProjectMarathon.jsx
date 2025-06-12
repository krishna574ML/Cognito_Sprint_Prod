import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api';
import { Column } from './board/Column';

const fetchProjects = async () => {
    const { data } = await apiClient.get('/projects');
    return data;
};

const updateProjectStatus = async ({ projectId, newStatus }) => {
    const { data } = await apiClient.put(`/projects/${projectId}`, { status: newStatus });
    return data;
};

export const ProjectMarathon = () => {
    const queryClient = useQueryClient();
    const { data: projects = [], isLoading, isError } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const mutation = useMutation({
      mutationFn: updateProjectStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
    });

    const statuses = ["To Do", "In Progress", "Blocked", "In Review", "Done"];

    if (isLoading) return <div>Loading projects...</div>;
    if (isError) return <div>Error fetching projects. Make sure the backend is running.</div>;

    const projectsByColumn = statuses.reduce((acc, status) => {
        acc[status] = projects.filter(p => p.status === status);
        return acc;
    }, {});

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-600">Project Marathon</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto p-4 rounded-lg">
                {statuses.map(status => (
                    <Column
                        key={status}
                        title={status}
                        projects={projectsByColumn[status]}
                        onMoveProject={mutation.mutate}
                    />
                ))}
            </div>
        </section>
    );
};
