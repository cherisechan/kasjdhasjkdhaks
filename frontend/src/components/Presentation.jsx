import { useNavigate } from 'react-router-dom';

const Presentation = ({ name, thumbnail, description, numSlides, id }) => {
  const navigate = useNavigate();

  const handlePresentationClick = () => {
    navigate(`/design/${id}/0`);
  }

  return (
    <div id={id} className="bg-[#e1dfed] w-[30vw] h-[15vw] min-h-[150px] min-w-[300px] rounded-lg flex flex-col flex-shrink-0 overflow-auto cursor-pointer" onClick={handlePresentationClick}>
      <div id="row-1" className="h-2/4 flex items-center mb-1 bg-violet-50">
        <div className="px-2 py-2 h-full aspect-square">
          {thumbnail ? (
            <img src={thumbnail} alt="thumbnail" className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
        </div>
        <h2 className="text-4xl line-clamp-1 font-semibold leading-tight">{name}</h2>
      </div>
      <p className="text-gray-600 max-h-[30%] xl:line-clamp-3 line-clamp-2 text-lg px-2 leading-tight">{description}</p>
      <p className="text-lg text-gray-500 px-2 mt-auto w-min pb-1 whitespace-nowrap">Slides: {numSlides}</p>
    </div>
  )
}

export default Presentation;