import styled from 'styled-components';

const Slide = styled.div(({bgcolour}) => ({
    width: '65vw',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1.25rem',
    borderRadius: '0.5rem',
    backgroundColor: bgcolour,
}));

export default Slide;