import React from 'react';

// Using a standard function declaration which can sometimes be more robust
export function ProgressBar({ progress }) {
  // Define the style object separately for clarity
  const style = {
    width: `${progress}%`
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
        style={style}
      ></div>
    </div>
  );
}