import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../utils/auth'; // Assuming your API call is here

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cloudscape_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial load, try to get user info from localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('cloudscape_user');
        const storedToken = localStorage.getItem('cloudscape_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
        // Clear bad data
        localStorage.removeItem('cloudscape_user');
        localStorage.removeItem('cloudscape_token');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Call the API (from ../utils/auth)
      const data = await apiLogin({ email, password });

      // The 'data' object from your API now contains:
      // { _id, name, email, isAdmin, token }

      // 1. Create user object to store
      const userToStore = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin // We get this directly from the API!
      };

      // 2. Save to localStorage
      localStorage.setItem('cloudscape_user', JSON.stringify(userToStore));
      localStorage.setItem('cloudscape_token', data.token);

      // 3. Set state
      setUser(userToStore);
      setToken(data.token);

      // 4. Return the user data so the component can redirect
      return userToStore; 
      
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Re-throw the error so the component can catch it
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cloudscape_user');
    localStorage.removeItem('cloudscape_token');
    // You might want to redirect to home or login page here
    window.location.href = '/login'; 
  };

  // The value to pass to consumers
  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAdmin: user?.isAdmin || false // Convenience helper
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Create the custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
