import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import SlidePreview from "./SlidePreview";

const Sortable = ({ id, index, slide, fontFam }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex-shrink-0 w-[30%] min-w-56 h-fit"
    >
      <SlidePreview key={id} slide={slide} currIndex={index} fontFam={fontFam} />
      <p className="text-center">{index + 1}</p>
    </div>
  );
};

export default Sortable;