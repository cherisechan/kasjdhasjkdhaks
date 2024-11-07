import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Register = ({ onRegister }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const submitRegister = (e) => {
        e.preventDefault();
        setShowError(true);
        if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Invalid email");
            return;
        }
        if (password === "") {
            setError("Password cannot be empty");
            return;
        }
        if (name === "") {
            setError("Name cannot be empty");
            return;
        }

        axios.post('http://localhost:5005/admin/auth/register', {
            email: email,
            password: password,
            name: name
        })
        .then(res => {
            localStorage.setItem('token', res.data.token);
            onRegister();
            navigate('/dashboard');
        })
        .catch(err => {
            setError('Registration failed. Please use another email.')
        })
    }

    const goToLogin = (e) => {
        e.preventDefault();
        navigate('/login');
    }

    return (
        <>
            <div id="register" className="flex w-screen h-screen justify-center items-center bg-violet-200">
                <form id="register-form" className="flex flex-col p-9 bg-white rounded-lg shadow-lg text-center">
                    <h1 className="text-4xl font-bold pb-3">Welcome!</h1>
                    <p className="text-2xl pb-4 text-gray-700">Create a new account!</p>
                    <div className="w-min text-lg">
                        <div className="flex justify-between w-full mb-3">
                            <p className="w-min mr-3 self-center">Email</p>
                            <input id="register-email" type="email" className="bg-violet-50 px-2 py-1 pr-6 rounded border-solid border-2 border-gray-200" placeholder="Enter your email" onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex justify-between w-full mb-3">
                            <p className="w-min mr-3 self-center">Password</p>
                            <input id="register-password" type="password" className="bg-violet-50 px-2 py-1 pr-6 rounded border-solid border-2 border-gray-200" name="password" placeholder="Enter your password" onChange={e => setPassword(e.target.value)}/>
                        </div>
                        <div className="flex justify-between w-full mb-3">
                            <p className="w-min mr-3 self-center whitespace-nowrap">Confirm password</p>
                            <input id="register-confirm-password" type="password" className="bg-violet-50 px-2 py-1 pr-6 rounded border-solid border-2 border-gray-200" name="password" placeholder="Re-enter your password" onChange={e => setPassword(e.target.value)}/>
                        </div>
                        <div className="flex justify-between w-full mb-3">
                            <p className="w-min mr-3 self-center">Name</p>
                            <input id="register-name" type="text" className="bg-violet-50 px-2 py-1 pr-6 rounded border-solid border-2 border-gray-200" name="name" placeholder="Enter your name" onChange={e => setName(e.target.value)}/>
                        </div>
                    </div>
                    <button className="bg-violet-700 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded my-2" onClick={submitRegister}>REGISTER</button>
                    <button className="py-2 px-4 rounded my-2" onClick={goToLogin}>Already have an account? <span className="text-violet-700 hover:underline">Log in</span></button>
                    {showError ? (<p className="text-red-600">{error}</p>) : (<></>)}
                </form>
            </div>
        </>
    )
}

export default Register;