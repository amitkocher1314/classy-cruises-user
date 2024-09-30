import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './UI/Header';
import Footer from './UI/Footer';
import LoginPage from './authentication/LoginPage';
import Categories from './components/Categories';
import Listings from './components/Listings';
import HomePage from './UI/HomePage';
import OrderHistory from './components/OrderHistory';
import ListingDetail from './components/ListingDetail';
import Cart from './components/Cart';
import ForgotPassword from './authentication/ForgotPassword'; 
import SignUp from './authentication/SignUp';  
import { logout } from './features/auth/authSlice';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      dispatch(logout());
      history.push('/login');
    }
  }, [dispatch, history]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/forgot-password" component={ForgotPassword} />  
            <Route path="/sign-up" component={SignUp} /> 
            
            {isAuthenticated ? (
              <>
                <Route path="/categories" component={Categories} />
                <Route path="/listings/:id" component={ListingDetail} />
                <Route path="/listings" exact component={Listings} />
                <Route path="/order-history" component={OrderHistory} />
                <Route path="/cart" component={Cart} />
                <Redirect to="/categories" />
              </>
            ) : (
              <Route path="/" exact component={HomePage} />
            )}
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
