import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import Presentation from "../components/Presentation"

const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, []);

    return (
        <>
            <div id="dashboard" className="flex flex-col w-screen h-screen justify-start items-center bg-gradient-to-b from-violet-500 to-violet-300">
                <button className="mt-28 mb-6 mx-14 self-start text-xl bg-violet-700 hover:bg-violet-300 text-white font-bold py-3 px-5  rounded my-2">CREATE</button>
                <div className="overflow-auto max-w-full grid grid-cols-3 max-warps:grid-cols-2  max-sm:grid-cols-1 max-h-[70%] gap-3 px-3 scrollbar scrollbar-w-2 scrollbar-thumb-violet-300 scrollbar-track-gray-3  00 scrollbar-thumb-rounded">
                    <Presentation name="hi" description="hi gg hihi hihih hihihi hi hi hi higg  hi h ih i hi hi hi hi xxxxxxxggxx asa a as a a a a asda sd asd as dsa asd asd asd asd asd sad asd asd sdsdsdsdsadjkah ajsdhsias asua sgdasdg"></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                    <Presentation name="hi" description=""></Presentation>
                </div>
            </div>
        </>
    )
}

export default Dashboard;