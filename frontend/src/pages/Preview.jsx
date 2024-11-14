import React from 'react';
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SlidePreview from '../components/SlidePreview';

const Preview = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("http://localhost:5005/store", headers);
        const presentations = response.data.store.presentations;
        const presentation = presentations.find((pres) => pres.id === id);

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
  }, [goToNextSlide, goToPreviousSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      {presentation ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Slide content */}
          <div className="flex-grow flex items-center justify-center w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative" style={{ width: '100%', height: '100%', maxWidth: 'calc(100vh * (16/9))', maxHeight: '100vh' }}>
                <SlidePreview slide={presentation.slides[currentSlideIndex]} currIndex={currentSlideIndex} />
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="absolute bottom-5 flex justify-center items-center px-4 py-2 space-x-4 font-semibold">
            <button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">&lt;</button>
            <span className='text-black'>Slide {currentSlideIndex + 1} of {presentation.slides.length}</span>
            <button onClick={goToNextSlide} disabled={currentSlideIndex === presentation.slides.length - 1} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">&gt;</button>
          </div>
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
}

export default Preview;
