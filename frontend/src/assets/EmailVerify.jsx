import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerify = () => {
    const { userData, backendUrl, setUserData } = useContext(AppContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    // ...existing handleOtpChange and handleKeyDown functions...

    const handleSendOTP = async () => {
        if (!userData?._id) {
            toast.error('User ID not found');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
                userId: userData._id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                toast.success('OTP sent successfully');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!userData?._id) {
            toast.error('User ID not found');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/auth/verify-account`, {
                userId: userData._id,
                otp: otpDigits.join('')
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setUserData(prev => ({
                    ...prev,
                    isVerified: true
                }));
                toast.success('Email verified successfully');
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Add loading state to the component
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Please log in to verify your email</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 text-blue-600 hover:text-blue-500"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // ...existing JSX return...
};

export default EmailVerify;