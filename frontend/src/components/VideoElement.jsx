import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";

const VideoElementStyled = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
`;

const VideoElement = ({ $videoObj, id, openVideoEdit, setUpdateObj, setUpdateElemId }) => {
  const [showBoxes, setShowBoxes] = useState(false);
  const [position, setPosition] = useState({ x: $videoObj.x, y: $videoObj.y });
  const [size, setSize] = useState({ width: $videoObj.width, height: $videoObj.height });
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
      }, 300);
    }

    if (clickCountRef.current === 2) {
      clearTimeout(timerRef.current);
      clickCountRef.current = 0;
      setShowBoxes(false);
      openVideoEdit(e);
    }
  };

  const handleDragStop = (e, d) => {
    setPosition({ x: d.x, y: d.y });
    if (setUpdateObj && setUpdateElemId) {
      setUpdateObj({ ...$videoObj, x: d.x, y: d.y });
      setUpdateElemId(id);
    }
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const newWidth = parseFloat(ref.style.width);
    const newHeight = parseFloat(ref.style.height);
    setSize({ width: newWidth, height: newHeight });
    setPosition(position);
    if (setUpdateObj && setUpdateElemId) {
      setUpdateObj({ ...$videoObj, width: newWidth, height: newHeight, x: position.x, y: position.y });
      setUpdateElemId(id);
    }
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

  // Function to construct the iframe URL with proper parameters
  const constructIframeSrc = () => {
    try {
      const url = new URL($videoObj.src);
      if ($videoObj.autoplay) {
        url.searchParams.set('autoplay', '1');
      } else {
        url.searchParams.delete('autoplay');
      }
      return url.toString();
    } catch (e) {
      return $videoObj.src;
    }
  };

  return (
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: `${$videoObj.width}%`, height: `${$videoObj.height}%` }} // Fixed to use $videoObj
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      lockAspectRatio={true}
      enableResizing={true}
    >
      <VideoElementStyled id={id} $videoObj={$videoObj} onClick={handleClick}>
        <iframe
          src={constructIframeSrc()}
          title="Video"
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
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
    </Rnd>
  );
};

export default VideoElement;
