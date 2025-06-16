import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const navigateTo = useNavigate();
  const { isLoggedIn, userData} = useContext(AppContext);

  return (
    <div className='flex flex-col items-center justify-center min-h-[90vh] text-center px-4 sm:px-6 lg:px-8 mt-11'>
      <img 
        src={assets.header_img} 
        alt="header image" 
        className='w-64 sm:w-72 mb-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300'
      />
      <h1 className='text-4xl sm:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2'>
        {isLoggedIn ? `Welcome Back, ${userData?.name}!` : 'Welcome to Our Platform!'}
       
        <img 
          src={assets.hand_wave} 
          alt="wave" 
          className='w-10 h-10 animate-pulse'
        />
      </h1>
      <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mb-8'>
        {isLoggedIn 
          ? `Great to see you back, ${userData?.name}! Ready to continue your journey?`
          : 'Join our community of developers and start building amazing things together!'
        }
      </p>
      {!isLoggedIn && (
        <button 
          onClick={() => navigateTo('/login')} 
          className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 
                     shadow-md hover:shadow-lg transform hover:scale-105'
        >
          Get Started
        </button>
      )}
    </div>
  );
};

export default Header;