import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
import './App.css';
import ComplaintForm from './pages/ComplaintForm';
import MyComplaints from './pages/MyComplaints';
import AdminComplaints from './pages/AdminComplaints';
import api, { parseJwt } from './api';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [auth, setAuth] = useState({ isAuthenticated: false, roles: [], username: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      console.log('Initializing auth with token:', token ? 'exists' : 'missing');
      
      if (token) {
        const payload = parseJwt(token);
        console.log('JWT payload:', payload);
        
        if (payload && payload.exp) {
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (payload.exp > currentTime) {
            setAuth({
              isAuthenticated: true,
              roles: payload.roles || [],
              username: payload.sub || '',
            });
            console.log('Auth initialized successfully');
          } else {
            console.log('Token expired, clearing auth');
            localStorage.removeItem('token');
            setAuth({ isAuthenticated: false, roles: [], username: '' });
          }
        } else {
          console.log('Invalid token payload, clearing auth');
          localStorage.removeItem('token');
          setAuth({ isAuthenticated: false, roles: [], username: '' });
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false, roles: [], username: '' });
  };

  // Helper function to check if user has admin role
  const isAdmin = () => {
    return auth.roles.some(role => role === 'ADMIN' || role === 'ROLE_ADMIN');
  };

  // Helper function to check if user has user role
  const isUser = () => {
    return auth.roles.some(role => role === 'USER' || role === 'ROLE_USER');
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Initializing application...</p>
      </div>
    );
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Customer Complaint System</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {!auth.isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Welcome, {auth.username}</span>
                  </li>
                  {isAdmin() && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin/complaints">All Complaints</Link>
                      </li>
                    </>
                  )}
                  {isUser() && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user-dashboard">User Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/complaint/new">New Complaint</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/complaints">My Complaints</Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          auth.isAuthenticated ? 
            <Navigate to={isAdmin() ? '/admin-dashboard' : '/user-dashboard'} /> : 
            <Login setAuth={setAuth} />
        } />
        <Route path="/register" element={
          auth.isAuthenticated ? 
            <Navigate to={isAdmin() ? '/admin-dashboard' : '/user-dashboard'} /> : 
            <Register />
        } />
        
        {/* Protected Routes */}
        <Route path="/user-dashboard" element={
          <PrivateRoute auth={auth} role="USER">
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin-dashboard" element={
          <PrivateRoute auth={auth} role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/complaint/new" element={
          <PrivateRoute auth={auth} role="USER">
            <ComplaintForm username={auth.username} />
          </PrivateRoute>
        } />
        <Route path="/complaints" element={
          <PrivateRoute auth={auth} role="USER">
            <MyComplaints username={auth.username} />
          </PrivateRoute>
        } />
        <Route path="/admin/complaints" element={
          <PrivateRoute auth={auth} role="ADMIN">
            <AdminComplaints />
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
