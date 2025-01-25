import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const submitLogin = (e) => {
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
    axios.post('https://presto-beta.vercel.app/admin/auth/login', {
      email: email,
      password: password
    })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        onLogin();
        navigate('/dashboard');
      })
      .catch(() => {
        setError('Invaid login details');
      })
  }

  const goToRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  }

  return (
    <>
      <div id="login" className="flex w-screen h-screen justify-center items-center bg-violet-200">
        <form id="login-form" className="flex flex-col p-9 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold pb-3">Welcome back!</h1>
          <p className="text-2xl pb-4 text-gray-700">Login to your account</p>
          <div className="w-min text-lg">
            <div className="flex justify-between w-full mb-3">
              <p className="w-min mr-3 self-center">Email</p>
              <input id="login-email" type="email" className="bg-violet-50 px-2 py-1 rounded border-solid border-2 border-gray-200 pr-6" placeholder="Enter your email" onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="flex justify-between w-full mb-3">
              <p className="w-min mr-3 self-center">Password</p>
              <input id="login-password" type="password" className="bg-violet-50 px-2 py-1 rounded border-solid border-2 border-gray-200 pr-6" name="password" placeholder="Enter your password" onChange={e => setPassword(e.target.value)}/>
            </div>
          </div>
          <button className="bg-violet-700 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded my-2" onClick={submitLogin} id="login-submit" >Log in</button>
          <button className="py-2 px-4 rounded my-2" onClick={goToRegister}>Don&apos;t have an account? <span className="text-violet-700 hover:underline">Sign up</span></button>
          {showError ? (<p className="text-red-600">{error}</p>) : (<></>)}
        </form>
      </div>
    </>
  )
}

export default Login;