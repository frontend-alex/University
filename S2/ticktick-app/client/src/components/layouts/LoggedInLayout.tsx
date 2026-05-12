import { useAuth } from '@/contexts/AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const LoggedInLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const blockedRoutesIfLoggedIn = ['/login', '/verify-email', '/create-account'];

  if (
    user &&
    user.emailVerified &&
    blockedRoutesIfLoggedIn.includes(location.pathname)
  ) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};  
 
export default LoggedInLayout;
