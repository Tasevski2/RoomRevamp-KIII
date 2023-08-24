import { useEffect } from 'react';
import { useUser } from '../context/user';
import { API } from '../api';
import { setAuthHeader } from '../api/axios-instance';

const useCheckIfLoggedIn = () => {
  const { setUser, setIsUserLoading } = useUser();

  useEffect(() => {
    async function check() {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setIsUserLoading(false);
        return;
      }
      setAuthHeader(jwt);
      try {
        const res = await API.getMe();
        setUser(res.data);
        setIsUserLoading(false);
      } catch (error) {
        setAuthHeader();
        localStorage.removeItem('jwt');
        setIsUserLoading(false);
        return;
      }
    }
    check();
  }, [setUser, setIsUserLoading]);
};

export default useCheckIfLoggedIn;
