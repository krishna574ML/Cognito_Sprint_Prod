import React from 'react';
import { useAuthStore } from './store/authStore';
import AuthPage from './components/auth/AuthPage';
import ProjectMarathon from './components/ProjectMarathon';
import CreationChoiceModal from './components/board/CreationChoiceModal';
import QuickCreateModal from './components/board/QuickCreateModal';
// The component is imported from the original NewProjectModal.jsx file
import IgnitionSequenceModal from './components/board/NewProjectModal'; 

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <main>
      {token ? <ProjectMarathon /> : <AuthPage />}
      
      {/* Render all global modals here */}
      <CreationChoiceModal />
      <QuickCreateModal />
      <IgnitionSequenceModal />
    </main>
  );
}

export default App;
