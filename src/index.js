import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from "./features/store";   
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'));
 //provider function same used in context which provide store value to comp 
root.render(
     <Provider store={store}> 
     <App />
     </Provider>
);

