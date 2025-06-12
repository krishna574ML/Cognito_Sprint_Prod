import React from 'react';

export function ProgressBar({ progress }) {
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
