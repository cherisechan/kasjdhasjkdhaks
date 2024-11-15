import React from 'react';

export default function RevisionHistoryModal({ revisions, onClose, onRestore }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Revision History</h2>
        <div className="h-[300px] overflow-y-auto">
          {revisions.length > 0 ? (
            <ul className="space-y-2">
              {revisions.map((rev, index) => (
                <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <span className="text-sm text-gray-600">{new Date(rev.timestamp).toLocaleString()}</span>
                  <button
                    onClick={() => {
                      console.log("Restore button clicked");
                      onRestore(rev);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No revisions available.</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
