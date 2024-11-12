import SlideBase from "./SlideBase";
import TextElement from "./TextElement";
import TextEditModal from "./TextEditModal";
import { useState, useEffect } from "react";
const Slide = ({ slide, currIndex, setUpdateObj, setUpdateElemId }) => {
    let elements = slide.elements;
    elements = elements.map((e, index) => ({
        ...e,
        z: `${500 - parseInt(index)}`,
    }))

    // for text edit
    const [showTextEditModal, setShowTextEditModal] = useState(false);
    const [elemId, setElemId] = useState("");
    const [textEditSubmit, setTextEditSubmit] = useState(false);
    const [textElem, setTextElem] = useState(null);
    useEffect(() => {
        if (textEditSubmit && textElem) {
            setUpdateObj(textElem);
            setUpdateElemId(elemId)
            setTextEditSubmit(false);
        }
    }, [textEditSubmit])

    const openTextEdit = e => {
        setElemId(e.target.id);
        if (e.target.id) {
            setShowTextEditModal(true);
        }
    }

    return (
        <>
            {showTextEditModal && (
                <TextEditModal
                    element={slide.elements.find(e => e.id === elemId)}
                    setTextElem={setTextElem}
                    setTextEditSubmit={setTextEditSubmit}
                    setShowTextEditModal={setShowTextEditModal}
                />
            )}
            <SlideBase $bgColour1={slide.background.colour1} $bgColour2={slide.background.colour2} $gradient={slide.background.gradient} $bgImg={slide.background.img} id={slide.id} >
                {
                    elements.map((t, index) =>{
                        if (t.type === "text") {
                            return (
                                <TextElement id={slide.elements[index].id} className="text-element hover:cursor-pointer" $textObj={t} text={t.text} openTextEdit={openTextEdit} key={index} />
                            )
                        }
                        
                    })
                }
                <p className="absolute text-center text-gray-600 bottom-2 left-3 text-[1em] z-[900]">{currIndex + 1}</p>
            </SlideBase>
        </>
    )
}

export default Slide;