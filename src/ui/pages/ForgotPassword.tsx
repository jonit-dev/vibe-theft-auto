import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email) {
      setError('Email is required');
      return;
    }

    // Simulate API call to request password reset
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      console.log(`Password reset requested for: ${email}`);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        {!submitted ? (
          <>
            <h2>Reset Your Password</h2>

            {error && <div className='error-message'>{error}</div>}

            <p className='instructions'>
              Enter your email address below and we'll send you instructions to
              reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                />
              </div>

              <button type='submit' className='primary-button'>
                Send Reset Instructions
              </button>
            </form>
          </>
        ) : (
          <div className='success-message'>
            <h2>Check Your Email</h2>
            <p>
              We've sent password reset instructions to <strong>{email}</strong>
              . Please check your email and follow the instructions.
            </p>
            <p>
              Didn't receive an email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className='text-button'
              >
                try again
              </button>
              .
            </p>
          </div>
        )}

        <div className='auth-footer'>
          <Link to='/'>Back to Login</Link>
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
           margin-bottom: 20px;
           color: #333;
         }
         
         .instructions {
           text-align: center;
           margin-bottom: 25px;
           color: #666;
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
         
         .success-message {
           text-align: center;
           color: #2c3e50;
         }
         
         .success-message p {
           margin-bottom: 15px;
         }
         
         .text-button {
           background: none;
           border: none;
           color: #3498db;
           cursor: pointer;
           font-size: inherit;
           padding: 0;
           text-decoration: underline;
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

export default ForgotPassword;
