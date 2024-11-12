import React from 'react';

const CannotDeleteSlidePopup = ({ onCancel, onDeletePresentation }) => {
  return (
    <div className="fixed z-[999] inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Cannot Delete Slide</h2>
        <p>You cannot delete the only slide in the presentation. Would you like to delete the entire presentation instead?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={onDeletePresentation} className="bg-red-500 text-white px-4 py-2 rounded">Delete Presentation</button>
        </div>
      </div>
    </div>
  );
};

export default CannotDeleteSlidePopup;
