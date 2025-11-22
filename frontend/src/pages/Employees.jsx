import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, teamService } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import '../styles/Employees.css';

function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
      const [empRes, teamRes] = await Promise.all([
        employeeService.listEmployees(),
        teamService.listTeams(),
      ]);
      setEmployees(empRes.data.employees);
      setTeams(teamRes.data.teams);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    loadData();
  };

  return (
    <div className="employees-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>HRMS - Employees</h2>
        </div>
        <div className="navbar-links">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">
            Dashboard
          </button>
          <button onClick={() => navigate('/teams')} className="nav-btn">
            Teams
          </button>
          <button onClick={() => navigate('/logs')} className="nav-btn">
            Logs
          </button>
        </div>
      </nav>

      <div className="page-content">
        <div className="header">
          <h1>Employees</h1>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            + Add Employee
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <EmployeeForm
            employee={selectedEmployee}
            teams={teams}
            onClose={handleFormClose}
          />
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="employees-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Teams</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      {employee.Teams && employee.Teams.length > 0
                        ? employee.Teams.map((t) => t.name).join(', ')
                        : 'Not assigned'}
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEdit(employee)} className="btn-small">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && <p className="no-data">No employees found</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
