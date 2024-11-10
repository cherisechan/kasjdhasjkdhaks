import React from 'react';

const DeleteSlidePopup = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed z-[999] inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Slide</h2>
        <p>Are you sure you want to delete this slide?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSlidePopup;
