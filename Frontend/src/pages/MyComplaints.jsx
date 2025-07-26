import { useState, useEffect, useRef } from 'react';
import api from '../api';
import Toast from '../components/Toast';

const STATUSES = ['All', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];
const PAGE_SIZE = 5;

function MyComplaints({ username }) {
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState('All');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const statusRef = useRef(null);

  useEffect(() => {
    statusRef.current && statusRef.current.focus();
  }, []);

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, [status, page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/complaints/my-complaints');
      const allComplaints = res.data || [];
      
      // Filter by status if not 'All'
      const filteredComplaints = status === 'All' 
        ? allComplaints 
        : allComplaints.filter(c => c.status === status);
      
      setComplaints(filteredComplaints);
      setTotal(filteredComplaints.length);
    } catch (err) {
      console.error('Fetch complaints error:', err);
      setToast({ message: err.response?.data || 'Failed to fetch complaints', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedComplaints = complaints.slice(startIndex, endIndex);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Complaints</h2>
      <div className="mb-3">
        <label className="form-label">Filter by Status</label>
        <select ref={statusRef} className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No complaints found.</td></tr>
              ) : (
                paginatedComplaints.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.title || c.complaintText}</td>
                    <td>{c.category}</td>
                    <td>
                      <span className={`badge bg-${c.priority === 'High' ? 'danger' : c.priority === 'Medium' ? 'warning' : 'success'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${c.status === 'RESOLVED' ? 'success' : c.status === 'IN_PROGRESS' ? 'warning' : 'secondary'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{formatDate(c.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {total > PAGE_SIZE && (
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
    </div>
  );
}

export default MyComplaints; 