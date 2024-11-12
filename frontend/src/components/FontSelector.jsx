import React, { useState, useEffect } from "react";
import axios from "axios";

const FontSelector = ({ setReload, defaultFont }) => {
  const [option, setOption] = useState(0);
  const [change, setChange] = useState(false);

  useEffect(() => {
    if (defaultFont === "Arial, Helvetica, sans-serif") {
      setOption(0);
    } else if (defaultFont === "Times New Roman, Times, serif") {
      setOption(1);
    } else if (defaultFont === "Courier New, Courier, monospace") {
      setOption(2);
    }
  }, [defaultFont]);

  useEffect(() => {
    let fontFamily;
    if (option === 0) {
      fontFamily = "Arial, Helvetica, sans-serif";
    } else if (option === 1) {
      fontFamily = "Times New Roman, Times, serif";
    } else {
      fontFamily = "Courier New, Courier, monospace";
    }

    const updateFont = async () => {
      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("http://localhost:5005/store", headers);
      const store = response.data.store;
      const id = localStorage.getItem("pId");
      store.presentations.map((pres) => {
        if (pres.id === id) {
          pres.fontFamily = fontFamily;
        }
      });
      console.log({ store });
      await axios.put("http://localhost:5005/store", { store }, headers);
      setReload(true);
    };

    if (change) {
      updateFont();
      setChange(false);
    }
  }, [change]);

  return (
    <>
      <select
        id="font-dropdown"
        className="bg-violet-500 text-white font-semibold h-10 ml-2 w-fit px-2 py-2 rounded"
        value={option}
        onChange={(e) => {
          setOption(parseInt(e.target.value));
          setChange(true);
        }}
      >
        <option value="0">Arial</option>
        <option value="1">Times New Roman</option>
        <option value="2">Courier New</option>
      </select>
    </>
  );
};

export default FontSelector;
