import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

const CreateModal = ({ setShowCreate }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            setToken(localStorage.getItem("token"));
        }
    }, [])

    const createPres = async () => {
        if (name === "") {
            setError("Requires a name");
            return;
        }

        const headers = {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        const store = await axios.get("http://localhost:5005/store", headers);

        const presObj = {
            "name": name,
            "description": desc,
            "thumbnail": null,
            "slides": [
                {
                    "background": {
                        "colour": "#FFFFFF",
                        "img": null
                    },
                    "elements": []
                }
            ]
        }
        
        let requestBody;
        console.log(store);
        if (Object.keys(store.data.store).length === 0) {
            requestBody = {
                "store" : {
                    "presentations": [
                        presObj
                    ]
                }
            };
        } else {
            requestBody = store.data;
            requestBody.store.presentations.push(presObj);
        }
        await axios.put("http://localhost:5005/store", requestBody, headers);
        setShowCreate(false);
    }
    return (
        <>
            <div className="flex fixed top-0 left-0 h-screen w-screen bg-[#00000090] z-20 justify-center items-center">
                <div className="bg-violet-200 min-w-[40vw] min-h-[50vh] rounded-lg flex flex-col px-[2%] py-[2%] m-2">
                    <p className="text-4xl font-bold self-center pb-[4%] text-gray-800">Create a presentation</p>
                    <input name="name" type="text" className="bg-violet-50 px-4 py-2 pr-6 rounded border-solid border-2 border-gray-500" placeholder="Name of your presentation*" onChange={e => {setName(e.target.value); setError("")}}/>
                    <textarea name="desc" placeholder="Description of your presentation" className="bg-violet-50 resize-none h-[20vh] px-4 py-2  pr-6 rounded border-solid border-2 border-gray-500 mt-[3%]" onChange={e => setDesc(e.target.value)}></textarea>
                    <button className="bg-violet-700 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded mt-auto" onClick={createPres}>CREATE</button>
                    <p className="text-red-500 flex self-center">{error}</p>
                </div>
            </div>
        </>
    )
}

export default CreateModal;