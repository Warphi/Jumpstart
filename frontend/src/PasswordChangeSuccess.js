import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Register.css';

class AwaitPasswordChange extends React.Component {
  logoPress = () => {
    this.props.navigate("/");
  }

  render() {
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo" onClick={this.logoPress}/>
        </div>
        <div className="login passwordChangeSuccess">
          <p className="loginInfo passwordChangeSuccessText">Password change successful!</p>
          <button className="createAccount" onClick={this.logoPress}>Return to Login</button>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<AwaitPasswordChange navigate={navigate}/>);
}