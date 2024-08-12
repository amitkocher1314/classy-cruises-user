// components/Header.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { setSearchQuery } from '../features/search/searchSlice';

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
 //const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const navigateToLogin = () => {
    history.push('/login');
  };

  const handleSignOut = () => {
    dispatch(logout());
    history.push('/');
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const navigateToCart = () => {
    history.push('/cart');
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    if (selectedCategory === 'stays') {
      history.push('/categories');
    } else {
      alert('More feature will be added soon.Please continue with hotel bookings');
    }
    e.target.value = '';
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShrE_FvpykHh6D6R98h5oJsUzvvSSA8x5WXA&s"
            alt="Classy Cruises Icon"
            className="w-12 h-12 rounded-full"
          />
          <h1 className="text-2xl font-bold text-blue-800">Classy-Cruises</h1>
          {isAuthenticated && (
            <select
              className="py-2 px-4 text-gray-800"
              onChange={handleCategoryChange}
              defaultValue=""
            >
              <option value="" disabled>Shop Travel</option>
              <option value="stays">Stays</option>
              <option value="packages">Packages</option>
              <option value="places">Places</option>
            </select>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {location.pathname === '/categories' && (
                <input
                  type="text"
                  placeholder="Search your category"
                  onChange={handleSearchChange}
                  className="border border-gray-300 rounded-lg py-2 px-4"
                />
              )}
              <button
                onClick={navigateToCart}
                className="text-gray-800 hover:text-blue-500 focus:outline-none rounded-lg py-2 px-4"
              >
                Bookings 
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-800 hover:text-blue-500 focus:outline-none rounded-lg py-2 px-4"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={navigateToLogin}
              className="text-gray-800 hover:text-blue-500 focus:outline-none rounded-lg py-2 px-4"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
