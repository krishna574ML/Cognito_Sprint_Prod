import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import Avatar from '../common/Avatar';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { openModal } = useUiStore();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
      <h1 className="text-xl font-bold text-gray-800">Cognito Sprint Kanban</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => openModal('CREATE_CHOICE')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          + New
        </button>
        {user && (
          <div className="flex items-center gap-3">
            <Avatar userId={user.id} />
            <span className="font-semibold">{user.username}</span>
            <button onClick={logout} className="text-sm text-gray-600 hover:text-blue-600">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
