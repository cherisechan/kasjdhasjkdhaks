import styled from 'styled-components';

const SlideBase = styled.div(({$bgColour}) => ({
    width: '85%',
    height: '100%',
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    backgroundColor: $bgColour,
}));

export default SlideBase;