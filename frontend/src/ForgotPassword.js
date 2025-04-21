import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Register.css';

class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        email: {
          value: "",
          error: null,
        },
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
      if (key === "email") { // Emails must include @ and . to be considered valid
        if (!fields.email.value.includes("@") || !fields.email.value.includes(".")) {
          fields[key].error = "Please enter a valid email";
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
    const {fields, apiError} = this.state;
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo" onClick={this.logoPress}/>
        </div>
        <div className="login forgotPassword">
          <h1 className="welcome">Forgot Password?</h1>
          <div className="loginLine"></div>
          <p className="loginInfo">Please fill out the information below to change your password.</p>
          <div className="inputBox">
            <h3 className="inputText">Email:</h3>
            <input className="loginInput" type="text" name="email" placeholder="johnsmith123@email.com" onChange={(e) => {
              this.setState({fields: {
                ...fields, email: {...fields.email, value: e.target.value}
              }});
            }}/>
            <p className="loginError">{fields.email.error}</p>
          </div>
          <p className="loginInfo">A form will be sent to your email to finalize the password change.</p>
          <div>
            <button className="createAccount" onClick={this.submit}>Send Email</button>
            <p className="apiError">{apiError}</p>
          </div>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<ForgotPassword navigate={navigate}/>);
}