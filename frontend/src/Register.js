import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Register.css';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        userName: {
          value: "",
          error: null,
        },
        email: {
          value: "",
          error: null,
        },
        password: {
          value: "",
          error: null,
        },
        confirmPassword: {
          value: "",
          error: null,
        },
      },
      apiError: "",
    }
  }

  submit = () => { // When Create Account is clicked
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
      if (key === "confirmPassword") { // The password field and the confirm password field must match
        if (fields.password.value !== fields.confirmPassword.value) {
          fields[key].error = "Passwords must match";
          errorFound = true;
          return;
        }
      }
    });

    if (errorFound) this.forceUpdate(); // Render page so that errors appear (if any)
    else {
      fetch("http://localhost:5000/auth/register", { // Make call to backend for user registration
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.userName.value,
          email: fields.email.value,
          password: fields.password.value,
        }),
      }).then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            this.setState({apiError: data.error});
          });
        }
        this.props.navigate("/awaitverification");
        return response.json();
      });
    }
  }

  login = () => { // When Sign In is clicked
    this.props.navigate("/");
  }

  render() {
    const {fields, apiError} = this.state;
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo"/>
        </div>
        <div className="login register">
          <h1 className="welcome">Welcome!</h1>
          <div className="loginLine"></div>
          <p className="loginInfo">Please fill out the information below to create your account.</p>
          <div className="inputBox">
            <h3 className="inputText">Name:</h3>
            <input className="loginInput" type="text" name="userName" placeholder="John Smith" onChange={(e) => {
              this.setState({fields: {
                ...fields, userName: {...fields.userName, value: e.target.value}
              }});
            }}/>
            <p className="loginError">{fields.userName.error}</p>
          </div>
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
          <button className="createAccount" onClick={this.submit}>Create Account</button>
            <p className="apiError">{apiError}</p>
          </div>
          <p className="loginInfo">Already have an account? <b className="linkText" onClick={this.login}>Sign In</b></p>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<Register navigate={navigate}/>);
}