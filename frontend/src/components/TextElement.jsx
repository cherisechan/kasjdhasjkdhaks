import TextElementStyled from './TextElementStyled';
import React, { useEffect, useRef, useState } from 'react';

const TextElement = ({$textObj, text, id, openTextEdit}) => {
    const [showBoxes, setShowBoxes] = useState(false);

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
            openTextEdit(e);
        }
    };

    const boxesContainerRef = useRef(null);
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (boxesContainerRef.current && !boxesContainerRef.current.contains(event.target)) {
                setShowBoxes(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
    }, []);

    return (
        <>
            <TextElementStyled id={id} $textObj={$textObj} className="hover:cursor-pointer" onClick={handleClick}>
                <div className="h-full w-full overflow-hidden pointer-events-none">
                    <p className="overflow-hidden">{text}</p>
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
            </TextElementStyled>
        </>
    );
};

export default TextElement;