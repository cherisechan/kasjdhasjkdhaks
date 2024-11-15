import styled from 'styled-components';

const CodeElementStyled = styled.div(({$codeObj, readOnly}) => ({
  position: "relative",
  height: '100%',
  width: '100%',
  fontSize: `${$codeObj.fontSize}em`,
  overflow: "hidden",
  // top: `${$codeObj.x}%`,
  // left: `${$codeObj.y}%`,
  // zIndex: `${$codeObj.z}`,
  // border: "1px solid #d3d3d3",
  border: readOnly ? 'none' : '1px solid #d3d3d3',
  backgroundColor: "#2d2d2d",
}));

export default CodeElementStyled;