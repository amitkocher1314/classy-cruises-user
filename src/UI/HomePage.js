import React from 'react';
import { Link } from 'react-router-dom';
const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Classy Cruises</h1>
        <p className="text-xl text-gray-700 mb-6">
          Sign in to book your hotels and get <Link to="/login" className="text-blue-500 font-semibold">10% off</Link> on your first booking!
        </p>
        <p className="text-lg text-gray-600">
          Discover luxury stays and exclusive packages tailored just for you. Enjoy your journey with Classy Cruises!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
