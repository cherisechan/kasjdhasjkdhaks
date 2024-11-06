import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    if (!localStorage.getItem("token")) {
        navigate("/login");
    }

    return (
        <>
            <div id="dashboard" className="flex w-screen h-screen justify-center items-center bg-violet-200">
                <button className="bg-violet-700 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded my-2">CREATE</button>
            </div>
        </>
    )
}

export default Dashboard;