import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
   axios.defaults.withCredentials = true; 


    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

const getAuthStatus = async () => {
  try {
    // or from cookies/sessionStorage
    const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
  withCredentials: true
});
    if (data.success) {
      setIsLoggedIn(true);
      setUserData(data.user); // if your backend returns user info
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
    toast.error(error.response?.data?.message || "Failed to check authentication status");
    return false;
  }
};

    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.get(`${backendUrl}/api/user/user-data`)
            data.success ? setUserData(data.userData) : toast.error(data.message);     
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error(error.response?.data?.message || "Failed to fetch user data");
            return false;
        }
    }
       

    // Verify token and fetch fresh user data
   useEffect(() => {
  let isMounted = true;
  const fetchStatus = async () => {
    const success = await getAuthStatus();
    if (success && isMounted) getUserData();
  };
  fetchStatus();

  return () => { isMounted = false };
}, []);

   
  

    const value = {
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData 
       
    };

    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;