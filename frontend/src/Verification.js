import logo from './images/Jumpstart_logo.png';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import './Register.css';

class Verification extends React.Component {
  componentDidMount() {
    fetch(`http://localhost:5000/auth/verify/${this.props.params.token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          this.setState({apiError: data.error});
        });
      }
      return response.json();
    }).then(data => {
      sessionStorage.setItem("auth_token", data.token);
      this.props.navigate("/app"); // Sign in if no errors
    }).catch(error => {
      console.log(error);
    });;
  }

  render() {
    return (
      <>
        <div className="header">
          <img src={logo} height={70} className="logo"/>
        </div>
      </>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<Verification navigate={navigate} params={useParams()}/>);
}