import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 mb-3">Welcome to Project Brand</h1>
      <p className="lead mb-4">A modern user authentication system</p>
      <div>
        <Link to="/login" className="btn btn-primary me-2">Login</Link>
        <Link to="/register" className="btn btn-outline-primary">Register</Link>
      </div>
    </div>
  );
}

export default Landing; 