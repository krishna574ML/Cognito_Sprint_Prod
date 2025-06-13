import React from 'react';
import { useAuthStore } from './store/authStore';
import AuthPage from './components/auth/AuthPage';
import ProjectMarathon from './components/ProjectMarathon'; // Assuming this is your main dashboard view

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <main>
      {token ? (
        // If logged in, show the main application
        <ProjectMarathon /> 
      ) : (
        // If not logged in, show the authentication page
        <AuthPage />
      )}
    </main>
  );
}

export default App;
