import { useEffect, useState } from "react";
import uniqid from "uniqid";

const TextCreateModal = ({ setTextElem, setTextSubmit, setShowTextCreateModal }) => {
  const [text, setText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [textColour, setTextColour] = useState("");
  const [error, setError] = useState("");
  const onSubmit = () => {
    if (text === "") {
      setError("Text cannot be empty");
    } else if (isNaN(parseFloat(width)) || parseFloat(width) < 0 || parseFloat(width) > 100) {
      setError("Size must be a number between 0 and 100");
    } else if (isNaN(parseFloat(height)) || parseFloat(height) < 0 || parseFloat(height) > 100) {
      setError("Size must be a number between 0 and 100");
    } else if (isNaN(parseFloat(fontSize))) {
      setError("Font size must be a decimal");
    } else if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|(^#[0-9A-F]{8}$)/i.test(textColour)) {
      setError("Invalid HEX code");
    } else {
      const textElem = {
        "id": uniqid(),
        "type": "text",
        "text": text,
        "width": width,
        "height": height,
        "fontSize": fontSize,
        "textColour": textColour,
        "x": 0,
        "y": 0
      }
      setTextElem(textElem);
      setTextSubmit(true);
      setShowTextCreateModal(false);
    }
  }

  // when input change, remove error
  useEffect(() => {
    setError("");
  }, [text, width, height, fontSize, textColour]);

  return (
    <>
      <div className="flex fixed top-0 left-0 h-screen w-screen bg-[#00000090] z-[999] justify-center items-center">
        <div className="bg-white min-w-[40vw] rounded-lg flex flex-col px-[2%] py-[2%] m-2">
          <p className="text-3xl font-bold pb-[4%] text-gray-800">Add a text box</p>
          <div className="flex w-full justify-between">
            <p className="text-xl pb-[1%] mr-5">Text</p>
            <input type="text" name="Text" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter text" onChange={e => {setText(e.target.value)}} />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5">Size</p>
            <input type="text" name="Width" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full mr-5" placeholder="Enter width (%)" onChange={e => {setWidth(e.target.value)}} />
            <input type="text" name="Height" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter height (%)" onChange={e => {setHeight(e.target.value)}} />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5 whitespace-nowrap">Font size</p>
            <input type="text" name="Font size" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter font size (em)" onChange={e => {setFontSize(e.target.value)}} />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5 whitespace-nowrap">Colour</p>
            <input type="text" name="Colour" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter HEX code (e.g. #FFFFFF)" onChange={e => {setTextColour(e.target.value)}} />
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-violet-500 text-white px-4 py-2 rounded" onClick={onSubmit}>Submit</button>
            <button onClick={() => setShowTextCreateModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
          <p className="text-red-500 flex self-center">{error}</p>
        </div>
      </div>  
    </>   
  )
}

export default TextCreateModal;