import styled from 'styled-components';

const TextElement = styled.p(({$textObj}) => ({
    position: 'absolute',
    height: `${$textObj.height}`,
    width: `${$textObj.width}`,
    textOverflow: "hidden",
    fontSize: `${$textObj.fontSize}em`,
    color: `${$textObj.textColour}`,
    top: `${$textObj.x}`,
    left: `${$textObj.y}`,
    zIndex: `${$textObj.z}`,
    border: "1px solid #d3d3d3"
}));

export default TextElement;