import SlideBase from "./SlideBase";
import TextElement from "./TextElement";
import TextEditModal from "./TextEditModal";
import { useState, useEffect } from "react";
import CodeElement from "./CodeElement";
import CodeEditModal from "./CodeEditModal";
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
        if (e.target.id) {
            setElemId(e.target.id);
            setShowTextEditModal(true);
        }
    }

    // for code edit
    const [showCodeEditModal, setShowCodeEditModal] = useState(false);
    const [codeEditSubmit, setCodeEditSubmit] = useState(false);
    const [codeElem, setCodeElem] = useState(null);
    useEffect(() => {
        if (codeEditSubmit && codeElem) {
            setUpdateObj(codeElem);
            setUpdateElemId(elemId)
            setCodeEditSubmit(false);
        }
    }, [codeEditSubmit])
    const openCodeEdit = e => {
        if (e.target.id) {
            setElemId(e.target.id);
            setShowCodeEditModal(true);
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

            {showCodeEditModal && (
                <CodeEditModal
                    element={slide.elements.find(e => e.id === elemId)}
                    setCodeElem={setCodeElem}
                    setCodeEditSubmit={setCodeEditSubmit}
                    setShowCodeEditModal={setShowCodeEditModal}
                />
            )}

            <SlideBase $bgColour1={slide.background.colour1} $bgColour2={slide.background.colour2} $gradient={slide.background.gradient} $bgImg={slide.background.img} id={slide.id} >
                {
                    elements.map((t, index) =>{
                        if (t.type === "text") {
                            return (
                                <TextElement id={slide.elements[index].id} className="text-element hover:cursor-pointer" $textObj={t} text={t.text} openTextEdit={openTextEdit} key={index} />
                            )
                        } else if (t.type === "code") {
                            console.log(t);
                            return (
                                <CodeElement id={slide.elements[index].id} className="text-element hover:cursor-pointer" $codeObj={t} code={t.code} openCodeEdit={openCodeEdit} key={index}  />
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