import { Link } from 'react-router-dom';

function UserDashboard() {
  return (
    <div className="container mt-5">
      <h2>User Dashboard</h2>
      <p>Welcome, USER!</p>
      <div className="mt-4">
        <Link to="/complaints" className="btn btn-primary me-2">My Complaints</Link>
        <Link to="/complaint/new" className="btn btn-success">Register New Complaint</Link>
      </div>
    </div>
  );
}

export default UserDashboard; 