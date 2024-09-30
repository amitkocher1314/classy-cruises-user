import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';  //dynamic url change 

const images = [
  "https://as2.ftcdn.net/v2/jpg/01/96/99/03/1000_F_196990370_mIPZ4fBBdYjcJV5nk09unnaegf9WKxVx.jpg",
  "https://t3.ftcdn.net/jpg/04/37/49/88/240_F_437498820_kxXv0irybjYlJEU0qvC0le3nStOQGLGq.jpg",
  "https://as2.ftcdn.net/v2/jpg/01/96/99/03/1000_F_196990372_RjJ9dZJNZG9zPMLR5F5BGbFWNb5XjX9O.jpg"
]

const LoginPage = () => {
  const [email, setEmail] = useState('');       //store email
  const [password, setPassword] = useState(''); //store password 
  const [index, setIndex] = useState(0);   //used in image transition
  const history = useHistory();      //to navigate to category page on succesful login
  const dispatch = useDispatch();   //used redux toolkit to store auth state which used in app.js so that prevent unauthorised user 

  useEffect(() => {
    const timeout = setTimeout(() => {                                 //take callback function and contain logic of looping through 3 images with time of 3 sec
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearTimeout(timeout);          //memory leaks + if comp re-render on state change prev time is cleared  
  }, [index]);

  const handleLogin = async (e) => {     
    e.preventDefault();  

    try {
      const apiKey = 'AIzaSyDZNSBSdNiP1LJdOLsDMswDwDVlPOWt2AY';
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
      const payload = {
        email,
        password,
        returnSecureToken: true,
      };

      const response = await fetch(url, {        // response  with 3 part method, content type? ,body data is sent in json 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {                          //if true then control will go to catch block
        const errorData = await response.json();     
        throw new Error(errorData.error.message);
      }

      const data = await response.json();    //else case 
      localStorage.setItem('authToken', data.idToken);     //for auth purpose
      localStorage.setItem('userId', data.localId);        //for making project user specific

      dispatch(login({ token: data.idToken, userId: data.localId }));   //dispatching action to redux toolkit
      history.push('/categories');    //after succesful auth check use history to nav to another page 
    } catch (error) {
      alert('Invalid credentials: ' + error.message);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-4xl shadow-xl border-2 rounded-lg flex'>
        <div className="w-2/3 relative h-auto overflow-hidden">
          <div className="relative w-full h-full">
            {/* map 1st is element 2nd is index of element and transition duration is for how much time in btw 2 images when 3 sec over  */}
            {images.map((image, i) => (    
              <img
                key={i}
                src={image}
                alt="Travel"
                className={`absolute w-full h-full object-cover rounded-l-lg transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <div className="mb-4 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-sky-800 mr-2">Classy Cruises</h2>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShrE_FvpykHh6D6R98h5oJsUzvvSSA8x5WXA&s" 
              alt="Classy Cruises Icon"
              className="w-11 h-11 rounded-full"
            />
          </div>
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
          <button
            onClick={handleLogin}
            className="bg-blue-800 text-white p-2 rounded w-full mt-4 hover:bg-blue-700 hover:text-gray-200"
          >
            Enter
          </button>
          <div className="mt-4 flex flex-col items-center justify-center w-full">
            <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot Your Password?
            </Link>
            <Link to="/sign-up" className="text-blue-500 text-sm mt-2 hover:underline">
              Don’t have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
