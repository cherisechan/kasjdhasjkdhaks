// SlideBase.js
import styled from 'styled-components';
import React from 'react';

const SlideBase = styled.div(({
  $bgColour1,
  $bgColour2,
  $gradient,
  $bgImg,
  $fontFam,
}) => ({
  width: '100%',
  aspectRatio: '16 / 9', // Enforce 16:9 aspect ratio
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  fontFamily: $fontFam,
  background: $bgImg
    ? `url(${$bgImg}) center / cover no-repeat`
    : $gradient
    ? `linear-gradient(to right, ${$bgColour1}, ${$bgColour2})`
    : $bgColour1,
}));

// export default SlideBase;
export default React.forwardRef((props, ref) => (
  <SlideBase {...props} ref={ref} />
));
