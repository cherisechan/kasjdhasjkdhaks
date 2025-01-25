import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import Presentation from "../components/Presentation"
import CreateModal from "../components/CreateModal"

const Dashboard = () => {
  const [token, setToken] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [presList, setPresList] = useState([]);
  const [showList, setShowList] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (!getToken) {
      navigate("/login");
    } else {
      localStorage.removeItem("pId");
      setToken(getToken);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const headers = {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const storage = await axios.get("https://presto-beta.vercel.app/store", headers);
      // if (Object.keys(storage.data.store).length !== 0) {
      //     setPresList(storage.data.store);
      //     setShowList(true);
      // }
      if (storage.data.store && storage.data.store.presentations) {
        const reversedPresentations = storage.data.store.presentations.slice().reverse();
        setPresList(reversedPresentations);
        setShowList(true);
      }
    };
    fetchData();
  }, [token, showCreate]);




  return (
    <>
      {showCreate ? (<CreateModal setShowCreate={setShowCreate}/>) : (<></>)}
      <div id="dashboard" className="flex flex-col w-screen h-screen justify-start items-center bg-gradient-to-b from-violet-500 to-violet-300">
        <button className="mt-28 mb-6 mx-14 self-start text-xl bg-violet-700 hover:bg-violet-300 text-white font-bold py-3 px-5  rounded my-2" onClick={() => setShowCreate(true)}>CREATE</button>
        <div className="overflow-auto max-w-full grid grid-cols-3 max-warps:grid-cols-2  max-sm:grid-cols-1 max-h-[70%] gap-3 px-3 scrollbar scrollbar-w-2 scrollbar-thumb-violet-300 scrollbar-track-gray-3  00 scrollbar-thumb-rounded">
          {/* {showList && [...presList.presentations].reverse().map((presentation, index) => ( */}
          {showList && presList.map((presentation) => (
            <Presentation
              key={presentation.id}
              id={presentation.id}
              name={presentation.name}
              description={presentation.description}
              numSlides={presentation.slides.length}
              thumbnail={presentation.thumbnail}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard;