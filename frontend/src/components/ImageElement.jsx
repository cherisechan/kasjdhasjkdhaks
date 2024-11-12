import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ImageElementStyled = styled.div`
  position: absolute;
  height: ${({ $imageObj }) => `${$imageObj.height}%`};
  width: ${({ $imageObj }) => `${$imageObj.width}%`};
  top: ${({ $imageObj }) => `${$imageObj.x}%`};
  left: ${({ $imageObj }) => `${$imageObj.y}%`};
  z-index: ${({ $imageObj }) => $imageObj.z};
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  user-select: none;
`;

const ImageElement = ({ $imageObj, id, openImageEdit, setUpdateObj, setUpdateElemId }) => {
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
      openImageEdit(e);
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
    <ImageElementStyled id={id} $imageObj={$imageObj} onClick={handleClick}>
      <img src={$imageObj.src} alt={$imageObj.altText} style={{ width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}/>
      {showBoxes && (
        <div ref={boxesContainerRef}>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 left-0 translate-x-[-2px] translate-y-[-2px] overflow-visible"></div>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] overflow-visible"></div>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] overflow-visible"></div>
          <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px] overflow-visible"></div>
        </div>
      )}
    </ImageElementStyled>
  );
};

export default ImageElement;