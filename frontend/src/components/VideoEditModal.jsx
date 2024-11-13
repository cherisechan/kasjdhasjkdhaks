import React, { useEffect, useState } from 'react';

const VideoEditModal = ({ element, setVideoElem, setVideoEditSubmit, setShowVideoEditModal }) => {
  const [width, setWidth] = useState(element.width);
  const [height, setHeight] = useState(element.height);
  const [videoUrl, setVideoUrl] = useState(element.src);
  const [autoplay, setAutoplay] = useState(element.autoplay);
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (videoUrl === "") {
      setError("Please provide a YouTube embed URL.");
    } else if (!videoUrl.includes("youtube.com/embed/")) {
      setError("Invalid YouTube embed URL.");
    } else if (isNaN(parseFloat(width)) || parseFloat(width) <= 0 || parseFloat(width) > 100) {
      setError("Width must be a number between 1 and 100.");
    } else if (isNaN(parseFloat(height)) || parseFloat(height) <= 0 || parseFloat(height) > 100) {
      setError("Height must be a number between 1 and 100.");
    } else {
      const videoElem = {
        type: "video",
        src: videoUrl,
        autoplay: autoplay,
        width: width,
        height: height,
        x: element.x,
        y: element.y,
        z: element.z,
      };
      setVideoElem(videoElem);
      setVideoEditSubmit(true);
      setShowVideoEditModal(false);
    }
  };

  useEffect(() => {
    setError('');
  }, [width, height, videoUrl, autoplay]);

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
        <p className="text-3xl font-bold pb-4 text-gray-800">Edit Video</p>

        <div className="flex w-full items-center mb-4">
          <label className="text-xl mr-5 w-32">Video URL</label>
          <input type="text" className="bg-gray-50 border px-2 py-1 w-full" placeholder="YouTube embed URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}/>
        </div>

        {/* <div className="flex w-full items-center mb-4">
          <label className="text-xl mr-5 w-32">Size (%)</label>
          <input type="text" className="bg-gray-50 border px-2 py-1 w-full mr-2" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)}/>
          <input type="text" className="bg-gray-50 border px-2 py-1 w-full" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)}/>
        </div> */}

        <div className="flex items-center mb-4">
          <label className="text-xl mr-5 w-32">Autoplay</label>
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
        </div>

        <div className="mt-4 flex space-x-2">
          <button className="bg-violet-500 text-white px-4 py-2 rounded" onClick={onSubmit}>Submit</button>
          <button onClick={() => setShowVideoEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default VideoEditModal;
