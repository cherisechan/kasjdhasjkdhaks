const EditThumbnailModal = ({ onFileChange, onRemoveThumbnail, onCancel }) => (
  <div className="fixed z-[999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <h2 className="text-xl font-semibold mb-4">Edit Thumbnail</h2>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="border rounded w-full px-3 py-2 mb-4"
        aria-label="Choose file"
      />
      <div className="flex justify-end">
        <button onClick={onRemoveThumbnail} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Remove Thumbnail</button>
        <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Cancel</button>
        <button onClick={onFileChange} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  </div>
);

export default EditThumbnailModal;