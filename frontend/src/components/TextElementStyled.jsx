import styled from 'styled-components';

const TextElementStyled = styled.div(({$textObj}) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    fontSize: `${$textObj.fontSize}em`,
    color: `${$textObj.textColour}`,
    border: "1px solid #d3d3d3",
    boxSizing: 'border-box',
    userSelect: 'none',
    overflow: "hidden",
}));

export default TextElementStyled;
