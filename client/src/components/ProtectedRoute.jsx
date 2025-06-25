
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { companyToken, isLoadingToken } = useContext(AppContext);

  if (isLoadingToken) return null; 
  if (!companyToken) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
