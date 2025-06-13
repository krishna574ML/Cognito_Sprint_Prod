import React from 'react';

const ProgressBar = ({ percentage }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${safePercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
