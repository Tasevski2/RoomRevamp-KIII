import { UserProvider } from './user';

const GlobalProviders = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default GlobalProviders;
