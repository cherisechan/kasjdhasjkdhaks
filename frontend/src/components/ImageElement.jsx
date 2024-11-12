import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";

const ImageElementStyled = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
`;

const ImageElement = ({ $imageObj, id, openImageEdit, setUpdateObj, setUpdateElemId }) => {
  const [showBoxes, setShowBoxes] = useState(false);
  const [position, setPosition] = useState({ x: $imageObj.x, y: $imageObj.y });
  const [size, setSize] = useState({ width: $imageObj.width, height: $imageObj.height });
  const boxesContainerRef = useRef(null);

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

  const handleDragStop = (e, d) => {
    setPosition({ x: d.x, y: d.y });
    setUpdateObj({ ...$imageObj, x: d.x, y: d.y });
    setUpdateElemId(id);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const newWidth = parseFloat(ref.style.width);
    const newHeight = parseFloat(ref.style.height);
    setSize({ width: newWidth, height: newHeight });
    setPosition(position);
    setUpdateObj({ ...$imageObj, width: newWidth, height: newHeight, x: position.x, y: position.y });
    setUpdateElemId(id);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        boxesContainerRef.current &&
        !boxesContainerRef.current.contains(event.target)
      ) {
        setShowBoxes(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: `${$imageObj.width}%`, height: `${$imageObj.height}%` }} // Fix here
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      lockAspectRatio={true}
      enableResizing={true}
    >
      <ImageElementStyled id={id} $imageObj={$imageObj} className="hover:cursor-pointer" onClick={handleClick}>
        <img src={$imageObj.src} alt={$imageObj.altText} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}/>
        {showBoxes && (
          <div ref={boxesContainerRef}>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 left-0 translate-x-[-2px] translate-y-[-2px] overflow-visible"></div>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] overflow-visible"></div>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] overflow-visible"></div>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px] overflow-visible"></div>
          </div>
        )}
      </ImageElementStyled>
    </Rnd>
  );
};

export default ImageElement;
