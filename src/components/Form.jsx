import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginuserform } from '../Redux/Auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

const fromhandler = async (e) => {
  e.preventDefault();
  const data = { email, password };

  try {
    const response = await dispatch(loginuserform(data));

    if (response?.payload?.message === 'Login successful.') {
      const { _id, email, firstname, lastname } = response.payload.user;

      // ✅ Store in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', `${firstname} ${lastname}`);
      localStorage.setItem('userId', _id); // 👈 Add this line

      navigate('/admin');
    }

  } catch (error) {
    // handled by toast
  }
};

  return (
    <div className="min-h-screen bg-white px-5 md:px-16 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-10 text-center">
          <img
            src="/Images/logo.png"
            alt="Veridate Logo"
            className="h-20 w-auto mx-auto"
          />
        </div>

        <div className="flex flex-col md:flex-row bg-white  rounded-lg  overflow-hidden">
          {/* Login Form */}
          <form
            onSubmit={fromhandler}
            className="w-full md:w-1/2 px-6 py-8 border-r border-gray-200"
          >
            <h2 className="text-3xl font-bold text-black mb-2 pb-2 border-b-2 border-[#f4793d]">
              Login
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome back! Sign in to your account
            </p>

            <div className="mb-5">
              <label className="font-semibold text-black">Email Address*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#f4793d] placeholder:text-gray-400"
              />
            </div>

            <div className="mb-5">
              <label className="font-semibold text-black">Password*</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#f4793d] placeholder:text-gray-400"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <Link to="/forgot-password" className="hover:underline text-[#f4793d]">
                Forgotten Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f4793d] hover:bg-black text-white font-semibold py-2 rounded transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Signup Prompt */}
          <div className="w-full md:w-1/2 px-6 py-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-black mb-2 pb-2 border-b-2 border-[#f4793d]">
              Create New Account
            </h2>
            <p className="text-gray-600 mb-6">Don't have an account yet?</p>
            <Link to="/create">
              <button className="w-full bg-[#f4793d] hover:bg-black text-white font-semibold py-2 rounded transition duration-300">
                Register
              </button>
            </Link>

            <div className="mt-8">
              <p className="text-lg font-semibold text-black mb-3">
                Why create an account?
              </p>
              <ul className="space-y-2 text-gray-700">
                 <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f4793d] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Faster checkout with saved details</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f4793d] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Track orders and order history</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f4793d] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Exclusive member discounts and offers</span>
                  </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
