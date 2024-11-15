import { useEffect, useState, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import Sortable from "./Sortable";
const SlideRearrange = ({presentation, savePresentation, setRearrange}) => {
  const [slides, setSlides] = useState([]);
  const update = useRef(false);
  useEffect(() => {
    if (presentation.slides) {
      setSlides(presentation.slides);
    }
  }, [presentation])

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      setSlides((items) => {
        const activeInd = items.findIndex((s) => s.id === active.id);
        const overInd = items.findIndex((s) => s.id === over.id);
        update.current = true;
        return arrayMove(items, activeInd, overInd);
      });
    }
  };

  useEffect(() => {
    if (!update.current) {
      return;
    }
    if (presentation && slides.length > 0) {
      const updatedPresentation = {
        ...presentation,
        slides: slides,
      };
      savePresentation(updatedPresentation);
      update.current = false
    }
  }, [update.current]);

  return(
    <>
      <div className="flex fixed flex-col top-0 left-0 h-full w-full bg-violet-200 justify-center items-center z-[800]">
        <button onClick={() => setRearrange(false)} className="font-bold px-4 py-3 bg-violet-600 text-white rounded mr-auto ml-[2vw]">Back</button>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="max-h-[86%] mt-2 h-auto overflow-x-hidden overflow-y-auto max-w-full grid grid-cols-4 max-warps:grid-cols-3 max-[760px]:grid-cols-2 max-sm:grid-cols-1 gap-3 px-3 scrollbar scrollbar-w-2 scrollbar-thumb-violet-300 scrollbar-track-gray-3  00 scrollbar-thumb-rounded">
            <SortableContext items={slides} >
              {
                slides.map((s, i) => (
                  <Sortable key={i} id={s.id} index={i} slide={s} fontFam={presentation.fontFamily}/>
                ))
              }
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </>
  )
}

export default SlideRearrange