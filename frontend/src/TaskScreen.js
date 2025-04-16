import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './TaskScreen.css'
import CreateTask from './CreateTask';

class TaskScreen extends React.Component {
  constructor() {
    super();
    const date = new Date();
    this.state = {
      createTaskOpen: false,
      tasks: [],
      selectedMonth: date.getMonth(),
      selectedYear: date.getFullYear(),
    }
  }

  getHabits = () => {
    fetch("http://localhost:5000/habits/", { // Make call to backend for getting habits
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
      this.setState({tasks: data.habits});
    }).catch(error => {
      alert(error);
    });
  }

  componentDidMount() {
    this.getHabits();
  }

  closeWindow = () => {
    this.setState({createTaskOpen: false});
    this.getHabits();
  }

  previousMonth = () => {
    const {selectedMonth, selectedYear} = this.state;
    if (selectedMonth === 0) {
      this.setState({
        selectedMonth: 11,
        selectedYear: selectedYear - 1,
      });
    }
    else {
      this.setState({selectedMonth: selectedMonth - 1});
    }
  }

  nextMonth = () => {
    const {selectedMonth, selectedYear} = this.state;
    if (selectedMonth === 11) {
      this.setState({
        selectedMonth: 0,
        selectedYear: selectedYear + 1,
      });
    }
    else {
      this.setState({selectedMonth: selectedMonth + 1});
    }
  }

  render() {
    const {createTaskOpen, tasks, selectedMonth, selectedYear} = this.state;

    const taskDivs = tasks.map((task) => 
      <div className="task">
        <p className="taskInfo">
          Task: {task.name}<br/>
          Priority: {task.priority}<br/>
          Description: {task.description}
        </p>
        <button className="taskButton markComplete">Mark as Complete</button>
        <button className="taskButton editTask">Edit Task</button>
      </div>
    )

    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateString = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    const dayButtons = Array.from(Array(new Date(selectedYear, selectedMonth + 1, 0).getDate()).keys()).map((day) =>
      <button className="dayButton">
        {day + 1}
      </button>
    )

    return (
      <div className="taskScreen">
        <div className="sidebar">
          <div className="logoBox">
            <img src={logo} height={70} className="logo"/>
          </div>
          <div className="sidebarLine taskScreenLine"/>
          <button className="sidebarButton">Tasks</button>
          <button className="sidebarButton">Settings</button>
          <button className="sidebarButton">Help</button>
          <div className="sidebarEmptySpace"/>
          <button className="sidebarButton logOffButton" onClick={() => {
            this.props.navigate("/");
            sessionStorage.removeItem("auth_token");
          }}>Log Off</button>
        </div>
        <div className="body">
          <div className="taskScreenHeader">
            <h1 className="greeting">Welcome back!</h1>
          </div>
          <div className="bodyLine taskScreenLine"/>
          <div className="taskScreenContent">
            <div className="taskScreenContentLeft">
              <button className="createTask" onClick={() => {
                this.setState({createTaskOpen: true})
              }}>Create Task</button>
              <h3 className="dateHeader">{dateString}</h3>
              <div className="tasksToday">
                {taskDivs}
              </div>
            </div>
            <div className="dateSelection">
              <div className="calendarHeader">
                <button className="changeMonth" onClick={this.previousMonth}>◀︎</button>
                <h3 className="calendarTitle">{`${months[selectedMonth]} ${selectedYear}`}</h3>
                <button className="changeMonth" onClick={this.nextMonth}>▶︎</button>
              </div>
              <div className="calendarLine"/>
              <div className="calendar">
                {dayButtons}
              </div>
            </div>
          </div>
        </div>
        {createTaskOpen && <CreateTask closeWindow={this.closeWindow}/>}
        {createTaskOpen && <div className="focus"/>}
      </div>
    )
  }
}

export default () => {
  const navigate = useNavigate();
  return (<TaskScreen navigate={navigate}/>);
}