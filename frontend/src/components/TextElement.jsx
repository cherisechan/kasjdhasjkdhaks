import TextElementStyled from './TextElementStyled';
import React, { useRef } from 'react';
const TextElement = ({$textObj, text, id, openTextEdit}) => {
    // custom double click within 0.5sec
    const clickCountRef = useRef(0);
    const timerRef = useRef(null);

    const handleClick = (e) => {
        clickCountRef.current += 1;

        if (clickCountRef.current === 2) {
            clearTimeout(timerRef.current);
            clickCountRef.current = 0;
            openTextEdit(e);
        } else {
            timerRef.current = setTimeout(() => {
                clickCountRef.current = 0;
            }, 500);
        }
    };
    return (
        <TextElementStyled id={id} $textObj={$textObj} className="hover:cursor-pointer" onClick={handleClick}>
            <p className="overflow-hidden pointer-events-none">{text}</p>
        </TextElementStyled>
    )
}

export default TextElement;