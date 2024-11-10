import SlideBase from "./SlideBase";
const Slide = ({ slide, currIndex }) => {
    return (
        <>
            <SlideBase $bgColour={slide.background.colour}>
                <p className="absolute text-center text-gray-600 bottom-2 left-3 text-[1em]">{currIndex + 1}</p>
            </SlideBase>
        </>
    )
}

export default Slide;