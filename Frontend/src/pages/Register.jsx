import { useState, useRef, useEffect } from 'react';
import api from '../api';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { label: 'User', value: 'USER' },
  { label: 'Admin', value: 'ADMIN' }
];

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState(['USER']);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const usernameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current && usernameRef.current.focus();
  }, []);

  const handleRoleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setRoles(options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/api/auth/register', {
        username,
        password,
        roles
      });
      
      setToast({ message: 'Registration successful! Please login.', type: 'success' });
      setLoading(false);
      setTimeout(() => navigate('/login'), 1200);
      
    } catch (error) {
      console.error('Registration error:', error);
      setToast({ 
        message: error.response?.data || 'Registration failed. Please try again.', 
        type: 'danger' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input ref={usernameRef} type="text" className="form-control" id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="roles" className="form-label">Roles</label>
          <select multiple className="form-select" id="roles" value={roles} onChange={handleRoleChange} required>
            {ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
    </div>
  );
}

export default Register; 