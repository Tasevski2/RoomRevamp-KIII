import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from './context/user';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import MyProfilePage from './pages/MyProfile';
import DesignPage from './pages/Design';
import AppLayout from './components/AppLayout';
import useCheckIfLoggedIn from './hooks/useCheckIfLoggedIn';

const App = () => {
  const { user, isUserLoading } = useUser();
  useCheckIfLoggedIn();
  let routes = (
    <>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </>
  );
  if (user) {
    routes = (
      <>
        <Route path='/' element={<HomePage />} />
        <Route path='/my-profile' element={<MyProfilePage />} />
        <Route path='/design/:id' element={<DesignPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </>
    );
  }
  return (
    <AppLayout showLoading={isUserLoading}>
      <Routes>{routes}</Routes>
    </AppLayout>
  );
};

export default App;
