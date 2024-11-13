import React, { useEffect, useState } from "react";

const ImageEditModal = ({ element, setImageElem, setImageEditSubmit, setShowImageEditModal }) => {
  const [width, setWidth] = useState(element.width);
  const [height, setHeight] = useState(element.height);
  const [imageUrl, setImageUrl] = useState(element.src);
  const [imageFile, setImageFile] = useState(null);
  const [altText, setAltText] = useState(element.altText);
  const [imageChanged, setImageChanged] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = () => {
    if ((imageUrl === "" && !imageFile) || altText === "") {
      setError("Please provide an image URL or upload a file, and an alt text.");
    } else if (isNaN(parseFloat(width)) || parseFloat(width) <= 0 || parseFloat(width) > 100) {
      setError("Width must be a number between 1 and 100.");
    } else if (isNaN(parseFloat(height)) || parseFloat(height) <= 0 || parseFloat(height) > 100) {
      setError("Height must be a number between 1 and 100.");
    } else {
      if (imageChanged && imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          updateImageElement(imageData);
        };
        reader.readAsDataURL(imageFile);
      } else {
        updateImageElement(imageUrl);
      }
    }
  };

  const updateImageElement = (src) => {
    const imageElem = {
      type: "image",
      src: src,
      altText: altText,
      width: width,
      height: height,
      x: element.x,
      y: element.y,
    };
    setImageElem(imageElem);
    setImageEditSubmit(true);
    setShowImageEditModal(false);
  };

  useEffect(() => {
    setError("");
  }, [width, height, imageUrl, imageFile, altText]);

  // check later if prevent default is okay to use as well
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#00000090] z-[999]">
      <div className="bg-white rounded-lg flex flex-col px-6 py-4 m-2">
        <p className="text-3xl font-bold pb-4 text-gray-800">Edit Image</p>

        <div className="flex w-full items-center mb-4">
          <label className="text-xl mr-5 w-32">Image URL</label>
          <input
            type="text"
            className="bg-gray-50 border px-2 py-1 w-full"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null);
              setImageChanged(true);
            }}
            disabled={!!imageFile}
          />
        </div>

        <div className="flex w-full items-center mb-4">
          <label className="text-xl mr-5 w-32">Or Upload</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setImageUrl("");
              setImageChanged(true);
            }}
            disabled={!!imageUrl}
          />
        </div>

        <div className="flex w-full items-center mb-4">
          <label className="text-xl mr-5 w-32">Alt Text</label>
          <input
            type="text"
            className="bg-gray-50 border px-2 py-1 w-full"
            placeholder="Enter alt text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </div>

        {/* <div className="flex w-full items-center mb-4">
          <label className="text-xl mr-5 w-32">Size (%)</label>
          <input
            type="text"
            className="bg-gray-50 border px-2 py-1 w-full mr-2"
            placeholder="Width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <input
            type="text"
            className="bg-gray-50 border px-2 py-1 w-full"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div> */}

        <div className="mt-4 flex space-x-2">
          <button className="bg-violet-500 text-white px-4 py-2 rounded" onClick={onSubmit}>Submit</button>
          <button onClick={() => setShowImageEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ImageEditModal;