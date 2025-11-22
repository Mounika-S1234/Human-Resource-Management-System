import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [organisation, setOrganisation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const org = JSON.parse(localStorage.getItem('organisation') || '{}');
    const usr = JSON.parse(localStorage.getItem('user') || '{}');

    setOrganisation(org);
    setUser(usr);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organisation');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>HRMS</h2>
        </div>
        <div className="navbar-links">
          <button onClick={() => navigate('/employees')} className="nav-btn">
            Employees
          </button>
          <button onClick={() => navigate('/teams')} className="nav-btn">
            Teams
          </button>
          <button onClick={() => navigate('/logs')} className="nav-btn">
            Audit Logs
          </button>
          <button onClick={handleLogout} className="nav-btn logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome to HRMS</h1>
          <p>Organisation: <strong>{organisation?.name}</strong></p>
          <p>User: <strong>{user?.name}</strong></p>
          <p>Email: <strong>{user?.email}</strong></p>
        </div>

        <div className="quick-links">
          <h2>Quick Links</h2>
          <div className="links-grid">
            <button onClick={() => navigate('/employees')} className="link-card">
              <h3>👥 Manage Employees</h3>
              <p>Create, update, and manage employees</p>
            </button>
            <button onClick={() => navigate('/teams')} className="link-card">
              <h3>🏢 Manage Teams</h3>
              <p>Create and manage teams</p>
            </button>
            <button onClick={() => navigate('/logs')} className="link-card">
              <h3>📋 Audit Logs</h3>
              <p>View system audit trail</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
