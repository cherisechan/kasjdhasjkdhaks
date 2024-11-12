import styled from 'styled-components';

const TextElementStyled = styled.div(({$textObj}) => ({
    position: 'relative',  // Set to 'relative' for alignment within Rnd bounds
    fontSize: `${$textObj.fontSize}em`,  // Keep font size in em as requested
    color: `${$textObj.textColour}`,
    border: "1px solid #d3d3d3",
    boxSizing: 'border-box',
    userSelect: 'none',
    overflow: "hidden",  // Prevents overflow outside the box
}));

export default TextElementStyled;
