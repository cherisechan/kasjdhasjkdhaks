import styled from 'styled-components';

const CodeElementStyled = styled.div(({$codeObj}) => ({
    position: "absolute",
    height: `${$codeObj.height}%`,
    width: `${$codeObj.width}%`,
    fontSize: `${$codeObj.fontSize}em`,
    overflow: "none",
    top: `${$codeObj.x}%`,
    left: `${$codeObj.y}%`,
    zIndex: `${$codeObj.z}`,
    border: "1px solid #d3d3d3",
    backgroundColor: "#2d2d2d",
}));

export default CodeElementStyled;