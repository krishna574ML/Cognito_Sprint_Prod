import React from 'react';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useUiStore } from '../../store/uiStore'; // Import the store

export const Header = () => {
  const openNewProjectModal = useUiStore((state) => state.openNewProjectModal); // Get the action

  return (
    <header className="bg-white shadow-lg p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-blue-600">Marathon 🏃</h1>
        <div className="flex items-center space-x-4">
            {/* Add the onClick handler */}
            <Button onClick={openNewProjectModal} icon={Plus} variant="primary">New</Button>
            <Avatar name="Cognito User" color="bg-indigo-500" />
        </div>
    </header>
  );
};