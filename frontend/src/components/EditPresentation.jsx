import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DeletePopup from './DeletePopup';
import EditTitleModal from './EditTitleModal';
import EditThumbnailModal from './EditThumbnailModal';

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [showEditThumbnailModal, setShowEditThumbnailModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (!getToken) {
      navigate("/login");
    } else {
      setToken(getToken);
    }
  }, [navigate]);

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

  // Function to save the updated presentation to the server
  const savePresentation = async (updatedPresentation) => {
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5005/store", headers);
      const store = response.data.store;

      const updatedPresentations = store.presentations.map(pres => {
        if (pres.id === id) return updatedPresentation;
        return pres;
      });

      store.presentations = updatedPresentations;
      await axios.put("http://localhost:5005/store", { store }, headers);
    } catch (error) {
      console.error("Error saving presentation:", error);
    }
  };

  // Handle creating a new slide
  const handleCreateSlide = async () => {
    if (!presentation) return;

    const newSlide = {
      background: {
        colour: "#FFFFFF",
        img: null
      },
      elements: []
    };

    const updatedPresentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide]
    };

    setPresentation(updatedPresentation);
    setCurrentSlideIndex(updatedPresentation.slides.length - 1);

    await savePresentation(updatedPresentation);
  };

  // Handle navigation between slides
  const goToNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      goToNextSlide();
    } else if (event.key === 'ArrowLeft') {
      goToPreviousSlide();
    }
  }, [currentSlideIndex, presentation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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

        const updatedPresentations = store.presentations.map(pres => {
          if (pres.id === id) return { ...pres, thumbnail: thumbnailData };
          return pres;
        });

        store.presentations = updatedPresentations;
        await axios.put("http://localhost:5005/store", { store }, headers);
        setPresentation(prev => ({ ...prev, thumbnail: thumbnailData }));
        setShowEditThumbnailModal(false);
      } catch (error) {
        console.error("Error updating thumbnail:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle thumbnail removal
  const handleRemoveThumbnail = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5005/store", headers);
      const store = response.data.store;

      const updatedPresentations = store.presentations.map(pres => {
        if (pres.id === id) return { ...pres, thumbnail: null };
        return pres;
      });

      store.presentations = updatedPresentations;
      await axios.put("http://localhost:5005/store", { store }, headers);
      setPresentation(prev => ({ ...prev, thumbnail: null }));
      setShowEditThumbnailModal(false);
    } catch (error) {
      console.error("Error removing thumbnail:", error);
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
        <div className="flex items-center space-x-2">
          {presentation?.thumbnail ? (
            <img src={presentation.thumbnail} alt="Thumbnail" className="w-12 h-12 object-cover"/>
          ) : (
            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Thumbnail</span>
            </div>
          )}

          <button onClick={() => setShowEditThumbnailModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Update Thumbnail</button>
          <h1 className="text-2xl font-bold">{presentation?.name}</h1>
          <button onClick={() => setShowEditTitleModal(true)}>EDIT TITLE</button>
        </div>
        <button onClick={() => setShowDeletePopup(true)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete Presentation</button>
      </div>
      
      {showDeletePopup && (
        <DeletePopup
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={handleDelete}
        />
      )}

      {showEditTitleModal && (
        <EditTitleModal
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onCancel={() => setShowEditTitleModal(false)}
          onSave={handleTitleUpdate}
        />
      )}

      {showEditThumbnailModal && (
        <EditThumbnailModal
          onFileChange={handleThumbnailUpdate}
          onRemoveThumbnail={handleRemoveThumbnail}
          onCancel={() => setShowEditThumbnailModal(false)}
        />
      )}

      {presentation ? (
        <div className="bg-gray-100 rounded-lg mx-auto h-[70vh] flex flex-col items-center justify-center">
          {/* Slide content */}
          <div className="w-full h-full flex items-center justify-center">
            {/* Render the current slide's content here */}
            <p className="text-center text-gray-600">
              Slide {currentSlideIndex + 1} of {presentation.slides.length}
            </p>
            <p className="absolute bottom-20 left-5 w-[50px] h-[50px] flex items-center justify-center text-[1em] text-gray-700 bg-white">
              {currentSlideIndex + 1}
            </p>
          </div>

          {/* Navigation controls */}
          {presentation.slides.length > 1 && (
            <div className="flex justify-center mt-4">
              <button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0} className={`px-4 py-2 rounded-l ${currentSlideIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-500 text-white'}`}>
                &lt; Previous
              </button>
              <button onClick={goToNextSlide} disabled={currentSlideIndex === presentation.slides.length - 1} className={`px-4 py-2 rounded-r ${currentSlideIndex === presentation.slides.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-500 text-white'}`}>
                Next &gt;
              </button>
            </div>
          )}

          {/* Create new slide button */}
          <button onClick={handleCreateSlide} className="bg-violet-500 text-white px-4 py-2 rounded mt-4">+</button>
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
};

export default EditPresentation;
