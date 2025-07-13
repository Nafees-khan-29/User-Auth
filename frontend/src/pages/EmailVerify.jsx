import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // 🟢 You missed this import

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only single digit

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData?._id }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('OTP sent successfully');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Error while sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const otp = otpDigits.join('');
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

      if (data.success) {
        toast.success('Email verified successfully');
        navigate('/');
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      toast.error('Error while verifying');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter the verification code sent to <br />
          <span className="font-medium text-blue-600">{userData?.email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>

              <button
                type="submit"
                disabled={isLoading || otpDigits.includes('')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
