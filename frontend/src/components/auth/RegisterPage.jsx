import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore.js';
import { User, Mail, Lock, UserPlus, AlertTriangle } from 'lucide-react';

// This component replaces the original RegisterPage.jsx
// It offers a more modern and visually appealing design that matches the LoginPage.
const RegisterPage = ({ onSwitchForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuthStore((state) => ({
    register: state.register,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ username, email, password });
    if (success) {
      // On successful registration, switch to the login form
      onSwitchForm();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Add custom animation styles */}
      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideInLeft 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      <div className="w-full max-w-4xl flex flex-col-reverse md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
        
        {/* Left Panel: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Account</h2>
            <p className="text-gray-500 mb-8">Join our community to start collaborating.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-username">
                        Username
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="reg-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="choose_a_username"
                            required
                        />
                    </div>
                </div>

                 {/* Email Input */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-email">
                        Email
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reg-password">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-green-400 transition-all duration-300 transform hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Creating Account...</span>
                        </>
                    ) : (
                       <>
                           <UserPlus className="h-5 w-5" />
                           <span>Sign Up</span>
                       </>
                    )}
                </button>
            </form>

            {/* Switch to Login */}
            <p className="text-center text-sm text-gray-600 mt-8">
                Already have an account?{' '}
                <button onClick={onSwitchForm} className="text-green-600 hover:underline font-semibold focus:outline-none">
                    Log in
                </button>
            </p>
        </div>

        {/* Right Panel: Decorative */}
        <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-green-600 to-teal-700 text-white flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-bold mb-3">Begin Your Sprint</h1>
            <p className="text-teal-200 mb-8">A few details are all we need to get you set up and ready to innovate.</p>
            <div className="w-32 h-1 bg-teal-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
