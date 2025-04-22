import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './TaskScreen.css'

class TaskScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      tasksCreated: "",
      tasksCompleted: "",
      completionPercentage: "",
    }
  }

  getStats = () => { // Make call to backend for getting user's stats
    fetch("http://localhost:5000/habits/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      this.setState({
        tasksCreated: data.tasksCreated,
        tasksCompleted: data.tasksCompleted,
        completionPercentage: data.completionPercentage,
      });
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() { // Get tasks and name from user
    this.getStats();
  }

  render() {
    const {tasksCreated, tasksCompleted, completionPercentage} = this.state;

    return (
      <div className="taskScreen">
        <div className="sidebar">
          <div className="logoBox">
            <img src={logo} height={70} className="logo"/>
          </div>
          <div className="sidebarLine taskScreenLine"/>
          <button className="sidebarButton" onClick={() => {
            this.props.navigate("/app");
          }}>Tasks</button>
          <button className="sidebarButton" onClick={() => {
            this.props.navigate("/statistics");
          }}>Statistics</button>
          <div className="sidebarEmptySpace"/>
          <button className="sidebarButton logOffButton" onClick={() => {
            this.props.navigate("/");
            sessionStorage.removeItem("auth_token");
          }}>Log Off</button>
        </div>
        <div className="body">
          <div className="taskScreenHeader">
            <h1 className="greeting">Task Statistics</h1>
          </div>
          <div className="bodyLine taskScreenLine"/>
          <div className="taskScreenContent">
            <div className="statsInfo">
              <h3 className="statsText">Tasks Created: {tasksCreated}</h3>
              <h3 className="statsText">Tasks Completed: {tasksCompleted}</h3>
              <h3 className="statsText">Completion Percentage: {completionPercentage}%</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<TaskScreen navigate={navigate}/>);
}