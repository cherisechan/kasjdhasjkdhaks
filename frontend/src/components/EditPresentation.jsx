import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DeletePopup from './DeletePopup';
import EditTitleModal from './EditTitleModal';
import EditThumbnailModal from './EditThumbnailModal';
import DeleteSlidePopup from './DeleteSlidePopup';
import CannotDeleteSlidePopup from './CannotDeleteSlidePopup';
import { PencilIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import Slide from "./Slide";
import TextCreateModal from "./TextCreateModal";
import BackgroundModal from "./BackgroundModal";
import uniqid from "uniqid";

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteSlidePopup, setShowDeleteSlidePopup] = useState(false);
  const [showCannotDeleteSlidePopup, setShowCannotDeleteSlidePopup] = useState(false);
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
    localStorage.setItem("pId", id);
  }, [id])

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
        setSlides(presentation.slides);
      } else {
        console.error("Presentation not found");
      }
    } catch (error) {
      console.error("Error fetching presentation:", error);
    }
  };
  useEffect(() => {    
    fetchPresentation();
  }, [id]);

  // Function to save the updated presentation to the server
  const savePresentation = async (updatedPresentation) => {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
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

    // set the updated presentation
    const res = await axios.get("http://localhost:5005/store", headers);
    const updatedPres = res.data.store.presentations.find(pres => pres.id === id);
    if (updatedPres) {
      setPresentation(updatedPres);
      setSlides(updatedPres.slides);
    }   
  };

  // Handle creating a new slide
  const handleCreateSlide = async () => {
    if (!presentation) return;
    const headers = {
        headers: {
          'Authorization': `Bearer ${token}`,
      }
    };
    const response = await axios.get(`http://localhost:5005/store`, headers);
    const presentations = response.data.store.presentations;
    const pres = presentations.find(pres => pres.id === id);
    if (!pres) {
      return;
    }
    const newSlide = {
      id: uniqid(),
      background: pres.defaultBackground,
      elements: []
    };

    const updatedPresentation = {
      ...pres,
      slides: [...pres.slides, newSlide]
    };

    setPresentation(updatedPresentation);

    await savePresentation(updatedPresentation);
  };

  // Handle deleting the current slide
  const handleDeleteSlide = async () => {
    if (!presentation) return;

    // Proceed to delete the current slide
    const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);

    const updatedPresentation = {
      ...presentation,
      slides: updatedSlides
    };

    // Adjust the currentSlideIndex
    let newSlideIndex = currentSlideIndex;
    if (currentSlideIndex >= updatedSlides.length) {
      newSlideIndex = updatedSlides.length - 1;
    }

    setPresentation(updatedPresentation);
    setCurrentSlideIndex(newSlideIndex);
    setShowDeleteSlidePopup(false);

    // Save the updated presentation to the server
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

  // adds element to slide
  const addElem = async (elemObj) => {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get("http://localhost:5005/store", headers);
    const store = response.data.store;
    store.presentations.map(p => {
      if (p.id === id) {
        p.slides[currentSlideIndex].elements.unshift(elemObj);
      }
    })
    await axios.put("http://localhost:5005/store", {store}, headers);
    const updatedRes = await axios.get("http://localhost:5005/store", headers);
    const presentation = updatedRes.data.store.presentations.find(pres => pres.id === id);
    if (presentation) {
      setPresentation(presentation);
      setSlides(presentation.slides);
    }
  }

  const editElem = async (elemObj, elemId) => {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get("http://localhost:5005/store", headers);
    const store = response.data.store;
    store.presentations.map(p => {
      if (p.id === id) {
        let updateElem = p.slides[currentSlideIndex].elements.find(e => e.id === elemId);
        if (updateElem) {
          Object.assign(updateElem, elemObj);
        }
      }
    })
    await axios.put("http://localhost:5005/store", {store}, headers);
    const updatedRes = await axios.get("http://localhost:5005/store", headers);
    const presentation = updatedRes.data.store.presentations.find(pres => pres.id === id);
    if (presentation) {
      setPresentation(presentation);
      setSlides(presentation.slides);
    }
  }

  // add text element
  const [showTextCreateModal, setShowTextCreateModal] = useState(false);
  const [textBoxText, setTextBoxText] = useState("");
  const [textBoxWidth, setTextBoxWidth] = useState("");
  const [textBoxHeight, setTextBoxHeight] = useState("");
  const [textBoxFontSize, setTextBoxFontSize] = useState("");
  const [textBoxTextColour, setTextBoxTextColour] = useState("");
  const [textSubmit, setTextSubmit] = useState(false);
  useEffect(() => {
    if (textSubmit) {
      const textElem = {
        "id": uniqid(),
        "type": "text",
        "text": textBoxText,
        "width": textBoxWidth,
        "height": textBoxHeight,
        "fontSize": textBoxFontSize,
        "textColour": textBoxTextColour,
        "x": 0,
        "y": 0
      }
      addElem(textElem);
      setTextSubmit(false);
    }
  }, [textSubmit])

  // updating elements from slide
  const [updateObj, setUpdateObj] = useState(null);
  const [elemId, setElemId] = useState("");
  useEffect(() => {
    if (updateObj) {
      editElem(updateObj, elemId);
      setUpdateObj(null);
    }
  }, [updateObj]);

  // background change
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  // reloading
  const [reload, setReload] = useState(false);
  useEffect(() => {
    fetchPresentation();
    setReload(false);
  }, [reload])

  return (
    <div className="edit-presentation px-2">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto py-4 mt-20">
        <button onClick={() => navigate("/dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>

        <div className="flex items-center space-x-2">
          <div className="relative w-12 h-12">
            {presentation?.thumbnail ? (
              <img src={presentation.thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded" />
            )}
            <button
              onClick={() => setShowEditThumbnailModal(true)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 text-white text-xs rounded"
            >
              <PhotoIcon className="h-6 w-6" />
            </button>
          </div>

          {/* <button onClick={() => setShowEditTitleModal(true)}>TITLE</button> */}
          <button onClick={() => setShowEditTitleModal(true)}>
            <PencilIcon className="h-6 w-6 text-black" />
          </button>
          <h1 className="text-2xl font-bold">{presentation?.name}</h1>
        </div>
        <button onClick={() => setShowDeletePopup(true)} className="bg-red-500 text-white px-4 py-2 rounded">Delete Presentation</button>
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

      {showDeleteSlidePopup && (
        <DeleteSlidePopup
          onCancel={() => setShowDeleteSlidePopup(false)}
          onConfirm={handleDeleteSlide}
        />
      )}

      {showCannotDeleteSlidePopup && (
        <CannotDeleteSlidePopup
          onCancel={() => setShowCannotDeleteSlidePopup(false)}
          onDeletePresentation={() => {
            setShowCannotDeleteSlidePopup(false);
            setShowDeletePopup(true);
          }}
        />
      )}

      {showTextCreateModal && (
        <TextCreateModal
          setSubmitText={setTextBoxText}
          setSubmitWidth={setTextBoxWidth}
          setSubmitHeight={setTextBoxHeight}
          setSubmitFontSize={setTextBoxFontSize}
          setSubmitTextColour={setTextBoxTextColour}
          setTextSubmit={setTextSubmit}
          setShowTextCreateModal={setShowTextCreateModal}
        />
      )}

      {
        showBackgroundModal && <BackgroundModal 
          setShowBackgroundModal={setShowBackgroundModal}
          currSlideIndex={currentSlideIndex}
          setReload={setReload}
        />
      }

      {slides ? (
        <div className="max-w-screen-xl bg-gray-100 rounded-lg mx-auto h-[75vh] flex flex-col items-center justify-center">
          <div className="flex w-[85%] justify-start items-center h-16">
          <button onClick={() => {setShowTextCreateModal(true);}} className="bg-violet-500 text-white px-4 h-10 rounded ml-2">Text</button>
          <button onClick={() => {setShowBackgroundModal(true);}} className="bg-violet-500 text-white px-4 h-10 rounded ml-2">Theme</button>
          </div>
          {/* Slide content */}
          <Slide slide={slides[currentSlideIndex]} currIndex={currentSlideIndex} setUpdateObj={setUpdateObj} setUpdateElemId={setElemId}/>

          {/* Navigation controls */}
          {presentation.slides.length >= 1 && (
            <div className="w-full flex relative h-14 mt-2">
              <p className="absolute left-2 h-10 rounded flex items-center justify-center text-bold whitespace-nowrap text-gray-600">Slide {currentSlideIndex + 1} of {presentation.slides.length}</p>
              <div className="absolute left-[50%] translate-x-[-50%] flex justify-center space-x-2">
                <button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0} className={`w-10 h-10 rounded ${currentSlideIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-500 text-white'}`}>&lt;</button>
                <button onClick={goToNextSlide} disabled={currentSlideIndex === presentation.slides.length - 1} className={`w-10 h-10 rounded ${currentSlideIndex === presentation.slides.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-500 text-white'}`}>&gt;</button>
              </div>
              <div className="absolute right-2 flex justify-center items-center">
                {/* <button className="bg-red-500 text-white w-10 h-10 rounded flex items-center justify-center"> */}
                <button
                  onClick={() => {
                    if (presentation && presentation.slides.length === 1) {
                      setShowCannotDeleteSlidePopup(true);
                    } else {
                      setShowDeleteSlidePopup(true);
                    }
                  }}
                  className="bg-red-500 text-white w-10 h-10 rounded flex items-center justify-center"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button onClick={handleCreateSlide} className="bg-violet-500 text-white w-10 h-10 rounded ml-2">+</button>
              </div>
            </div>
          )}          
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
};

export default EditPresentation;
