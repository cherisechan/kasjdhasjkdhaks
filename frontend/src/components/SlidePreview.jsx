import SlideBase from "./SlideBase";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import VideoElement from "./VideoElement";
import CodeElement from "./CodeElement";
import { useRef } from "react";

const SlidePreview = ({ slide, currIndex, fontFam }) => {
  const slideRef = useRef(null);
  let elements = slide.elements;
  elements = elements.map((e, index) => ({
    ...e,
    z: `${500 - parseInt(index)}`,
  }));

  return (
    <div className="w-full h-full">
      <SlideBase
        ref={slideRef}
        $bgColour1={slide.background.colour1}
        $bgColour2={slide.background.colour2}
        $gradient={slide.background.gradient}
        $bgImg={slide.background.img}
        $fontFam={fontFam}
        id={slide.id}
      >
        {elements.map((t) => {
          if (t.type === "text") {
            return (
              <TextElement
                id={t.id}
                $textObj={t}
                text={t.text}
                key={t.id}
                parentRef={slideRef}
                readOnly={true} // Enable read-only mode
              />
            );
          } else if (t.type === "image") {
            return (
              <ImageElement
                id={t.id}
                $imageObj={t}
                key={t.id}
                parentRef={slideRef}
                readOnly={true}
              />
            );
          } else if (t.type === "video") {
            return (
              <VideoElement
                id={t.id}
                $videoObj={t}
                key={t.id}
                parentRef={slideRef}
                readOnly={true}
              />
            );
          } else if (t.type === "code") {
            return (
              <CodeElement
                id={t.id}
                $codeObj={t}
                code={t.code}
                key={t.id}
                parentRef={slideRef}
                readOnly={true}
              />
            );
          }
          return null;
        })}
        {/* Remove the slide number if you don't want it */}
        <p className="absolute text-center text-white bottom-2 left-3 text-[1em] z-[900]">
          {currIndex + 1}
        </p>
      </SlideBase>
    </div>
  );
};

export default SlidePreview;
