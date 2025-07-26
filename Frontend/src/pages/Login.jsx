import { useState, useRef, useEffect } from 'react';
import api from '../api';
import { parseJwt } from '../api';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current && usernameRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decoded = parseJwt(token);
      console.log('JWT Decoded:', decoded); // Debug log
      
      // Extract roles from JWT - handle different possible formats
      let roles = [];
      if (decoded.roles) {
        roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
      } else if (decoded.authorities) {
        roles = Array.isArray(decoded.authorities) ? decoded.authorities : [decoded.authorities];
      } else {
        // Fallback - check if user is admin based on username or other criteria
        roles = username.toLowerCase() === 'admin' ? ['ADMIN'] : ['USER'];
      }
      
      console.log('Extracted roles:', roles); // Debug log
      
      setAuth({
        isAuthenticated: true,
        roles: roles,
        username: decoded.sub || username,
      });
      
      setToast({ message: `Login successful! Welcome ${decoded.sub || username}`, type: 'success' });
      
      setTimeout(() => {
        // Check for admin role (handle both ROLE_ADMIN and ADMIN formats)
        const isAdmin = roles.some(role => role === 'ADMIN' || role === 'ROLE_ADMIN');
        if (isAdmin) {
          console.log('Navigating to admin dashboard'); // Debug log
          navigate('/admin-dashboard');
        } else {
          console.log('Navigating to user dashboard'); // Debug log
          navigate('/user-dashboard');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      setToast({ 
        message: error.response?.data || 'Login failed. Please check your credentials.', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input ref={usernameRef} type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
    </div>
  );
}

export default Login; 