import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  // This function will be passed down to the child components to toggle the view
  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div>
      {/* Pass the toggle function as a prop to the currently active component */}
      {isLoginView 
        ? <LoginPage onSwitchForm={toggleView} /> 
        : <RegisterPage onSwitchForm={toggleView} />}
    </div>
  );
};

export default AuthPage;