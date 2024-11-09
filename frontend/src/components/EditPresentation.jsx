import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EditPresentation = () => {
  console.log("EditPresentation component is rendering");
  const { id } = useParams();  // Get the ID from the URL
  const [presentation, setPresentation] = useState(null);
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
    
      try {
        const headers = {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.get(`http://localhost:5005/store`, headers);
        const presentations = response.data.store.presentations;
        const presentation = presentations.find(pres => pres.id === id);

        if (presentation) {
          console.log("presentation found")
          setPresentation(presentation);
          // console.log(presentation.name)
          console.log("Presentation data:", presentation);
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

  return (
    <div className="edit-presentation">
      <h1>Need to fix navbar covering up everything lol</h1>
      <h1>Need to fix navbar covering up everything lol</h1>
      <h1>Need to fix navbar covering up everything lol</h1>
      <h1>Need to fix navbar covering up everything lol</h1>

      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <button onClick={() => navigate("/dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <div className="flex">
          <p>edit thumbnail</p>
          <p>{presentation?.name || "Loading..."}</p>
          <p>edit title</p>
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
