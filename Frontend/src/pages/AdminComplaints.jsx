import { useState, useEffect } from 'react';
import api from '../api';
import Toast from '../components/Toast';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];
const PAGE_SIZE = 10;

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authDebug, setAuthDebug] = useState('');

  useEffect(() => {
    // Debug authentication state
    const token = localStorage.getItem('token');
    const authInfo = {
      token: token ? 'exists' : 'missing',
      tokenLength: token ? token.length : 0,
      currentUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
    setAuthDebug(JSON.stringify(authInfo, null, 2));
    
    fetchComplaints();
    // eslint-disable-next-line
  }, [page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      console.log('Fetching complaints...'); // Debug log
      const res = await api.get('/api/complaints');
      console.log('Complaints response:', res.data); // Debug log
      const data = res.data || [];
      setComplaints(data);
      setTotal(data.length);
      
      if (data.length === 0) {
        setToast({ message: 'No complaints found. Users need to register complaints first.', type: 'info' });
      }
    } catch (err) {
      console.error('Fetch complaints error:', err);
      setToast({ message: err.response?.data || 'Failed to fetch complaints', type: 'danger' });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    try {
      const res = await api.get('/api/auth/debug');
      console.log('Auth debug response:', res.data);
      setToast({ 
        message: `Auth test successful! User: ${res.data.username}, Roles: ${res.data.authorities.join(', ')}`, 
        type: 'success' 
      });
    } catch (err) {
      console.error('Auth test error:', err);
      setToast({ 
        message: `Auth test failed: ${err.response?.data || err.message}`, 
        type: 'danger' 
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/complaints/${id}?status=${status}`);
      setToast({ message: 'Status updated successfully!', type: 'success' });
      fetchComplaints();
    } catch (err) {
      console.error('Status update error:', err);
      setToast({ message: err.response?.data || 'Failed to update status', type: 'danger' });
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
      <h2 className="mb-4">All Complaints</h2>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading complaints...</p>
        </div>
      ) : (
        <>
          {complaints.length === 0 ? (
            <div className="alert alert-warning">
              <h4>No Complaints Found</h4>
              <p>There are currently no complaints in the system. To see complaints:</p>
              <ol>
                <li>Register a regular user account</li>
                <li>Login as that user</li>
                <li>Create some complaints</li>
                <li>Come back here to view them as admin</li>
              </ol>
              <button className="btn btn-primary" onClick={fetchComplaints}>
                Refresh Complaints
              </button>
            </div>
          ) : (
            <>
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Customer</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedComplaints.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.title || c.complaintText}</td>
                      <td>{c.customerName || c.user?.username}</td>
                      <td>{c.category}</td>
                      <td>
                        <span className={`badge bg-${c.priority === 'High' ? 'danger' : c.priority === 'Medium' ? 'warning' : 'success'}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td>
                        <select className="form-select form-select-sm" value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)}>
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>{formatDate(c.createdAt)}</td>
                      <td>
                        <button className="btn btn-sm btn-info" onClick={() => setSelected(c)}>View</button>
                      </td>
                    </tr>
                  ))}
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
        </>
      )}
      
      {/* Modal for details */}
      {selected && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complaint Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>ID:</strong> {selected.id}</p>
                    <p><strong>Title:</strong> {selected.title || 'N/A'}</p>
                    <p><strong>Description:</strong> {selected.description || selected.complaintText || 'N/A'}</p>
                    <p><strong>Category:</strong> {selected.category || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Priority:</strong> {selected.priority || 'N/A'}</p>
                    <p><strong>Status:</strong> {selected.status || 'N/A'}</p>
                    <p><strong>Customer:</strong> {selected.customerName || selected.user?.username || 'N/A'}</p>
                    <p><strong>Created:</strong> {formatDate(selected.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
    </div>
  );
}

export default AdminComplaints; 