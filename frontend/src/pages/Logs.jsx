import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logService } from '../services/api';
import '../styles/Logs.css';

function Logs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ limit: 50, offset: 0, total: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadLogs();
  }, [navigate]);

  const loadLogs = async (offset = 0) => {
    setLoading(true);
    try {
      const res = await logService.getLogs({
        limit: pagination.limit,
        offset,
      });
      setLogs(res.data.logs);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
        offset,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="logs-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>HRMS - Audit Logs</h2>
        </div>
        <div className="navbar-links">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">
            Dashboard
          </button>
          <button onClick={() => navigate('/employees')} className="nav-btn">
            Employees
          </button>
          <button onClick={() => navigate('/teams')} className="nav-btn">
            Teams
          </button>
        </div>
      </nav>

      <div className="page-content">
        <div className="header">
          <h1>Audit Logs</h1>
          <button onClick={() => loadLogs(0)} className="btn-small">
            Refresh
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>{log.User ? log.User.email : 'System'}</td>
                      <td>
                        <span className="action-badge">{log.action}</span>
                      </td>
                      <td className="details-cell">
                        <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && <p className="no-data">No logs found</p>}
            </div>

            <div className="pagination">
              <button
                onClick={() => loadLogs(Math.max(0, pagination.offset - pagination.limit))}
                disabled={pagination.offset === 0}
                className="btn-small"
              >
                Previous
              </button>
              <span>
                Showing {pagination.offset + 1} to{' '}
                {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
                {pagination.total}
              </span>
              <button
                onClick={() => loadLogs(pagination.offset + pagination.limit)}
                disabled={pagination.offset + pagination.limit >= pagination.total}
                className="btn-small"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Logs;
