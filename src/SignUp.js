import React, { useState } from 'react';
import Lottie from "lottie-react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

import SignUpLottie from "./SignUpLottie.json";
import './index.css';
import bcrypt from 'bcryptjs';
import axios from 'axios';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const saltRounds = 10;

  const navigate = useNavigate(); // Initialize useNavigate hook

  const validate = () => {
    console.log("Validating form input...");
    let errors = {};
  
    // Validate name
    if (!name) {
      errors.name = 'Name is required';
      console.log('Validation error: Name is required');
    }
  
    // Validate email
    if (!email) {
      errors.email = 'Email is required';
      console.log('Validation error: Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
      console.log('Validation error: Email address is invalid');
    }
  
    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      console.log('Validation error: Password is required');
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      console.log('Validation error: Password must be at least 6 characters');
    }

    console.log("no error in validation")
  
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("running ig")
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // console.log("vlaidatio error")
      setErrors(validationErrors);
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const response = await axios.post('http://localhost:5000/api/signup', {
          name,
          email,
          password: hashedPassword, 
        });

        setMessage(response.data.message);
       

        if (response.status === 201) {  
          navigate('/resume'); 
          console.log(response.data)
          const userId = response.data.userId; 
          localStorage.setItem('userId', userId);
          console.log(localStorage.getItem('userId'));
        }

      } catch (err) {
        console.error('Error during signup:', err);
        setMessage('Signup failed. Please try again.');
      }
    }
  };

  return (
    <section className=" ">
     <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl flex items-center justify-center font-bold mt-5 px-2 sm:px-4">
  <h1 className="border-r-4 border-black inline-block animate-reveal text-gradient text-center max-w-full overflow-hidden">
    Please Signup first to upload your resume
  </h1>
</div>

      <div className="flex rounded-2xl my-14 mx-auto shadow-lg max-w-5xl lg:p-5 items-center">
        <div className="lg:w-1/2 w-full p-3 text-customStart">
          <h2 className="text-4xl text-center font-semibold">SignUp</h2>
          <p className="text-center text-sm mt-1 font-semibold">Create your account</p>
          {message && <p className="text-center mt-2 text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 p-2">
            <div className="grid gap-4">
            
              <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    required={true}
                    onChange={(e) => setName(e.target.value)}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                  />
                  <label className="absolute left-0 font-normal text-gray-500 transition-all peer-placeholder-shown:text-sm peer-focus:text-[11px] -top-1.5">
                    Name
                  </label>
                </div>
              </div>
              <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    type="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                  />
                  <label className="absolute left-0 font-normal text-gray-500 transition-all peer-placeholder-shown:text-sm peer-focus:text-[11px] -top-1.5">
                    Email
                  </label>
                </div>
              </div>
              <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    type="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                  />
                  <label className="absolute left-0 font-normal text-gray-500 transition-all peer-placeholder-shown:text-sm peer-focus:text-[11px] -top-1.5">
                    Password
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-3 mb-0">
              <button className="rounded-xl w-full bg-blue-500 text-gray-50 py-3 text-center text-xl hover:bg-#ffb800 hover:scale-100 duration-300 font-semibold">
                SignUp
              </button>
            </div>
          </form>
        </div>
        <div className="lg:block hidden w-1/2">
          <Lottie animationData={SignUpLottie} loop={true} />
        </div>
      </div>
    </section>
  );
}

export default Signup;