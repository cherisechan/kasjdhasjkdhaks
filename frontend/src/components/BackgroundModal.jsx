import React, { useEffect, useState } from "react";
import axios from "axios";

const BackgroundModal = ({ setShowBackgroundModal, currSlideIndex, setReload }) => {
  const [option, setOption] = useState(0);
  const [colour1, setColour1] = useState("#FFFFFF");
  const [defaultBg, setDefaultBg] = useState(false);

  const handleSubmit = async() => {
    const token = localStorage.getItem("token");
    const headers = {
        headers: {
          'Authorization': `Bearer ${token}`,
      }
    };
    const response = await axios.get(`http://localhost:5005/store`, headers);
    const store = response.data.store;
    const pid = localStorage.getItem('pId');
    // background colour only
    if (option === 0) {
      store.presentations.map(p => {
        if (p.id === pid) {
          if (defaultBg) {
            p.slides[currSlideIndex].background.default = true;
            p.defaultBackground = {
              "colour1": colour1,
              "colour2": null,
              "img": null,
              "gradient": false,
              "default": true,
            }
            // set the same colour for all default bg
            p.slides.forEach((s) => {
              if (s.background.default) {
                s.background.gradient = false;
                s.background.img = null;
                s.background.colour1 = colour1;
              }
            })
          } else {
            p.slides[currSlideIndex].background.default = false;
            p.slides[currSlideIndex].background.colour1 = colour1;
            p.slides[currSlideIndex].background.img = null;
            p.slides[currSlideIndex].background.gradient = false;
          }
        }
      })
      await axios.put(`http://localhost:5005/store`, {store}, headers);
      setReload(true);
      setShowBackgroundModal(false);
    }
  }

  return (
    <>
      <div className="flex fixed top-0 left-0 h-screen w-screen bg-[#00000090] z-[999] justify-center items-center">
        <div className="bg-white min-w-[40vw] rounded-lg flex flex-col px-[2%] py-[2%] m-2">
          <p className="text-3xl font-bold pb-[4%] text-gray-800">Theme picker</p>
          <select id="theme-dropdown" className="bg-gray-200 w-fit px-2 py-2 rounded border border-gray-400" onChange={e => setOption(parseInt(e.target.value))}>
            <option value="0">Fill</option>
            <option value="1">Gradient</option>
            <option value="2">Image</option>
          </select>
          {
            option === 0 && (
              <div className="flex py-4 items-center">
                <p className="pr-4">Colour</p>
                <input type="color" name="colour-picker" className="w-14 h-14 bg-white" onChange={e => setColour1(e.target.value)} defaultValue={"#FFFFFF"}/>
              </div>
            )
          }
          {
            option === 1 && (
              <div>
                gradient
              </div>
            )
          }
          {
            option === 2 && (
              <div>
                img
              </div>
            )
          }
          <div className="flex">
            <p>Set as default?</p>
            <input type="checkbox" name="default" className="ml-2" onChange={e => setDefaultBg(e.target.checked)}/>
          </div>
          <div className="mt-2 flex space-x-2">
            <button className="bg-violet-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Apply</button>
            <button onClick={() => setShowBackgroundModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
          <p className="text-red-500 flex self-center"></p>
        </div>
      </div>  
    </>   
  )
}

export default BackgroundModal;