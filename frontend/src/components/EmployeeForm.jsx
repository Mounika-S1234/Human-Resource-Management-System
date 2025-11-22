import React, { useState } from 'react';
import { employeeService, teamService } from '../services/api';
import '../styles/Modal.css';

function EmployeeForm({ employee, teams, onClose }) {
  const [formData, setFormData] = useState(
    employee || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
  );
  const [selectedTeams, setSelectedTeams] = useState(
    employee?.Teams?.map((t) => t.id) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamToggle = (teamId) => {
    setSelectedTeams((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((t) => t !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (employee?.id) {
        // Update
        await employeeService.updateEmployee(employee.id, formData);
      } else {
        // Create
        const res = await employeeService.createEmployee(formData);
        formData.id = res.data.employee.id;
      }

      // Update team assignments
      if (employee?.Teams) {
        const oldTeamIds = employee.Teams.map((t) => t.id);
        const teamsToRemove = oldTeamIds.filter((id) => !selectedTeams.includes(id));
        const teamsToAdd = selectedTeams.filter((id) => !oldTeamIds.includes(id));

        for (const teamId of teamsToRemove) {
          await teamService.unassignEmployee(teamId, { employeeId: employee.id });
        }

        for (const teamId of teamsToAdd) {
          await teamService.assignEmployee(teamId, { employeeId: employee.id });
        }
      } else {
        for (const teamId of selectedTeams) {
          await teamService.assignEmployee(teamId, { employeeId: formData.id });
        }
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assign Teams</label>
            <div className="checkbox-group">
              {teams.map((team) => (
                <div key={team.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`team-${team.id}`}
                    checked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamToggle(team.id)}
                  />
                  <label htmlFor={`team-${team.id}`}>{team.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
