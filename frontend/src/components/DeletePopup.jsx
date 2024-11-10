import React from 'react'

const DeletePopup = ({ onCancel, onConfirm }) => (
  <div className="fixed z-[999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <p className="text-lg mb-4">Are you sure?</p>
      <div className="flex justify-end">
        <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">No</button>
        <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Yes</button>
      </div>
    </div>
  </div>
);

export default DeletePopup