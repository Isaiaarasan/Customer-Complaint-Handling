import { Navigate } from 'react-router-dom';

function PrivateRoute({ auth, role, children }) {
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has the required role (handle both ROLE_ADMIN and ADMIN formats)
  const hasRole = auth.roles.some(userRole => 
    userRole === role || 
    userRole === `ROLE_${role}` || 
    userRole.replace('ROLE_', '') === role
  );
  
  if (role && !hasRole) {
    // Redirect to appropriate dashboard if role doesn't match
    if (auth.roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN')) {
      return <Navigate to="/admin-dashboard" />;
    }
    if (auth.roles.some(r => r === 'USER' || r === 'ROLE_USER')) {
      return <Navigate to="/user-dashboard" />;
    }
    return <Navigate to="/" />;
  }
  
  return children;
}

export default PrivateRoute; 