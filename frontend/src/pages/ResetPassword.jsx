import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email: formData.email
      });

      if (data.success) {
        toast.success('OTP sent successfully');
        setOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setFormData({ ...formData, otp: newOtpDigits.join('') });

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const OtpInput = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 text-center">
        Enter 6-digit OTP sent to your email
      </label>
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
      <input type="hidden" name="otp" value={otpDigits.join('')} />
    </div>
  );

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      otp: otpDigits.join('')
    };

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, payload);

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="w-full bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <img
              src={assets.logo}
              alt="Logo"
              className="h-8 w-auto cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate('/')}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen pt-20">
        <div className="max-w-md w-full mx-4 my-8">
          <div className="bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-xl">
            {/* Title with animation */}
            <div className="text-center mb-8 transform transition-all duration-300 hover:scale-105">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {otpSent ? 'Verify OTP' : 'Reset Password'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {otpSent ? 'Check your email for the OTP code' : 'Enter your email to receive OTP'}
              </p>
            </div>

            <form onSubmit={otpSent ? handleResetPassword : handleRequestOTP} className="space-y-6">
              {/* Email Input with improved styling */}
              {!otpSent && (
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img src={assets.mail_icon} alt="email" className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced OTP Input */}
              {otpSent && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-center text-gray-700">
                      Enter 6-digit OTP sent to your email
                    </label>
                    <div className="flex justify-center gap-3">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                                   shadow-sm hover:shadow-md"
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {/* New Password Input with enhanced styling */}
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <img src={assets.lock_icon} alt="password" className="h-5 w-5 text-blue-500" />
                      </div>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white
                           transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                           ${isLoading 
                             ? 'bg-gray-400 cursor-not-allowed' 
                             : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                           }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  otpSent ? 'Reset Password' : 'Send OTP'
                )}
              </button>
            </form>

            {/* Enhanced Back to Login Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
};

export default ResetPassword;
