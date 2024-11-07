import React from 'react';

const Presentation = ({ name, thumbnail, description, numSlides }) => (
    <div className="bg-violet-100 w-[30vw] h-[15vw] min-h-[150px] min-w-[300px] rounded-lg flex flex-col flex-shrink-0 overflow-auto">
        <div id="row-1" className="h-2/4 flex items-center mb-1">
            <div className="px-2 py-2 h-full aspect-square">
                {thumbnail ? (
                    <img src={thumbnail} alt="thumbnail" className="object-cover w-full h-full" />
                ) : (
                    <div className="w-full h-full bg-gray-400"></div>
                )}
            </div>
            <h2 className="text-5xl m-auto line-clamp-1 font-semibold ">{name}</h2>
        </div>
        <p className="text-gray-600 max-h-[30%] xl:line-clamp-3 line-clamp-2 text-lg px-2 leading-tight">{description}</p>
        <p className="text-sm text-gray-500 px-1 mt-auto w-min pb-1">Slides: {numSlides}</p>
    </div>
);

export default Presentation;