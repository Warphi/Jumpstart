import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Register.css';

class AwaitVerification extends React.Component {
  render() {
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo"/>
        </div>
        <div className="login awaitVerification">
          <p className="loginInfo verificationInfo">A verification email has been sent to your address. Please check your inbox.</p>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<AwaitVerification navigate={navigate}/>);
}