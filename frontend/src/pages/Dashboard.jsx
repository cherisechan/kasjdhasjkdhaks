import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import Presentation from "../components/Presentation"

const Dashboard = () => {
    const navigate = useNavigate();
    if (!localStorage.getItem("token")) {
        navigate("/login");
    }

    return (
        <>
            <div id="dashboard" className="flex w-screen h-screen justify-center items-center bg-violet-200">
                <button className="absolute top-1  bg-violet-700 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded my-2">CREATE</button>
                <div className="overflow-auto max-w-full flex flex-wrap max-h-[75%] flex-row margin-auto justify-center">                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi hi hi hi hi h ih i hi hi hi hi xxxxxxxxx asa a as a a a a asda sd asd as dsa asd asd asd asd asd sad asd asd sdsdsdsdsadjkah ajsdhsias asua sgdasdg"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>
                    <Presentation name="hi" description="hihihihihihi hihih hihihi hi"></Presentation>  
                </div>
            </div>
        </>
    )
}

export default Dashboard;