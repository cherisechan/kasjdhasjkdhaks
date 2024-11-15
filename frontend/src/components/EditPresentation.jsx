import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DeletePopup from './DeletePopup';
import EditTitleModal from './EditTitleModal';
import EditThumbnailModal from './EditThumbnailModal';
import DeleteSlidePopup from './DeleteSlidePopup';
import CannotDeleteSlidePopup from './CannotDeleteSlidePopup';
import { PencilIcon, PhotoIcon, TrashIcon, EyeIcon, ClockIcon } from "@heroicons/react/24/outline";
import Slide from "./Slide";
import TextCreateModal from "./TextCreateModal";
import ImageCreateModal from "./ImageCreateModal";
import VideoCreateModal from "./VideoCreateModal";
import BackgroundModal from "./BackgroundModal";
import uniqid from "uniqid";
import CodeCreateModal from "./CodeCreateModal";
import FontSelector from "./FontSelector";
import RevisionHistoryModal from './RevisionHistoryModal';
import SlideRearrange from "./SlideRearrange";

const EditPresentation = () => {
  const { id } = useParams();
  const { sindex } = useParams();
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
  const [selectedElemId, setSelectedElemId] = useState(null);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [rearrange, setRearrange] = useState(false);

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

  useEffect(() => {
    if (presentation) {
      if (parseInt(sindex) && parseInt(sindex) <= presentation.slides.length) {
        setCurrentSlideIndex(parseInt(sindex) - 1);
      } else {
        navigate(`/design/${id}/${currentSlideIndex + 1}`)
      }
    }
  }, [sindex, presentation])

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

  // New function to fetch revision history
  const fetchRevisionHistory = useCallback(async () => {
    if (!presentation) return;
  
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5005/store`, headers);
      const pres = response.data.store.presentations.find(p => p.id === id);
      if (pres && pres.revisions) {
        const validRevisions = pres.revisions.filter(rev => rev.state && rev.state !== "undefined");
        setRevisions(validRevisions);
      }
    } catch (error) {
      console.error("Error fetching revision history:", error);
    }
  }, [id, token, presentation]);

  // New function to save a revision
  const saveRevision = useCallback(async (presentationToSave) => {
    if (!presentationToSave) return;
  
    // Create a deep copy and exclude 'revisions'
    const { revisions, ...presentationWithoutRevisions } = presentationToSave;
  
    const newRevision = {
      timestamp: new Date().toISOString(),
      state: JSON.stringify(presentationWithoutRevisions)
    };
  
    try {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:5005/store`, headers);
      const store = response.data.store;
      const presIndex = store.presentations.findIndex((p) => p.id === id);
  
      if (presIndex !== -1) {
        if (!store.presentations[presIndex].revisions) {
          store.presentations[presIndex].revisions = [];
        }
        store.presentations[presIndex].revisions.push(newRevision);
  
        // Limit to last 10 revisions
        if (store.presentations[presIndex].revisions.length > 10) {
          store.presentations[presIndex].revisions.shift();
        }
  
        await axios.put("http://localhost:5005/store", { store }, headers);
        fetchRevisionHistory();
      }
    } catch (error) {
      console.error("Error saving revision:", error);
    }
  }, [id, token, fetchRevisionHistory]);
  
  

  // Function to save the updated presentation to the server
  const savePresentation = async (updatedPresentation) => {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      // Fetch the current store
      const response = await axios.get("http://localhost:5005/store", headers);
      const store = response.data.store;
  
      // Find the current presentation
      const currentPresIndex = store.presentations.findIndex(pres => pres.id === updatedPresentation.id);
      if (currentPresIndex === -1) {
        console.error("Presentation not found in store");
        return;
      }
  
      const currentPresentation = store.presentations[currentPresIndex];
  
      // Ensure that updatedPresentation.revisions is up-to-date
      updatedPresentation.revisions = currentPresentation.revisions;
  
      // Update the presentation in the store
      store.presentations[currentPresIndex] = updatedPresentation;
  
      // Save the updated store back to the server
      await axios.put("http://localhost:5005/store", { store }, headers);
    } catch (error) {
      console.error("Error saving presentation:", error);
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
    await saveRevision(updatedPresentation);
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
    navigate(`/design/${id}/${currentSlideIndex + 1}`);
    // Save the updated presentation to the server
    await savePresentation(updatedPresentation);
    await saveRevision(updatedPresentation);
  };

  // Handle navigation between slides
  const goToNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      navigate(`/design/${id}/${currentSlideIndex + 2}`);
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      navigate(`/design/${id}/${currentSlideIndex}`);
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight') {
      goToNextSlide();
    } else if (event.key === 'ArrowLeft') {
      goToPreviousSlide();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedElemId) {
        deleteElem(selectedElemId);
        setSelectedElemId(null);
      }
    }
  }, [currentSlideIndex, presentation, selectedElemId]);

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

      await savePresentation(updatedPresentation);
      await saveRevision(updatedPresentation);
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
        await savePresentation(updatedPresentation);
        await saveRevision(updatedPresentation);
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

      await savePresentation(updatedPresentation);
      await saveRevision(updatedPresentation);
    } catch (error) {
      console.error("Error removing thumbnail:", error);
    }
  };

  // New function to restore a revision
  const handleRestoreRevision = async (revision) => {
    try {
      const restoredState = JSON.parse(revision.state);
  
      // Preserve the current 'revisions' array
      restoredState.revisions = presentation.revisions;
  
      setPresentation(restoredState);
      setSlides(restoredState.slides);
  
      // Save the restored presentation
      await savePresentation(restoredState);
  
      setShowRevisionHistory(false);
    } catch (error) {
      console.error("Error restoring revision:", error);
    }
  };
  

  // Use effect to fetch revision history
  useEffect(() => {
    fetchRevisionHistory();
  }, [fetchRevisionHistory]);

  // adds element to slide
  const addElem = async (elemObj) => {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get("http://localhost:5005/store", headers);
    const store = response.data.store;
    store.presentations.forEach((p) => {
      if (p.id === id) {
        // use .unshift instead of .push if doing bonus and doing custom stacking
        p.slides[currentSlideIndex].elements.push(elemObj);
      }
    });
    await axios.put("http://localhost:5005/store", { store }, headers);
    const updatedRes = await axios.get("http://localhost:5005/store", headers);
    const presentation = updatedRes.data.store.presentations.find((pres) => pres.id === id);
    if (presentation) {
      setPresentation(presentation);
      setSlides(presentation.slides);

      await savePresentation(updatedPresentation);
      await saveRevision(updatedPresentation);
    }
  };

  const editElem = async (elemObj, elemId) => {
    if (!presentation) return;
  
    // Create a deep copy of the current presentation
    const updatedPresentation = JSON.parse(JSON.stringify(presentation));
  
    // Find and update the element in the local presentation
    const elements = updatedPresentation.slides[currentSlideIndex].elements;
    const index = elements.findIndex((e) => e.id === elemId);
    if (index !== -1) {
      elements[index] = { ...elements[index], ...elemObj };
    }
  
    // Update the local state before saving
    setPresentation(updatedPresentation);
    setSlides(updatedPresentation.slides);
  
    // Save the updated presentation to the server
    await savePresentation(updatedPresentation);
  
    // Save a revision
    await saveRevision(updatedPresentation);
  };

  const deleteElem = async (elemId) => {
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get("http://localhost:5005/store", headers);
    const store = response.data.store;
  
    store.presentations.forEach((p) => {
      if (p.id === id) {
        const elements = p.slides[currentSlideIndex].elements;
        p.slides[currentSlideIndex].elements = elements.filter(e => e.id !== elemId);
      }
    });
  
    await axios.put("http://localhost:5005/store", { store }, headers);
  
    const updatedRes = await axios.get("http://localhost:5005/store", headers);
    const presentation = updatedRes.data.store.presentations.find((pres) => pres.id === id);
    if (presentation) {
      setPresentation(presentation);
      setSlides(presentation.slides);
      await savePresentation(updatedPresentation);
      await saveRevision(updatedPresentation);
    }
  };

  // add text element
  const [showTextCreateModal, setShowTextCreateModal] = useState(false);
  const [textElem, setTextElem] = useState(null);
  const [textSubmit, setTextSubmit] = useState(false);
  useEffect(() => {
    if (textSubmit && textElem) {
      addElem(textElem);
      setTextElem(null);
      setTextSubmit(false);
    }
  }, [textSubmit])

  // add image element
  const [showImageCreateModal, setShowImageCreateModal] = useState(false);
  const [imageElem, setImageElem] = useState(null);
  const [imageSubmit, setImageSubmit] = useState(false);
  useEffect(() => {
    if (imageSubmit && imageElem) {
      addElem(imageElem);
      setImageElem(null);
      setImageSubmit(false);
    }
  }, [imageSubmit]);

  // add video element
  const [showVideoCreateModal, setShowVideoCreateModal] = useState(false);
  const [videoElem, setVideoElem] = useState(null);
  const [videoSubmit, setVideoSubmit] = useState(false);
  useEffect(() => {
    if (videoSubmit && videoElem) {
      addElem(videoElem);
      setVideoElem(null);
      setVideoSubmit(false);
    }
  }, [videoSubmit]);

  // add code element
  const [showCodeCreateModal, setShowCodeCreateModal] = useState(false);
  const [codeElem, setCodeElem] = useState(null);
  const [codeSubmit, setCodeSubmit] = useState(false);
  useEffect(() => {
    if (codeSubmit && codeElem) {
      addElem(codeElem);
      setCodeElem(null);
      setCodeSubmit(false);
    }
  }, [codeSubmit])

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
      <div className="max-w-screen-xl flex items-center justify-between mx-auto mt-20 flex-wrap sm:max-h-[20vh]">
        <div className="flex justify-start">
          <button onClick={() => navigate("/dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded font-semibold">Back</button>
        </div>
        <div className="flex items-center space-x-2 justify-center">
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
          <h1 className="text-2xl font-bold max-w-[20vw] truncate">{presentation?.name}</h1>
        </div>

        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => setShowRevisionHistory(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded font-semibold"
          >
            <ClockIcon className="h-6 w-6 text-white" />
            <span>Revision History</span>
          </button>
          <button 
            onClick={() => window.open(`/preview/${id}`, '_blank')}
            className="flex items-center space-x-2 bg-violet-500 text-white px-4 py-2 rounded font-semibold"
          >
            <EyeIcon className="h-6 w-6 text-white" />
            <span>Preview</span>
          </button>
          <button onClick={() => setShowDeletePopup(true)} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded font-semibold" id="delete-pres">
            <TrashIcon className="h-6 w-6 text-white" />
            <span>Delete</span>
          </button>
        </div>
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
          setTextElem={setTextElem}
          setTextSubmit={setTextSubmit}
          setShowTextCreateModal={setShowTextCreateModal}
        />
      )}

      {showImageCreateModal && (
        <ImageCreateModal
          setImageElem={setImageElem}
          setImageSubmit={setImageSubmit}
          setShowImageCreateModal={setShowImageCreateModal}
        />
      )}

      {showVideoCreateModal && (
        <VideoCreateModal
          setVideoElem={setVideoElem}
          setVideoSubmit={setVideoSubmit}
          setShowVideoCreateModal={setShowVideoCreateModal}
        />
      )}

      {
        showBackgroundModal && <BackgroundModal 
          setShowBackgroundModal={setShowBackgroundModal}
          currSlideIndex={currentSlideIndex}
          setReload={setReload}
        />
      }

      {
        showCodeCreateModal && <CodeCreateModal
          setCodeElem={setCodeElem}
          setCodeSubmit={setCodeSubmit}
          setShowCodeCreateModal={setShowCodeCreateModal}
        />
      }

      {showRevisionHistory && (
        <RevisionHistoryModal
          revisions={revisions}
          onClose={() => setShowRevisionHistory(false)}
          onRestore={handleRestoreRevision}
        />
      )}
      {
        rearrange && <SlideRearrange 
          presentation={presentation}
          savePresentation={savePresentation}
          setRearrange={setRearrange}
        />
      }

      {slides ? (
        <div className="max-w-screen-xl bg-gray-200 px-3 rounded-lg mx-auto flex flex-col items-center justify-center">
          <div className="flex w-full justify-start items-center h-16 max-sm:h-32 max-sm:flex-wrap">
            <button onClick={() => {setShowTextCreateModal(true);}} className="bg-violet-500 text-white px-4 h-10 rounded ml-2 font-semibold" id="text-add">Text</button>
            <button onClick={() => setShowImageCreateModal(true)} className="bg-violet-500 text-white px-4 h-10 rounded ml-2 font-semibold">Image</button>
            <button onClick={() => setShowVideoCreateModal(true)} className="bg-violet-500 text-white px-4 h-10 rounded ml-2 font-semibold">Video</button>
            <button onClick={() => {setShowCodeCreateModal(true);}} className="bg-violet-500 text-white px-4 h-10 rounded ml-2 font-semibold">Code</button>
            <button onClick={() => {setShowBackgroundModal(true);}} className="bg-violet-500 text-white px-4 h-10 rounded ml-2 font-semibold">Theme</button>
            <FontSelector setReload={setReload} defaultFont={presentation.fontFamily}/>
          </div>
          {/* Slide content */}
          <div className="w-full max-w-4xl">
            <Slide slide={slides[currentSlideIndex]} currIndex={currentSlideIndex} setUpdateObj={setUpdateObj} setUpdateElemId={setElemId} fontFam={presentation.fontFamily} deleteElem={deleteElem} setSelectedElemId={setSelectedElemId}/>
          </div>

          {/* Navigation controls */}
          {presentation.slides.length >= 1 && (
            <div className="w-full flex relative h-14 mt-2">
              <p className="absolute left-2 h-10 rounded flex items-center justify-center text-bold whitespace-nowrap text-gray-600">Slide {currentSlideIndex + 1} of {presentation.slides.length}</p>
              <div className="absolute left-[50%] translate-x-[-50%] flex justify-center space-x-2">
                <button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0} className={`w-10 h-10 rounded ${currentSlideIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-500 text-white'}`} id="prev-slide">&lt;</button>
                <button onClick={goToNextSlide} disabled={currentSlideIndex === presentation.slides.length - 1} className={`w-10 h-10 rounded ${currentSlideIndex === presentation.slides.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-violet-500 text-white'}`} id="next-slide">&gt;</button>
              </div>
              <div className="absolute right-2 flex justify-center items-center">
                <button onClick={() => setRearrange(true)} className="bg-violet-500 text-white w-fit h-10 rounded ml-2 px-2">Rearrange</button>
                <button
                  onClick={() => {
                    if (presentation && presentation.slides.length === 1) {
                      setShowCannotDeleteSlidePopup(true);
                    } else {
                      setShowDeleteSlidePopup(true);
                    }
                  }}
                  className="bg-red-500 text-white w-10 h-10 rounded flex items-center justify-center ml-2"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button onClick={handleCreateSlide} className="bg-violet-500 text-white w-10 h-10 rounded ml-2" name="add-slide">+</button>
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
