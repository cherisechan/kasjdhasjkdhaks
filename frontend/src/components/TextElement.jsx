import TextElementStyled from './TextElementStyled';
import React, { useEffect, useRef, useState } from 'react';
const TextElement = ({$textObj, text, id, openTextEdit}) => {
    const [showBoxes, setShowBoxes] = useState(false);
    // custom double click within 0.5sec
    const clickCountRef = useRef(0);
    const timerRef = useRef(null);
    const handleClick = (e) => {
        clickCountRef.current += 1;
    
        if (clickCountRef.current === 1) {
            timerRef.current = setTimeout(() => {
                setShowBoxes(true);
                clickCountRef.current = 0;
            }, 500);
        }
    
        if (clickCountRef.current === 2) {
            clearTimeout(timerRef.current);
            clickCountRef.current = 0;
            openTextEdit(e);
        }
    };

    return (
        <>
            <TextElementStyled id={id} $textObj={$textObj} className="hover:cursor-pointer" onClick={handleClick}>
                <div className="h-full w-full overflow-hidden pointer-events-none">
                    <p className="overflow-hidden">{text}</p>
                </div>
                {
                    showBoxes && (
                        <>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 left-0 translate-x-[-2px] translate-y-[-2px] overflow-visible"></div>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute top-0 right-0 translate-x-[2px] translate-y-[-2px] overflow-visible"></div>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 left-0 translate-x-[-2px] translate-y-[2px] overflow-visible"></div>
                            <div className="w-[5px] h-[5px] bg-gray-600 absolute bottom-0 right-0 translate-x-[2px] translate-y-[2px] overflow-visible"></div>
                        </>
                    )
                }
            </TextElementStyled>
        </>
    )
}

export default TextElement;