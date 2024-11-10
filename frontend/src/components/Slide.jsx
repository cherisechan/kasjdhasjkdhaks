import styled from 'styled-components';

const Slide = styled.div(({$bgColour}) => ({
    width: '85%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1.25rem',
    borderRadius: '0.5rem',
    backgroundColor: $bgColour,
}));

export default Slide;