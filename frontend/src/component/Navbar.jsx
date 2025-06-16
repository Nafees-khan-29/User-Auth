import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData, logoutUser } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className='w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0 cursor-pointer' onClick={() => navigate('/')}>
            <img 
              src={assets.logo} 
              alt="logo" 
              className='h-8 w-auto'
            />
          </div>

          {/* User Section / Login Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <span className="font-medium text-gray-700">
                  {userData?.name?.split(' ')[0]}
                </span>
                <img 
                  src={assets.arrow_icon} 
                  alt="arrow" 
                  className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {!userData?.isVerified && (
                    <button
                      onClick={() => {
                        navigate('/email-verify');
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="h-2 w-2 bg-yellow-400 rounded-full"></span>
                      Verify Email
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowDropdown(false);
                      navigate('/logout');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <img 
                      src={assets.logout_icon} 
                      alt="logout" 
                      className="w-4 h-4"
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300'
            >
              Login
              <img 
                src={assets.arrow_icon} 
                alt="arrow" 
                className='w-4 h-4'
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar