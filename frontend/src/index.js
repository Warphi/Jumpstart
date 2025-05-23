import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Register from './Register';
import TaskScreen from './TaskScreen';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import AwaitPasswordChange from './AwaitPasswordChange';
import PasswordChangeSuccess from './PasswordChangeSuccess';
import AwaitVerification from './AwaitVerification';
import Verification from './Verification';
import Statistics from './Statistics';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet"/>
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/app" element={<TaskScreen />}/>
        <Route index element={<Login />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/reset/:token" element={<ChangePassword />}/>
        <Route path="/awaitverification" element={<AwaitVerification />}/>
        <Route path="/awaitpasswordchange" element={<AwaitPasswordChange />}/>
        <Route path="/verify/:token" element={<Verification />}/>
        <Route path="/statistics" element={<Statistics />}/>
        <Route path="/passwordchangesuccess" element={<PasswordChangeSuccess />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
