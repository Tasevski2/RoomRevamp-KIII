import { createContext, useContext, useState } from 'react';
import { setAuthHeader } from '../../api/axios-instance';
import { useQueryClient } from '@tanstack/react-query';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const queryClient = useQueryClient();

  const loginUser = (token, user) => {
    localStorage.setItem('jwt', token);
    setAuthHeader(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setAuthHeader();
    setUser(null);
    queryClient.clear();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
        setIsUserLoading,
        loginUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
