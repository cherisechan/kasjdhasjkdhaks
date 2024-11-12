import styled from 'styled-components';

const SlideBase = styled.div(({ $bgColour1, $bgColour2, $gradient, $bgImg, $fontFam }) => ({
    width: '85%',
    height: '100%',
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

export default SlideBase;