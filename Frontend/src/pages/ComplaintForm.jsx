import { useState, useRef, useEffect } from 'react';
import api from '../api';
import Toast from '../components/Toast';

const CATEGORIES = ['Technical', 'Service', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

function ComplaintForm({ username }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current && titleRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/complaints', {
        title,
        description,
        category,
        priority,
        customerName: username, // Use username as customer name
        complaintText: description // Use description as complaint text
      });
      setToast({ message: 'Complaint registered successfully!', type: 'success' });
      setTitle(''); 
      setDescription(''); 
      setCategory(CATEGORIES[0]); 
      setPriority(PRIORITIES[0]);
    } catch (err) {
      console.error('Complaint submission error:', err);
      setToast({ message: err.response?.data || 'Failed to register complaint', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Register Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input ref={titleRef} type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)} required>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
    </div>
  );
}

export default ComplaintForm; 