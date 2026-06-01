import { createContext, useContext, useState, useEffect } from "react";

import { subscribeToAuthChanges } from "@/lib/firebase";






const AuthContext = createContext({
  currentUser: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);





export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>);

};