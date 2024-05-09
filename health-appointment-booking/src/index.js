import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a fade-in animation for the root element
document.getElementById('root').style.opacity = 0;
setTimeout(() => {
  document.getElementById('root').style.transition = 'opacity 0.5s ease-in-out';
  document.getElementById('root').style.opacity = 1;
}, 0);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
