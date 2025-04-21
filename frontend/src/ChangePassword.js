import logo from './images/Jumpstart_logo.png';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import './Register.css';

class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        password: {
          value: "",
          error: null,
        },
        confirmPassword: {
          value: "",
          error: null,
        }
      },
      apiError: "",
    }
  }

  submit = () => {
    const { fields } = this.state;
    let errorFound = false;

    Object.keys(fields).forEach((key) => { // Give errors for invalid inputs
      fields[key].error = null;
      if (!fields[key].value) { // All fields are required
        fields[key].error = "Required";
        errorFound = true;
        return;
      }
      if (key === "confirmPassword") { // The password field and the confirm password field must match
        if (fields.password.value !== fields.confirmPassword.value) {
          fields[key].error = "Passwords must match";
          errorFound = true;
          return;
        }
      }
    });

    if (errorFound) this.forceUpdate(); // Render page so that errors appear (if any)
  }

  logoPress = () => {
    this.props.navigate("/");
  }

  render() {
    const {fields, apiError, auth} = this.state;
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo" onClick={this.logoPress}/>
        </div>
        <div className="login changePassword">
          <h1 className="welcome">Change Password</h1>
          <div className="loginLine"></div>
          <p className="loginInfo">Please fill out the information below to change your password.</p>
          <div className="inputBox">
            <h3 className="inputText">Password:</h3>
            <input className="loginInput" type="password" name="password" placeholder="**************" onChange={(e) => {
              this.setState({fields: {
                ...fields, password: {...fields.password, value: e.target.value}
              }});
            }}/>
            <p className="loginError">{fields.password.error}</p>
          </div>
          <div className="inputBox">
            <h3 className="inputText">Confirm Password:</h3>
            <input className="loginInput" type="password" name="confirmPassword" placeholder="**************" onChange={(e) => {
              this.setState({fields: {
                ...fields, confirmPassword: {...fields.confirmPassword, value: e.target.value}
              }});
            }}/>
            <p className="loginError">{fields.confirmPassword.error}</p>
          </div>
          <div>
            <button className="createAccount" onClick={this.submit}>Change Password</button>
            <p className="apiError">{apiError}</p>
          </div>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<ChangePassword navigate={navigate} params={useParams()}/>);
}