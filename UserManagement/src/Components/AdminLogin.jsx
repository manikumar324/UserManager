import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';


const AdminLogin = () => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const bodyData = { text, password };
    console.log(bodyData);
    setLoading(true); 

    try {
      const response = await axios.post("https://usermanagerserver.onrender.com/login", bodyData);
      console.log(response.data);
      localStorage.setItem("userName" , text)
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(()=>{
          navigate("/Dashboard")
        },2000)
      } else if (response.status === 401) {
        toast.error(response.data.message);
      }
    } catch (error) {
      
      if (error.response) {
        
        console.error('Error response:', error.response);
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        
        console.error('Error request:', error.request);
        toast.error("No response from the server");
      } else {
        
        console.error('Error message:', error.message);
        toast.error("An error occurred while logging in");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3 bg-blue-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md lg:w-[300px]">
       <Link to="/"> <h2 className="text-3xl font-bold mb-6 text-center">Login</h2></Link>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="text" className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full"
              placeholder="Mani Kumar"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full"
              placeholder="Manikumar@123"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading} 
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-500'} text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300`}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;