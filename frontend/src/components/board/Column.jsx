import React from 'react';
import { Card } from './Card';

export const Column = ({ title, projects = [], onMoveProject }) => {
    return (
        <div className="kanban-column bg-gray-100 rounded-xl p-4 border border-gray-200 min-w-[320px] flex-shrink-0 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
            {projects.length === 0 ? (
                <div className="border-dashed border-gray-300 border-2 p-8 text-center text-gray-500 rounded-lg">
                    No projects.
                </div>
            ) : (
                projects.map(project => (
                    <Card 
                        key={project.id} 
                        project={project} 
                        onMoveProject={onMoveProject}
                    />
                ))
            )}
        </div>
    );
};
