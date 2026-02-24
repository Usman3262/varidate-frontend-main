import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupuserform } from '../Redux/Auth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Newaccount() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

 const formhandler = async (e) => {
  e.preventDefault();

  if (formData.password.length < 5) {
    setPasswordError('Password must be at least 5 characters');
    return;
  }

  const response = await dispatch(signupuserform(formData));

  if (!response.error) {
    const { id, email } = response.payload;

    // ✅ Save ID and email in localStorage
    localStorage.setItem('userId', id);
    localStorage.setItem('userEmail', email);

    // Navigate to verification page
    navigate('/verify-email', { state: { email } });
  } else {
    toast.error("Signup failed.");
  }
};


  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Logo */}
        <div className="mb-8 text-center">
  <img
    src="/Images/logo.png"
    alt="Veridate Logo"
    className="h-20 w-auto mx-auto rounded-lg"
  />
</div>


        {/* Breadcrumb */}
       

        <div className="bg-white  rounded-lg overflow-hidden ">
          <div className="flex flex-col md:flex-row">
            
            {/* Signup Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-black mb-2 relative pb-3">
                  Create New Account
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#f4793d]"></span>
                </h2>
                <p className="text-gray-600">Join us today and start your shopping journey</p>
              </div>

              <form onSubmit={formhandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">First Name*</label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4793d] focus:border-transparent transition"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Last Name*</label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4793d] focus:border-transparent transition"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4793d] focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">Password*</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f4793d] focus:border-transparent transition pr-10"
                      placeholder="Enter Password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#f4793d]"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Minimum 5 characters</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f4793d] hover:bg-[#f4793d] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  Create Account
                </button>
              </form>
            </div>

            {/* Login Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-50">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-black mb-2 relative pb-3">
                  Welcome Back!
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#f4793d]"></span>
                </h2>
                <p className="text-gray-600">Already have an account? Sign in to continue.</p>
              </div>

              <Link to="/">
                <button className="w-full bg-white border-2 border-[#f4793d] text-[#f4793d] font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition duration-300 mb-8">
                  Login to Your Account
                </button>
              </Link>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                  <svg className="w-5 h-5 text-[#f4793d] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Benefits of creating an account
                </h3>
                <ul className="space-y-3 text-gray-700">
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
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f4793d] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized shopping experience</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Newaccount;
