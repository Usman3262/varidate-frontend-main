import React, { useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { resendVerificationCode, verifyEmailToken } from '../Redux/Auth';

function VerifyEmailCode() {
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(verifyEmailToken({ email, code }));
      if (!response.error) {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || "Verification failed");
    }
  };

const handleResend = async () => {
  try {
    const response = await dispatch(resendVerificationCode({ email })); // Pass as object
    if (!response.error) {
      toast.success("Verification code resent!");
      setResendCooldown(60);
      const countdown = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  } catch (error) {
    toast.error(error.message || "Failed to resend code");
  }
};
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">

        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-white text-black flex flex-col items-center justify-center p-10">
          <img src="/Images/logo.png" alt="Logo" className="h-16 mb-6" />
          <h2 className="text-3xl font-bold mb-2 border-b-2 border-white pb-1">Email Verification</h2>
          <p className="text-gray-500 text-sm text-center">Secure your account by verifying your email</p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10">
          <h3 className="text-2xl font-bold text-black mb-4">Verify Code</h3>
          <p className="mb-4 text-gray-700">
            Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={handleVerify}>
            <div className="mb-4">
              <label className="block text-gray-800 mb-2 font-semibold">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#f4793d]"
                placeholder="Enter 6-digit code"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f4793d] text-white font-bold py-2 rounded hover:bg-black transition duration-300"
            >
              Verify
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`text-sm font-semibold ${
                resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#f4793d] hover:underline'
              }`}
            >
              {resendCooldown > 0
                ? `Resend Code in ${resendCooldown}s`
                : 'Resend Verification Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailCode;
