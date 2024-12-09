import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {

    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    
    const checkAuth = () => {
      if (isAuthenticated || (token && role === 'admin')) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated]);

  if (isLoading) {
    return null; 
  }

  if (!isAuthorized) {
    enqueueSnackbar('Not Authorized. Admin access required.', { variant: 'error' });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 