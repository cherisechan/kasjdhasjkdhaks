import React from 'react';
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SlidePreview from '../components/SlidePreview';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Preview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sindex } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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

  useEffect(() => {
    if (presentation) {
      if (parseInt(sindex) && parseInt(sindex) <= presentation.slides.length) {
        setCurrentSlideIndex(parseInt(sindex) - 1);
      } else {
        navigate(`/preview/${id}/${currentSlideIndex + 1}`)
      }
    }
  }, [sindex, presentation])

  const goToNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      navigate(`/preview/${id}/${currentSlideIndex + 2}`)
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      navigate(`/preview/${id}/${currentSlideIndex}`)
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

  // Define variants for the motion component
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300, // Start from right if going forward, left if backward
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300, // Exit to left if going forward, right if backward
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
    }),
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      {presentation ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {/* Slide content */}
          <div className="flex-grow flex items-center justify-center w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-w-screen max-h-screen overflow-hidden">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={currentSlideIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 50 },
                      opacity: { duration: 0.5 },
                    }}
                    className="w-full h-full"
                  >
                    <SlidePreview slide={presentation.slides[currentSlideIndex]} currIndex={currentSlideIndex} />
                  </motion.div>
                </AnimatePresence>
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
