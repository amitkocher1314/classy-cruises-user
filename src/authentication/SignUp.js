import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const apiKey = 'AIzaSyDZNSBSdNiP1LJdOLsDMswDwDVlPOWt2AY';
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
      const payload = {
        email,
        password,
        returnSecureToken: true,
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

      const data = await response.json();
      localStorage.setItem('authToken', data.idToken);
      localStorage.setItem('userId', data.localId);

      dispatch(login({ token: data.idToken, userId: data.localId })); // Update the Redux state
      history.push('/categories');
    } catch (error) {
      setError('Error signing up: ' + error.message);
    }

    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md shadow-xl border-2 rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-sky-800 mb-4 text-center'>Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="example@gmail.com"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-2 p-2 border border-gray-300 rounded w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="bg-blue-800 text-white p-2 rounded w-full mt-4 hover:bg-blue-700 hover:text-gray-200"
        >
          Sign Up
        </button>
        <div className="mt-4 flex justify-center w-full">
          <Link to="/login" className="text-blue-500 text-sm">Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
