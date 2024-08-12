// components/ForgotPassword.js
import React, { useState } from 'react';
import { useHistory,Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const history = useHistory();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const apiKey = 'AIzaSyDZNSBSdNiP1LJdOLsDMswDwDVlPOWt2AY';
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;
      const payload = {
        requestType: 'PASSWORD_RESET',
        email,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      alert('Password reset email sent!');
      history.push('/login');
    } catch (error) {
      alert('Error sending password reset email: ' + error.message);
    }

    setEmail('');
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md shadow-xl border-2 rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-sky-800 mb-4 text-center'>Reset Password</h2>
        <input
          type="email"
          placeholder="example@gmail.com"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleResetPassword}
          className="bg-blue-800 text-white p-2 rounded w-full mt-4 hover:bg-blue-700 hover:text-gray-200"
        >
          Send Reset Email
        </button>
        <div className="mt-4 flex justify-center w-full">
          <Link to="/login" className="text-blue-500 text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
