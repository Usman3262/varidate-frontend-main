import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword } from '../Redux/Auth';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react'; // icon library

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.authslice);

  const handleSendCode = async (e) => {
    e.preventDefault();
    const action = await dispatch(forgotPassword(email));
    if (action.meta.requestStatus === 'fulfilled') {
      setCodeSent(true);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || newPassword.length < 5) return;

    const action = await dispatch(resetPassword({ email, code, newPassword }));
    if (action.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>

        <form onSubmit={codeSent ? handleResetPassword : handleSendCode}>
          {/* Email input */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f4793d] mb-4"
            disabled={codeSent}
          />

          {/* Show code/password fields after code is sent */}
          {codeSent && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                value={code}
                required
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f4793d] mb-4"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  required
                  minLength={5}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#f4793d]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-[#f4793d] hover:bg-black text-white py-2 rounded transition duration-200"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : codeSent
              ? 'Reset Password'
              : 'Send Reset Code'}
          </button>
        </form>

        {/* Feedback messages */}
        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
