import React from 'react';

// A reusable Modal component that provides the overlay and content shell.
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay, which closes the modal when clicked
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* Modal content container */}
      <div
        className="bg-white rounded-lg shadow-2xl relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        {/* Close button in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-3xl font-light z-10"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* The content of the modal, passed in as children */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
