import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";

const VideoElementStyled = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: ${({ readOnly }) => (readOnly ? 'none' : '1px solid #d3d3d3')};
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
`;

const VideoElement = ({ $videoObj, id, openVideoEdit, setUpdateObj, setUpdateElemId, parentRef, readOnly = false, setSelectedElemId }) => {
  const rndRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Initialize position and size in percentages
  const [position, setPosition] = useState({
    x: $videoObj.x,
    y: $videoObj.y,
  });
  const [size, setSize] = useState({
    width: $videoObj.width,
    height: $videoObj.height,
  });

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
  useLayoutEffect(() => {
    updateParentSize();
    window.addEventListener("resize", updateParentSize);
    return () => {
      window.removeEventListener("resize", updateParentSize);
    };
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElemId(id);
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
    const parentWidth = parentSize.width;
    const parentHeight = parentSize.height;

    const newXPercent = (d.x / parentWidth) * 100;
    const newYPercent = (d.y / parentHeight) * 100;

    setPosition({ x: newXPercent, y: newYPercent });
    setUpdateObj({ ...$videoObj, x: newXPercent, y: newYPercent });
    setUpdateElemId(id);
  };

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
      ...$videoObj,
      width: newWidthPercent,
      height: newHeightPercent,
      x: newXPercent,
      y: newYPercent,
    });
    setUpdateElemId(id);
  };

  const calculatedPosition = {
    x: (position.x / 100) * parentSize.width || 0,
    y: (position.y / 100) * parentSize.height || 0,
  };

  useLayoutEffect(() => {
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

  if (parentSize.width === 0 || parentSize.height === 0) {
    return null;
  }

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
    } catch {
      return $videoObj.src;
    }
  };

  return (
    <Rnd
      ref={rndRef}
      position={calculatedPosition}
      size={{
        width: `${size.width}%`,
        height: `${size.height}%`,
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      // lockAspectRatio={false}
      // enableResizing={true}
      lockAspectRatio={false}
      enableResizing={!readOnly}
      disableDragging={readOnly}
      className={readOnly ? "pointer-events-none" : "pointer-events-auto"}
    >
      <VideoElementStyled id={id} $videoObj={$videoObj} onClick={handleClick} readOnly={readOnly}>
        <iframe
          src={constructIframeSrc()}
          title="Video"
          className="w-[100%] h-[100%] pointer-events-none"
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
