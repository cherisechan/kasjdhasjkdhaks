import { useEffect, useState } from "react";
import uniqid from "uniqid";
const CodeCreateModal = ({ setCodeElem, setCodeSubmit, setShowCodeCreateModal }) => {
  const [code, setCode] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [error, setError] = useState("");
  const onSubmit = () => {
    if (code === "") {
      setError("Code cannot be empty");
      return;
    }
    if (!parseFloat(width) || !parseFloat(height)) {
      setError("Size must be a number between 0 and 100");
      return;
    }
    if (parseFloat(width) < 0 || parseFloat(width) > 100 || parseFloat(height) < 0 || parseFloat(height) > 100) {
      setError("Size must be a number between 0 and 100");
      return;
    }
    if (!parseFloat(fontSize)) {
      setError("Size must be a positive number");
      return;
    }

    const codeElem = {
      "id": uniqid(),
      "type": "code",
      "code": code,
      "width": width,
      "height": height,
      "fontSize": fontSize,
      "x": 0,
      "y": 0
    }
    setCodeElem(codeElem);
    setCodeSubmit(true);
    setShowCodeCreateModal(false);
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
          <p className="text-3xl font-bold pb-[4%] text-gray-800">Add a code block</p>
          <textarea name="code" id="code" className="bg-gray-200 min-h-40 max-h-[65vh] rounded p-2" onKeyDown={handleKeys} onChange={e => setCode(e.target.value)}></textarea>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5">Size</p>
            <input type="text" name="Width" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full mr-5" placeholder="Enter width (%)" onChange={e => {setWidth(e.target.value)}} />
            <input type="text" name="Height" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter height (%)" onChange={e => {setHeight(e.target.value)}} />
          </div>
          <div className="flex w-full justify-between mt-[4%]">
            <p className="text-xl pb-[1%] mr-5 whitespace-nowrap">Font size</p>
            <input type="text" name="Font size" className="bg-gray-50 rounded-sm border border-gray-200 px-2 py-1 w-full" placeholder="Enter font size (em)" onChange={e => {setFontSize(e.target.value)}} />
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-violet-500 text-white px-4 py-2 rounded" onClick={onSubmit}>Submit</button>
            <button onClick={() => setShowCodeCreateModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
          <p className="text-red-500 flex self-center">{error}</p>
        </div>
      </div>  
    </>   
  )
}

export default CodeCreateModal;