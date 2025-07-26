import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <p>Welcome, ADMIN!</p>
      <div className="mt-4">
        <Link to="/admin/complaints" className="btn btn-primary">View All Complaints</Link>
      </div>
    </div>
  );
}

export default AdminDashboard; 