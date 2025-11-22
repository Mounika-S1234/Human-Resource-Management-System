import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Auth.css';

function RegisterOrg() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: '',
    adminName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      const { token, organisation } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('organisation', JSON.stringify(organisation));

      alert('Organisation created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Create Organisation</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organisation Name</label>
            <input
              type="text"
              name="orgName"
              value={formData.orgName}
              onChange={handleChange}
              required
              placeholder="Enter organisation name"
            />
          </div>

          <div className="form-group">
            <label>Admin Name</label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              required
              placeholder="Enter admin name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Organisation'}
          </button>
        </form>

        <p className="auth-link">
          Already have an organisation? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterOrg;
