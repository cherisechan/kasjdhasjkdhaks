import { useLayoutEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import TextElementStyled from "./TextElementStyled";

const TextElement = ({
  $textObj,
  text,
  id,
  openTextEdit,
  setUpdateObj,
  setUpdateElemId,
  parentRef,
  readOnly = false,
  setSelectedElemId,
}) => {
  const rndRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Initialize position and size in percentages
  const [position, setPosition] = useState({
    x: $textObj.x,
    y: $textObj.y,
  });
  const [size, setSize] = useState({
    width: $textObj.width,
    height: $textObj.height,
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

  // Handle clicks for editing
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElemId(id);
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
      openTextEdit(e);
    }
  };

  // Handle drag stop
  const handleDragStop = (e, d) => {
    const parentWidth = parentSize.width;
    const parentHeight = parentSize.height;

    const newXPercent = (d.x / parentWidth) * 100;
    const newYPercent = (d.y / parentHeight) * 100;

    setPosition({ x: newXPercent, y: newYPercent });
    setUpdateObj({ ...$textObj, x: newXPercent, y: newYPercent });
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
      ...$textObj,
      width: newWidthPercent,
      height: newHeightPercent,
      x: newXPercent,
      y: newYPercent,
    });
    setUpdateElemId(id);
  };

  // Calculate pixel values from percentages
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
      lockAspectRatio={false}
      enableResizing={!readOnly}
      disableDragging={readOnly}
      style={{ pointerEvents: readOnly ? "none" : "auto" }}
    >
      <TextElementStyled
        id={id}
        $textObj={$textObj}
        className="hover:cursor-pointer"
        onClick={handleClick}
        readOnly={readOnly}
      >
        <div className="h-full w-full overflow-hidden pointer-events-none">
          <p className="overflow-hidden">{text}</p>
        </div>
        {showBoxes && (
          <div ref={boxesContainerRef}>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 left-0 translate-x-[-2px] translate-y-[-2px] overflow-visible"></div>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] overflow-visible"></div>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] overflow-visible"></div>
            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px] overflow-visible"></div>
          </div>
        )}
      </TextElementStyled>
    </Rnd>
  );
};

export default TextElement;
