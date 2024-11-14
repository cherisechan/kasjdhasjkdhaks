import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";

const ImageElementStyled = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: ${({ readOnly }) => (readOnly ? 'none' : '1px solid #d3d3d3')};
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
`;

const ImageElement = ({
  $imageObj,
  id,
  openImageEdit,
  setUpdateObj,
  setUpdateElemId,
  parentRef, // Receive the parentRef here
  readOnly = false,
}) => {
  const rndRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Initialize position and size in percentages
  const [position, setPosition] = useState({ x: $imageObj.x, y: $imageObj.y });
  const [size, setSize] = useState({ width: $imageObj.width, height: $imageObj.height });

  const [showBoxes, setShowBoxes] = useState(false);
  const clickCountRef = useRef(0);
  const timerRef = useRef(null);
  const boxesContainerRef = useRef(null);

  // Function to update parent size
  const updateParentSize = () => {
    if (parentRef.current) {
      setParentSize({
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    }
  };

  // Update parent size on mount and when window resizes
  useEffect(() => {
    updateParentSize();
    window.addEventListener("resize", updateParentSize);
    return () => {
      window.removeEventListener("resize", updateParentSize);
    };
  }, []);

  // Handle clicks for editing
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

  // Handle drag stop
  const handleDragStop = (e, d) => {
    const parentWidth = parentSize.width;
    const parentHeight = parentSize.height;

    const newXPercent = (d.x / parentWidth) * 100;
    const newYPercent = (d.y / parentHeight) * 100;

    setPosition({ x: newXPercent, y: newYPercent });
    setUpdateObj({ ...$imageObj, x: newXPercent, y: newYPercent });
    setUpdateElemId(id);
  };

  // Handle resize stop
  const handleResizeStop = (e, direction, ref, delta, position) => {
    const parentWidth = parentSize.width;
    const parentHeight = parentSize.height;

    const newWidthPercent = (ref.offsetWidth / parentWidth) * 100;
    const newHeightPercent = (ref.offsetHeight / parentHeight) * 100;

    const newXPercent = (position.x / parentWidth) * 100;
    const newYPercent = (position.y / parentHeight) * 100;

    setSize({ width: newWidthPercent, height: newHeightPercent });
    setPosition({ x: newXPercent, y: newYPercent });

    setUpdateObj({
      ...$imageObj,
      width: newWidthPercent,
      height: newHeightPercent,
      x: newXPercent,
      y: newYPercent,
    });
    setUpdateElemId(id);
  };

  // Calculate pixel values from percentages for rendering
  const calculatedPosition = {
    x: (position.x / 100) * parentSize.width || 0,
    y: (position.y / 100) * parentSize.height || 0,
  };

  const calculatedSize = {
    width: `${size.width}%`,
    height: `${size.height}%`,
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
      ref={rndRef}
      position={calculatedPosition}
      size={calculatedSize}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      // lockAspectRatio={true}
      // enableResizing={true}
      lockAspectRatio={false}
      enableResizing={!readOnly}
      disableDragging={readOnly}
      style={{ pointerEvents: readOnly ? 'none' : 'auto' }}
    >
      <ImageElementStyled
        id={id}
        $imageObj={$imageObj}
        className="hover:cursor-pointer"
        onClick={handleClick}
        readOnly={readOnly}
      >
        <img
          src={$imageObj.src}
          alt={$imageObj.altText}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        />
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
