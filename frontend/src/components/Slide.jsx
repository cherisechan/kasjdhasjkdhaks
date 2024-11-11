import SlideBase from "./SlideBase";
import TextElement from "./TextElement";
const Slide = ({ slide, currIndex }) => {
    const elements = slide.elements;
    elements.map((e, index) => ({
        ...elements,
        "z": index,
    }))
    const textElems = elements.filter(e => e.type === "text");

    return (
        <>
            <SlideBase $bgColour={slide.background.colour}>
                {
                    textElems.map((t, index) =>(
                        <TextElement className="text-element" $textObj={t} key={index}>
                            <div className="absolute"></div>
                            <p>{t.text}</p>
                        </TextElement>
                    ))
                }
                <p className="absolute text-center text-gray-600 bottom-2 left-3 text-[1em] z-[900]">{currIndex + 1}</p>
            </SlideBase>
        </>
    )
}

export default Slide;