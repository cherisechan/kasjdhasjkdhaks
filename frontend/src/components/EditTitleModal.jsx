import React from 'react';

const EditTitleModal = ({ newTitle, setNewTitle, onCancel, onSave }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <h2 className="text-xl font-semibold mb-4">Edit presentation title</h2>
      <input
        type="text"
        className="border rounded w-full px-3 py-2"
        placeholder="Enter new title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <div className="flex justify-end mt-4">
        <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Cancel</button>
        <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  </div>
);

export default EditTitleModal;
