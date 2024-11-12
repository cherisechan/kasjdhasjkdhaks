// import CodeElementStyled from "./CodeElementStyled";
import React, { useEffect, useRef, useState } from "react";
import { detect } from "program-language-detector"
import Prism from "prismjs";
import "prismjs/components/prism-c.min.js"; 
import 'prismjs/themes/prism-tomorrow.css';
import styled from "styled-components";
import { Rnd } from "react-rnd";

const CodeElementStyled = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    font-size: 1em;
    overflow: none;
    border: 1px solid #d3d3d3;
    background-color: #2d2d2d;
    user-select: none;
`;

const CodeElement = ({
    $codeObj,
    code,
    id,
    openCodeEdit,
    setUpdateObj,
    setUpdateElemId,
}) => {
    const [showBoxes, setShowBoxes] = useState(false);
    const [position, setPosition] = useState({ x: $codeObj.x, y: $codeObj.y });
    const [size, setSize] = useState({
        width: `${$codeObj.width}%`,
        height: `${$codeObj.height}%`,
    });

    // custom double click within 0.5sec
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
            openCodeEdit(e);
        }
    };

    const handleDragStop = (e, d) => {
        setPosition({ x: d.x, y: d.y });
        if (setUpdateObj && setUpdateElemId) {
            setUpdateObj({ ...$codeObj, x: d.x, y: d.y });
            setUpdateElemId(id);
        }
    };

    const boxesContainerRef = useRef(null);
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
            position={position}
            size={size}
            onDragStop={handleDragStop}
            bounds="parent"
            lockAspectRatio={true}
            disableDragging={false}
        >
            <CodeElementStyled id={id} $codeObj={$codeObj} className="hover:cursor-pointer" onClick={handleClick}>
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