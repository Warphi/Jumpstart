import logo from './images/Jumpstart_logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './TaskScreen.css'
import CreateTask from './CreateTask';
import DateSelection from './DateSelection';

class TaskScreen extends React.Component {
  constructor() {
    super();
    const date = new Date();
    this.state = {
      createTaskOpen: false,
      tasks: [],
      listDate: date,
      userName: "",
    }
  }

  getHabits = (date) => {
    fetch(`http://localhost:5000/habits/day/${
      date.getFullYear()
    }-${
      (date.getMonth() + 1).toLocaleString('en-US', {
        minimumIntegerDigits: 2
      })
    }-${
      date.getDate().toLocaleString('en-US', {
        minimumIntegerDigits: 2
      })
    }`, { // Make call to backend for getting habits
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    }).then(response => {
      if (!response.ok && response.status != 404) {
        if (response.status == 500) this.props.navigate("/");
        throw new Error(`HTTP error status: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      this.setState({tasks: data.habits.sort((a, b) => new Date(a.startBy).getHours() - new Date(b.startBy).getHours())});
    }).catch(error => {
      this.setState({tasks: []});
    });
  }

  getName = () => { // Make call to backend for getting user's name
    fetch("http://localhost:5000/auth/user", {
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
      this.setState({userName: data.name});
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() { // Get tasks and name from user
    const {listDate} = this.state;
    this.getHabits(listDate);
    this.getName();
  }

  closeWindow = () => { // Close the create task window and refresh tasks
    const {listDate} = this.state;
    this.setState({createTaskOpen: false});
    for (let i = 0; i < 5; i++) {
      this.getHabits(listDate);
    }
  }

  setSelectedDate = (date) => {
    this.setState({listDate: date});
    this.getHabits(date);
  }

  render() {
    const {createTaskOpen, tasks, listDate, userName} = this.state;

    const taskDivs = tasks.map((task) => // Box for each task in the list
      <div className="task">
        <p className="taskInfo">
          <b className="taskTitle">{task.name}</b><br/>
          {`
            ${new Date(task.startBy).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })} - ${new Date(task.completeBy).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          `}<br/>
          Priority: {task.priority}<br/>
          Description: {task.description}
        </p>
        <button className="taskButton markComplete">Mark as Complete</button>
        <button className="taskButton editTask">Edit Task</button>
      </div>
    )

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateString = `${days[listDate.getDay()]}, ${months[listDate.getMonth()]} ${listDate.getDate()}, ${listDate.getFullYear()}`;
    // dateString shows the current date at the top of the task list

    return (
      <div className="taskScreen">
        <div className="sidebar">
          <div className="logoBox">
            <img src={logo} height={70} className="logo"/>
          </div>
          <div className="sidebarLine taskScreenLine"/>
          <button className="sidebarButton">Tasks</button>
          <button className="sidebarButton">Statistics</button>
          <div className="sidebarEmptySpace"/>
          <button className="sidebarButton logOffButton" onClick={() => {
            this.props.navigate("/");
            sessionStorage.removeItem("auth_token");
          }}>Log Off</button>
        </div>
        <div className="body">
          <div className="taskScreenHeader">
            <h1 className="greeting">{userName ? `Welcome back, ${userName}!` : ""}</h1>
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
            <DateSelection
              selectedDate={listDate}
              setSelectedDate={this.setSelectedDate}
              class="taskScreenCalendar"
            />
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