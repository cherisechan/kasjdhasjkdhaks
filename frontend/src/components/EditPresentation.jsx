import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditThumbnailModal, setShowEditThumbnailModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
    
      try {
        const headers = {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        };

        const response = await axios.get(`http://localhost:5005/store`, headers);
        const presentations = response.data.store.presentations;
        const presentation = presentations.find(pres => pres.id === id);

        if (presentation) {
          setPresentation(presentation);
        } else {
          console.error("Presentation not found");
        }
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };
    
    fetchPresentation();
  }, [id]);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5005/store", headers);
      const store = response.data.store;

      const updatedPresentations = store.presentations.filter(pres => pres.id !== id);
      store.presentations = updatedPresentations;

      await axios.put("http://localhost:5005/store", { store }, headers);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting presentation:", error);
    }
  };

  // Handle title update
  const handleTitleUpdate = async () => {
    if (!newTitle) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5005/store", headers);
      const store = response.data.store;

      const updatedPresentations = store.presentations.map(pres => {
        if (pres.id === id) return { ...pres, name: newTitle };
        return pres;
      });

      store.presentations = updatedPresentations;
      await axios.put("http://localhost:5005/store", { store }, headers);

      setPresentation(prev => ({ ...prev, name: newTitle }));
      setShowEditTitleModal(false);
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  // Handle thumbnail update
  const handleThumbnailUpdate = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const thumbnailData = reader.result;

      try {
        const token = localStorage.getItem("token");
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("http://localhost:5005/store", headers);
        const store = response.data.store;

        // Update the thumbnail in the presentation
        const updatedPresentations = store.presentations.map(pres => {
          if (pres.id === id) return { ...pres, thumbnail: thumbnailData };
          return pres;
        });

        store.presentations = updatedPresentations;
        await axios.put("http://localhost:5005/store", { store }, headers);
        setPresentation(prev => ({ ...prev, thumbnail: thumbnailData }));
      } catch (error) {
        console.error("Error updating thumbnail:", error);
      }
    };
    reader.readAsDataURL(file); // Convert image file to Base64
  };

  return (
    <div className="edit-presentation">
      <h1>Need to fix navbar covering up everything lol</h1>
      <h1>Need to fix navbar covering up everything lol</h1>
      <h1>Need to fix navbar covering up everything lol</h1>
      <h1>Need to fix navbar covering up everything lol</h1>

      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <button onClick={() => navigate("/dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <div className="flex items-center space-x-2">
          {presentation?.thumbnail ? (
            <img src={presentation.thumbnail} alt="Thumbnail" className="w-12 h-12 object-cover"/>
          ) : (
            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Thumbnail</span>
            </div>
          )}

          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Update Thumbnail
            <input type="file" accept="image/*" onChange={handleThumbnailUpdate} className="hidden" />
          </label>
          <h1 className="text-2xl font-bold">{presentation?.name}</h1>
          <button onClick={() => setShowEditTitleModal(true)}>EDIT TITLE</button>
        </div>
        <button onClick={() => setShowDeletePopup(true)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete Presentation</button>
      </div>
      
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">Are you sure?</p>
            <div className="flex justify-end">
              <button onClick={() => setShowDeletePopup(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">No</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Yes</button>
            </div>
          </div>
        </div>
      )}

      {showEditTitleModal && (
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
              <button onClick={() => setShowEditTitleModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={handleTitleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {presentation ? (
        <div className="bg-gray-100 rounded-lg mx-auto mt-8 w-4/5 h-[60vh] flex items-center justify-center">
          <p className="text-center text-gray-600">Slide content for "{presentation.name}" goes here</p>
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
};

export default EditPresentation;
