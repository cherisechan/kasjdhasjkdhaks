import SlideBase from "./SlideBase";
const Slide = ({ slide }) => {
    return (
        <>
            <SlideBase $bgColour={slide.background.colour}>
                
            </SlideBase>
        </>
    )
}

export default Slide;