import React, { useEffect, useState } from "react";

const CodeEditModal = ({ element, setCodeElem, setCodeEditSubmit, setShowCodeEditModal }) => {
  const [code, setCode] = useState(element.code);
  const [width, setWidth] = useState(element.width);
  const [height, setHeight] = useState(element.height);
  const [fontSize, setFontSize] = useState(element.fontSize);
  const [textX, setCodeX] = useState(element.x);
  const [textY, setCodeY] = useState(element.y);
  const [error, setError] = useState("");

  const onSubmit = () => {
    if (code === "") {
      setError("Code cannot be empty");
    } else if (isNaN(parseFloat(width)) || parseFloat(width) < 0 || parseFloat(width) > 100) {
      setError("Size must be a number between 0 and 100");
    } else if (isNaN(parseFloat(height)) || parseFloat(height) < 0 || parseFloat(height) > 100) {
      setError("Size must be a number between 0 and 100");
    } else if (isNaN(parseFloat(fontSize))) {
      setError("Font size must be a decimal");
    } else {
      const textElem = {
        "type": "code",
        "code": code,
        "width": width,
        "height": height,
        "fontSize": fontSize,
        "x": textX,
        "y": textY
      }
      setCodeElem(textElem);
      setCodeEditSubmit(true);
      setShowCodeEditModal(false);
    }
  }

  // let user type tab
  const handleKeys = e => {
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const tab = '\t';
      textarea.value = textarea.value.substring(0, start) + tab + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + tab.length;
    }
  }

  // when input change, remove error
  useEffect(() => {
    setError("");
  }, [code, width, height, fontSize]);

  return (
    <>
      <div className="flex fixed top-0 left-0 h-screen w-screen bg-[#00000090] z-[999] justify-center items-center">
        <div className="bg-white min-w-[40vw] rounded-lg flex flex-col px-[2%] py-[2%] m-2">
          <p className="text-3xl font-bold pb-[4%] text-gray-800">Edit code block</p>
          <div className="flex w-full justify-between">
            <textarea name="code" id="code" className="bg-gray-200 min-h-40 max-h-[65vh] w-full rounded p-2" onKeyDown={handleKeys} defaultValue={element.code} onChange={e => setCode(e.target.value)}></textarea>
          </div>
          {/* <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5">Size</p>
            <input type="text" name="Width" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full mr-5" placeholder="Enter width (%)" onChange={e => {setWidth(e.target.value)}} defaultValue={element.width} />
            <input type="text" name="Height" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter height (%)" onChange={e => {setHeight(e.target.value)}} defaultValue={element.height} />
          </div> */}
          {/* <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5">Position</p>
            <input type="text" name="X" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full mr-5" placeholder="Enter x (%)" onChange={e => {setCodeX(e.target.value)}} defaultValue={element.x} />
            <input type="text" name="Y" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter y (%)" onChange={e => {setCodeY(e.target.value)}} defaultValue={element.y} />
          </div> */}
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5 whitespace-nowrap">Font size</p>
            <input type="text" name="Font size" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter font size (em)" onChange={e => {setFontSize(e.target.value)}} defaultValue={element.fontSize} />
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-violet-500 text-white px-4 py-2 rounded" onClick={onSubmit}>Submit</button>
            <button onClick={() => setShowCodeEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
          <p className="text-red-500 flex self-center">{error}</p>
        </div>
      </div>  
    </>   
  )
}

export default CodeEditModal;