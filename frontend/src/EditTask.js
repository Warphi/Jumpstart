import React from 'react';
import './CreateTask.css'

class EditTask extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        name: {
          value: "",
          error: null,
        },
        priority: {
          value: "",
          error: null,
        },
        description: {
          value: "",
          error: null,
        },
        startTime: {
          value: "",
          error: null,
        },
        endTime: {
          value: "",
          error: null,
        }
      },
    }
  }

  priorityChange = (e) => {
    const {fields} = this.state;
    this.setState({fields: {
      ...fields, priority: {...fields.priority, value: e.target.value}
    }});
  }

  submitTask = () => {
    const { fields } = this.state;
    console.log(fields);
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
      if (key === "startTime" || key === "endTime") { // Start and end times must be formatted properly
        if (fields[key].value.slice(-2).toUpperCase() !== "AM" && fields[key].value.slice(-2).toUpperCase() !== "PM") {
          fields[key].error = "Include AM or PM";
          errorFound = true;
          return;
        }
        if (fields[key].value.length < 6 || fields[key].value.length > 8) {
          fields[key].error = "Invalid format";
          errorFound = true;
          return;
        }
        const halves = fields[key].value.split(':');
        if (halves.length != 2
          || isNaN(halves[0])
          || parseInt(halves[0]) > 12
          || parseInt(halves[0]) < 1
          || isNaN(halves[1].slice(0, 2))
          || parseInt(halves[1].slice(0, 2)) > 59
          || parseInt(halves[1].slice(0, 2)) < 0
        ) {
          fields[key].error = "Invalid format";
          errorFound = true;
          return;
        }
      }
    });

    if (errorFound) this.forceUpdate(); // Render page so that errors appear (if any)
    else {
      const date = new Date();
      const startTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        parseInt(fields.startTime.value.split(':')[0]) - (fields.startTime.value.split(':')[0] == "12" ? 12 : 0) + (fields.startTime.value[fields.startTime.value.length - 2].toUpperCase() === "P" ? 12 : 0),
        parseInt(fields.startTime.value.split(':')[1].slice(0, 2))
      );
      const endTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        parseInt(fields.endTime.value.split(':')[0]) - (fields.endTime.value.split(':')[0] == "12" ? 12 : 0) + (fields.endTime.value[fields.endTime.value.length - 2].toUpperCase() === "P" ? 12 : 0),
        parseInt(fields.endTime.value.split(':')[1].slice(0, 2))
      );
      fetch(`http://localhost:5000/habits/${this.props.task._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.name.value,
          priority: fields.priority.value,
          description: fields.description.value,
          startBy: startTime,
          completeBy: endTime,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      }).catch(error => {
        console.log(error);
      });
      this.props.closeWindow();
    }
  }

  deleteTask = () => {
    fetch(`http://localhost:5000/habits/${this.props.task._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      return response.json();
    }).catch(error => {
      console.log(error);
    });
    this.props.closeWindow();
  }

  componentDidMount() {
    const task = this.props.task;
    this.setState({
      fields: {
        name: {
          value: task.name,
          error: null,
        },
        priority: {
          value: task.priority,
          error: null,
        },
        description: {
          value: task.description,
          error: null,
        },
        startTime: {
          value: new Date(task.startBy).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          error: null,
        },
        endTime: {
          value: new Date(task.completeBy).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          error: null,
        }
      },
    });
  }

  render() {
    const {fields} = this.state;
    const task = this.props.task;
    return (
      <div className="createTaskWindow">
        <h1 className="createTaskTitle">Edit Task</h1>
        <div className="editTaskParams">
          <div className="taskInputBox">
            <h3 className="taskInputText">Task Name:</h3>
            <input className="taskInput" type="text" name="name" defaultValue={task.name} placeholder="Read a book" onChange={(e) => {
              this.setState({fields: {
                ...fields, name: {...fields.name, value: e.target.value}
              }});
            }}/>
            <p className="error taskError">{fields.name.error}</p>
          </div>
          <div className="taskInputBox">
            <h3 className="taskInputText">Priority:</h3>
            <div className="taskRadioOptions editTaskRadioOptions">
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="radio" value="Very High" defaultChecked={task.priority === "Very High"} id="veryHigh" name="priority" onChange={this.priorityChange}/>
                <label className="taskRadioText" for="veryHigh">Very High</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="radio" value="High" defaultChecked={task.priority === "High"} id="high" name="priority" onChange={this.priorityChange}/>
                <label className="taskRadioText" for="high">High</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="radio" value="Medium" defaultChecked={task.priority === "Medium"} id="medium" name="priority" onChange={this.priorityChange}/>
                <label className="taskRadioText" for="medium">Medium</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="radio" value="Low" defaultChecked={task.priority === "Low"} id="low" name="priority" onChange={this.priorityChange}/>
                <label className="taskRadioText" for="low">Low</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="radio" value="Very Low" defaultChecked={task.priority === "Very Low"} id="veryLow" name="priority" onChange={this.priorityChange}/>
                <label className="taskRadioText" for="veryLow">Very Low</label>
              </div>
            </div>
            <p className="error taskError">{fields.priority.error}</p>
          </div>
          <div className="taskInputBox">
            <h3 className="taskInputText">Description:</h3>
            <textarea className="taskInput descriptionInput" type="text" defaultValue={task.description} name="description" onChange={(e) => {
              this.setState({fields: {
                ...fields, description: {...fields.description, value: e.target.value}
              }});
            }}/>
            <p className="error taskError">{fields.description.error}</p>
          </div>
          <div className="taskInputBox timeInputBox">
            <div className="timeInputComponent">
              <h3 className="taskInputText">Start Time:</h3>
              <input className="taskInput timeInput" type="text" name="startTime" defaultValue={new Date(task.startBy).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })} placeholder="11:30 AM" onChange={(e) => {
                this.setState({fields: {
                  ...fields, startTime: {...fields.startTime, value: e.target.value}
                }});
              }}/>
              <p className="error timeError">{fields.startTime.error}</p>
            </div>
            <div className="timeInputComponent">
              <h3 className="taskInputText">End Time:</h3>
              <input className="taskInput timeInput" type="text" name="endTime" defaultValue={new Date(task.completeBy).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })} placeholder="1:00 PM" onChange={(e) => {
                this.setState({fields: {
                  ...fields, endTime: {...fields.endTime, value: e.target.value}
                }});
              }}/>
              <p className="error timeError">{fields.endTime.error}</p>
            </div>
          </div>
        </div>
        <div className="bottomButtons">
          <button className="submitTask" onClick={this.submitTask}>Edit Task</button>
          <button className="submitTask deleteTask" onClick={this.deleteTask}>Delete Task</button>
          <button className="submitTask cancel" onClick={this.props.closeWindow}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default EditTask;