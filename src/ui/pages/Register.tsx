import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // For demo purposes, just save to localStorage and navigate to login
    try {
      // This would be a registration API call in a real app
      localStorage.setItem(
        'registeredUser',
        JSON.stringify({
          username: formData.username,
          email: formData.email,
        })
      );

      // Navigate to login page after successful registration
      navigate('/', {
        state: { message: 'Registration successful! Please log in.' },
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h2>Create an Account</h2>

        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Enter username'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter email'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter password'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm password'
            />
          </div>

          <button type='submit' className='primary-button'>
            Register
          </button>
        </form>

        <div className='auth-footer'>
          Already have an account? <Link to='/'>Log In</Link>
        </div>
      </div>

      <style>
        {`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
          padding: 20px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #555;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .primary-button {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s;
        }

        .primary-button:hover {
          background-color: #2980b9;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }

        .auth-footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }

        .auth-footer a {
          color: #3498db;
          text-decoration: none;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
        `}
      </style>
    </div>
  );
};

export default Register;
