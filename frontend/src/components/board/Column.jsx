import React from 'react';
// Corrected import: 'Card' is a default export, so it doesn't use curly braces.
import Card from './Card';

const Column = ({ status, projects }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
      <h2 className="font-bold text-lg mb-4 capitalize">{status} ({projects.length})</h2>
      <div className="space-y-4 min-h-[400px]">
        {projects.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Column;
