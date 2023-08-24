import { useEffect } from 'react';

const useKeyPress = ({ key = 'Enter', callback }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === key) {
        callback && callback();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, callback]);
};

export default useKeyPress;
