import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/contexts/AuthProvider';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const token = new URLSearchParams(window.location.search).get('token');

      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        await login(token);
      } catch (error) {
        navigate('/login'); 
        return;
      }
    };

    handleAuth();
  }, [login, navigate]);

  useEffect(() => {
    if (user) {
      if (user.hasCompletedOnboarding) {
        navigate(`/${user.workspaces[0]}/inbox`);
        console.log(user)
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]); 

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
};

export default AuthCallback;
