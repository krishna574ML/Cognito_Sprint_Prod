import React from 'react';

const Avatar = ({ userId }) => {
  // A simple avatar component. Can be improved with actual user images or initials.
  const getInitials = (username = 'User') => {
      return username.charAt(0).toUpperCase();
  }

  // A simple hashing function to get a consistent color for a user ID
  const getColorForId = (id) => {
    const colors = ['bg-red-200 text-red-800', 'bg-yellow-200 text-yellow-800', 'bg-green-200 text-green-800', 'bg-blue-200 text-blue-800', 'bg-purple-200 text-purple-800', 'bg-pink-200 text-pink-800'];
    return colors[(id || 0) % colors.length];
  };

  return (
    <div 
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getColorForId(userId)}`} 
      title={`User ID: ${userId || 'N/A'}`}
    >
      {/* In a real app, you would fetch the user's name to show initials */}
      <span>U</span>
    </div>
  );
};

export default Avatar;
