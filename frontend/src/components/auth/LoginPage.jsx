import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore'; // Corrected import path
import { Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';

// This component replaces the original LoginPage.jsx
// It offers a more modern and visually appealing design.
const LoginPage = ({ onSwitchForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const { isLoading, error } = useAuthStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Panel: Decorative */}
        <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-bold mb-3">Welcome Back</h1>
            <p className="text-indigo-200 mb-8">Log in to continue your journey with Cognito Sprint.</p>
            <div className="w-32 h-1 bg-indigo-300 rounded-full"></div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Login</h2>
            <p className="text-gray-500 mb-8">Enter your credentials to access your board.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your_username"
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg">
                        <AlertTriangle className="h-5 w-5 mr-3" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Logging in...</span>
                        </>
                    ) : (
                       <>
                           <LogIn className="h-5 w-5" />
                           <span>Login</span>
                       </>
                    )}
                </button>
            </form>

            {/* Switch to Register */}
            <p className="text-center text-sm text-gray-600 mt-8">
                Don't have an account?{' '}
                <button onClick={onSwitchForm} className="text-blue-600 hover:underline font-semibold focus:outline-none">
                    Sign up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
