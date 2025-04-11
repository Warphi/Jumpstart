import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Register.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        email: {
          value: "",
          error: null,
        },
        password: {
          value: "",
          error: null,
        },
      }
    }
  }

  submit = () => { // When Sign In is clicked
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
    else {
      fetch("http://localhost:5000/auth/login", { // Make call to backend for login
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: fields.email.value,
          password: fields.password.value,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      }).then(data => {
        sessionStorage.setItem("auth_token", data.token);
        this.props.navigate("/app"); // Sign in if no errors
      }).catch(error => {
        alert(error);
      });
    }
  }

  register = () => { // When Sign Up is clicked
    this.props.navigate("/register");
  }

  render() {
    const {fields} = this.state;
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo"/>
        </div>
        <div className="login">
          <h1 className="welcome">Welcome!</h1>
          <div className="loginLine"></div>
          <p className="loginInfo">Please enter your email and password to sign in.</p>
          <div className="inputBox">
            <h3 className="inputText">Email:</h3>
            <input className="loginInput" type="text" name="email" placeholder="johnsmith123@email.com" onChange={(e) => {
              this.setState({fields: {
                ...fields, email: {...fields.email, value: e.target.value}
              }});
            }}/>
            <p className="loginError">{fields.email.error}</p>
          </div>
          <div className="inputBox">
            <h3 className="inputText">Password:</h3>
            <input className="loginInput" type="password" name="password" placeholder="**************" onChange={(e) => {
              this.setState({fields: {
                ...fields, password: {...fields.password, value: e.target.value}
              }});
            }}/>
            <p className="loginError">{fields.password.error}</p>
          </div>
          <button className="createAccount" onClick={this.submit}>Sign In</button>
          <p className="loginInfo">Don't have an account? <b className="linkText" onClick={this.register}>Sign Up</b></p>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<Login navigate={navigate}/>);
}