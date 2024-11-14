import CodeElementStyled from "./CodeElementStyled";
import React, { useEffect, useRef, useState } from "react";
import { detect } from "program-language-detector"
import Prism from "prismjs";
import "prismjs/components/prism-c.min.js"; 
import 'prismjs/themes/prism-tomorrow.css';
import { Rnd } from "react-rnd";


const CodeElement = ({ $codeObj, code, id, openCodeEdit, setUpdateObj, setUpdateElemId, parentRef, readOnly = false }) => {
    const rndRef = useRef(null);
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

    // Initialize position and size in percentages
    const [position, setPosition] = useState({
        x: $codeObj.x,
        y: $codeObj.y,
    });
    const [size, setSize] = useState({
        width: $codeObj.width,
        height: $codeObj.height,
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
    useEffect(() => {
        updateParentSize();
        window.addEventListener("resize", updateParentSize);
        return () => {
            window.removeEventListener("resize", updateParentSize);
        };
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        console.log("handleClick fired"); 
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
            openCodeEdit(e);
        }
    };

    // Handle drag stop
    const handleDragStop = (e, d) => {
        const parentWidth = parentSize.width;
        const parentHeight = parentSize.height;

        const newXPercent = (d.x / parentWidth) * 100;
        const newYPercent = (d.y / parentHeight) * 100;

        setPosition({ x: newXPercent, y: newYPercent });
        setUpdateObj({ ...$codeObj, x: newXPercent, y: newYPercent });
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
            ...$codeObj,
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

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (boxesContainerRef.current && !boxesContainerRef.current.contains(event.target)) {
                setShowBoxes(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
    }, []);

    const [language, setLanguage] = useState("");
    useEffect(() => {
        if (!code) {
            return;
        }
        const detected = detect(code);
        if (detected ===  "JavaScript") {
            setLanguage("javascript")
        } else if (detected === "C") {
            setLanguage("c");
        } else if (detected === "Python") {
            setLanguage("python");
        } else {
            // set default language to js
            setLanguage("javascript");
        }
    }, [code])

    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

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
            style={{ pointerEvents: readOnly ? 'none' : 'auto' }}
        >
            <CodeElementStyled id={id} $codeObj={$codeObj} className="hover:cursor-pointer" onClick={handleClick} readOnly={readOnly}>
                <div className="h-full w-full overflow-hidden pointer-events-none">
                    <pre>
                        <code className={`language-${language}`}>
                            {code}
                        </code>
                    </pre>
                </div>
                {
                    showBoxes && (
                        <div ref={boxesContainerRef}>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 left-0 translate-x-[-2px] translate-y-[-2px] overflow-visible"></div>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] overflow-visible"></div>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] overflow-visible"></div>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px] overflow-visible"></div>
                        </div>
                    )
                }
            </CodeElementStyled>
        </Rnd>
    );
};

export default CodeElement;