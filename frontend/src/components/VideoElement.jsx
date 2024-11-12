import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const VideoElementStyled = styled.div`
  position: absolute;
  height: ${({ $videoObj }) => `${$videoObj.height}%`};
  width: ${({ $videoObj }) => `${$videoObj.width}%`};
  top: ${({ $videoObj }) => `${$videoObj.x}%`};
  left: ${({ $videoObj }) => `${$videoObj.y}%`};
  z-index: ${({ $videoObj }) => $videoObj.z};
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
`;

const VideoElement = ({ $videoObj, id, openVideoEdit, setUpdateObj, setUpdateElemId }) => {
  const [showBoxes, setShowBoxes] = useState(false);

  // Handle double-click and single-click
  const clickCountRef = useRef(0);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    setShowBoxes(true);

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      timerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }

    if (clickCountRef.current === 2) {
      clearTimeout(timerRef.current);
      clickCountRef.current = 0;
      setShowBoxes(false);
      openVideoEdit(e);
    }
  };

  const boxesContainerRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (boxesContainerRef.current && !boxesContainerRef.current.contains(event.target)) {
        setShowBoxes(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
  }, []);

  return (
    <VideoElementStyled id={id} $videoObj={$videoObj} onClick={handleClick}>
      <iframe
        src={`${$videoObj.src}${$videoObj.autoplay ? '?autoplay=1' : ''}`}
        title="Video"
        style={{ width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      {showBoxes && (
        <div ref={boxesContainerRef}>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 left-0 translate-x-[-2px] translate-y-[-2px] overflow-visible"></div>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] overflow-visible"></div>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] overflow-visible"></div>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px] overflow-visible"></div>
        </div>
      )}
    </VideoElementStyled>
  );
};

export default VideoElement;