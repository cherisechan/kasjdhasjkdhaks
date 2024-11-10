import React, { useEffect, useState } from "react";

const TextCreateModal = ({ setText, setWidth, setHeight, setFontSize, setTextColour, setTextSubmit, setShowTextCreateModal }) => {
  return (
    <>
      <div className="flex fixed top-0 left-0 h-screen w-screen bg-[#00000090] z-[999] justify-center items-center">
        <div className="bg-white min-w-[40vw] rounded-lg flex flex-col px-[2%] py-[2%] m-2">
          <p className="text-3xl font-bold pb-[4%] text-gray-800">Add a text box</p>
          <div className="flex w-full justify-between">
            <p className="text-xl pb-[1%] mr-5">Text</p>
            <input type="text" name="Text" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter text" />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5">Size</p>
            <input type="text" name="Width" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full mr-5" placeholder="Enter width" />
            <input type="text" name="Height" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter height" />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5 whitespace-nowrap">Font size</p>
            <input type="text" name="Font size" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter font size in em" />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5 whitespace-nowrap">Colour</p>
            <input type="text" name="Text" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter HEX code" />
          </div>
          <div className="mt-4 flex space-x-2">
              <button className="bg-violet-500 text-white px-4 py-2 rounded">Submit</button>
              <button onClick={() => setShowTextCreateModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>  
    </>   
  )
}

export default TextCreateModal;