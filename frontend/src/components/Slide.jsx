import SlideBase from "./SlideBase";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import VideoElement from "./VideoElement";
import TextEditModal from "./TextEditModal";
import ImageEditModal from "./ImageEditModal"; 
import VideoEditModal from "./VideoEditModal";
import { useState, useEffect, useRef } from "react";
import CodeElement from "./CodeElement";
import CodeEditModal from "./CodeEditModal";
const Slide = ({ slide, currIndex, setUpdateObj, setUpdateElemId, fontFam, setSelectedElemId, deleteElem }) => {
  const slideRef = useRef(null);
  let elements = slide.elements;
  elements = elements.map((e, index) => ({
    ...e,
    z: `${500 - parseInt(index)}`,
  }));

  // for text edit
  const [showTextEditModal, setShowTextEditModal] = useState(false);
  const [elemId, setElemId] = useState("");
  const [textEditSubmit, setTextEditSubmit] = useState(false);
  const [textElem, setTextElem] = useState(null);

  useEffect(() => {
    if (textEditSubmit && textElem) {
      setUpdateObj(textElem);
      setUpdateElemId(elemId);
      setTextEditSubmit(false);
    }
  }, [textEditSubmit, textElem]);

  const openTextEdit = e => {
    if (e.target.id) {
      setElemId(e.target.id);
      setShowTextEditModal(true);
    }
  };

  // for image edit
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [imageEditSubmit, setImageEditSubmit] = useState(false);
  const [imageElem, setImageElem] = useState(null);

  useEffect(() => {
    if (imageEditSubmit && imageElem) {
      setUpdateObj(imageElem);
      setUpdateElemId(elemId);
      setImageEditSubmit(false);
    }
  }, [imageEditSubmit, imageElem]);

  const openImageEdit = (e) => {
    setElemId(e.target.id);
    if (e.target.id) {
      setShowImageEditModal(true);
    }
  };

  // for video edit
  const [showVideoEditModal, setShowVideoEditModal] = useState(false);
  const [videoEditSubmit, setVideoEditSubmit] = useState(false);
  const [videoElem, setVideoElem] = useState(null);

  useEffect(() => {
    if (videoEditSubmit && videoElem) {
      setUpdateObj(videoElem);
      setUpdateElemId(elemId);
      setVideoEditSubmit(false);
    }
  }, [videoEditSubmit, videoElem]);

  const openVideoEdit = (e) => {
    setElemId(e.target.id);
    if (e.target.id) {
      setShowVideoEditModal(true);
    }
  };

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
          element={slide.elements.find((e) => e.id === elemId)}
          setTextElem={setTextElem}
          setTextEditSubmit={setTextEditSubmit}
          setShowTextEditModal={setShowTextEditModal}
          deleteElem={deleteElem}
          elemId={elemId}
        />
      )}

      {showCodeEditModal && (
        <CodeEditModal
          element={slide.elements.find(e => e.id === elemId)}
          setCodeElem={setCodeElem}
          setCodeEditSubmit={setCodeEditSubmit}
          setShowCodeEditModal={setShowCodeEditModal}
          deleteElem={deleteElem}
          elemId={elemId}
        />
      )}

      {showImageEditModal && (
        <ImageEditModal
          element={slide.elements.find((e) => e.id === elemId)}
          setImageElem={setImageElem}
          setImageEditSubmit={setImageEditSubmit}
          setShowImageEditModal={setShowImageEditModal}
          deleteElem={deleteElem}
          elemId={elemId}
        />
      )}

      {showVideoEditModal && (
        <VideoEditModal
          element={slide.elements.find((e) => e.id === elemId)}
          setVideoElem={setVideoElem}
          setVideoEditSubmit={setVideoEditSubmit}
          setShowVideoEditModal={setShowVideoEditModal}
          deleteElem={deleteElem}
          elemId={elemId}
        />
      )}

      {/* Slide Content */}
      <SlideBase onClick={() => setSelectedElemId(null)} ref={slideRef} $bgColour1={slide.background.colour1} $bgColour2={slide.background.colour2} $gradient={slide.background.gradient} $bgImg={slide.background.img} $fontFam={fontFam} id={slide.id}>
        {elements.map((t, index) => {
          if (t.type === "text") {
            return (
              <TextElement id={t.id} $textObj={t} text={t.text} openTextEdit={openTextEdit} key={t.id} setUpdateObj={setUpdateObj} setUpdateElemId={setUpdateElemId} parentRef={slideRef} setSelectedElemId={setSelectedElemId}/>
            );
          } else if (t.type === "image") {
            return (
              <ImageElement id={t.id} $imageObj={t} openImageEdit={openImageEdit} key={t.id} setUpdateObj={setUpdateObj} setUpdateElemId={setUpdateElemId} parentRef={slideRef} setSelectedElemId={setSelectedElemId}/>
            );
          } else if (t.type === "video") {
            return (
              <VideoElement id={t.id} $videoObj={t} openVideoEdit={openVideoEdit} key={t.id} setUpdateObj={setUpdateObj} setUpdateElemId={setUpdateElemId} parentRef={slideRef} setSelectedElemId={setSelectedElemId}/>
            );
          } else if (t.type === "code") {
            return (
              <CodeElement id={slide.elements[index].id} className="text-element hover:cursor-pointer" $codeObj={t} code={t.code} openCodeEdit={openCodeEdit} key={index} setUpdateObj={setUpdateObj} setUpdateElemId={setUpdateElemId} parentRef={slideRef} setSelectedElemId={setSelectedElemId}/>
            )
          }
          return null;
        })}
        <p className="absolute text-center text-gray-600 bottom-2 left-3 text-[1em] z-[500]">{currIndex + 1}</p>
      </SlideBase>
    </>
  );
};

export default Slide;