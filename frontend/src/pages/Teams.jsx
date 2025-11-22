import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamService, employeeService } from '../services/api';
import TeamForm from '../components/TeamForm';
import '../styles/Teams.css';

function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamRes, empRes] = await Promise.all([
        teamService.listTeams(),
        employeeService.listEmployees(),
      ]);
      setTeams(teamRes.data.teams);
      setEmployees(empRes.data.employees);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamService.deleteTeam(id);
        setTeams(teams.filter((team) => team.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete team');
      }
    }
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTeam(null);
    loadData();
  };

  return (
    <div className="teams-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>HRMS - Teams</h2>
        </div>
        <div className="navbar-links">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">
            Dashboard
          </button>
          <button onClick={() => navigate('/employees')} className="nav-btn">
            Employees
          </button>
          <button onClick={() => navigate('/logs')} className="nav-btn">
            Logs
          </button>
        </div>
      </nav>

      <div className="page-content">
        <div className="header">
          <h1>Teams</h1>
          <button
            onClick={() => {
              setSelectedTeam(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            + Add Team
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <TeamForm
            team={selectedTeam}
            employees={employees}
            onClose={handleFormClose}
          />
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <div key={team.id} className="team-card">
                <h3>{team.name}</h3>
                <p>{team.description || 'No description'}</p>
                <div className="team-info">
                  <p>
                    <strong>Members:</strong> {team.Employees ? team.Employees.length : 0}
                  </p>
                  {team.Employees && team.Employees.length > 0 && (
                    <div className="team-members">
                      <strong>Team Members:</strong>
                      <ul>
                        {team.Employees.map((emp) => (
                          <li key={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="team-actions">
                  <button onClick={() => handleEdit(team)} className="btn-small">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(team.id)} className="btn-small btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {teams.length === 0 && !loading && <p className="no-data">No teams found</p>}
      </div>
    </div>
  );
}

export default Teams;
