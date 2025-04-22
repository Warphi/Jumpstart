import React from 'react';
import './CreateTask.css'
import DateSelection from './DateSelection';

class CreateTask extends React.Component {
  constructor() {
    super();
    const date = new Date();
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
        date: {
          value: date,
          repeats: [],
          type: "",
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

  dateTypeChange = (e) => {
    const {fields} = this.state;
    this.setState({fields: {
      ...fields, date: {...fields.date, type: e.target.value, repeats: []}
    }});
  }

  repeatsChange = (e) => {
    const {fields} = this.state;
    if (e.target.checked) {
      this.setState({fields: {
        ...fields, date: {...fields.date, repeats: [
          ...fields.date.repeats, e.target.value
        ]}
      }});
    }
    else {
      this.setState({fields: {
        ...fields, date: {...fields.date, repeats:
          fields.date.repeats.filter(weekday => weekday !== e.target.value)
        }
      }})
    }
  } 

  submitTask = () => {
    const { fields } = this.state;
    let errorFound = false;

    Object.keys(fields).forEach((key) => { // Give errors for invalid inputs
      fields[key].error = null;
      if (!fields[key].value) { // All fields are required
        fields[key].error = "Required";
        errorFound = true;
        return;
      }
      if (key === "date") { // Date type is required; day choice is required if repeating weekly
        if (!fields.date.type || (fields.date.type === "weekly" && fields.date.repeats.length === 0)) {
          fields[key].error = "Required";
          errorFound = true;
          return;
        }
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
      const todayDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const fieldsDate = new Date(fields.date.value);
      fieldsDate.setUTCHours(0, 0, 0, 0);
      todayDate.setUTCHours(0, 0, 0, 0);
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
      fetch("http://localhost:5000/habits", { // Make call to backend for task creation
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          name: fields.name.value,
          priority: fields.priority.value,
          description: fields.description.value,
          repeats: fields.date.repeats,
          date: fields.date.type === "specific" ? fieldsDate : todayDate,
          startBy: startTime,
          completeBy: endTime,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      }).catch(error => {
        alert(error);
      });
      this.props.closeWindow();
    }
  }

  setSelectedDate = (date) => {
    const {fields} = this.state;
    this.setState({fields: {
      ...fields, date: {...fields.date, value: date}
    }});
  }

  render() {
    const {fields} = this.state;
    return (
      <div className="createTaskWindow">
        <h1 className="createTaskTitle">Create Task</h1>
        <div className="createTaskSides">
          <div className="createTaskLeft">
            <div className="taskInputBox">
              <h3 className="taskInputText">Task Name:</h3>
              <input className="taskInput" type="text" name="name" placeholder="Read a book" onChange={(e) => {
                this.setState({fields: {
                  ...fields, name: {...fields.name, value: e.target.value}
                }});
              }}/>
              <p className="error taskError">{fields.name.error}</p>
            </div>
            <div className="taskInputBox">
              <h3 className="taskInputText">Priority:</h3>
              <div className="taskRadioOptions">
                <div className="taskRadioOption">
                  <input className="taskRadioInput" type="radio" value="Very High" id="veryHigh" name="priority" onChange={this.priorityChange}/>
                  <label className="taskRadioText" for="veryHigh">Very High</label>
                </div>
                <div className="taskRadioOption">
                  <input className="taskRadioInput" type="radio" value="High" id="high" name="priority" onChange={this.priorityChange}/>
                  <label className="taskRadioText" for="high">High</label>
                </div>
                <div className="taskRadioOption">
                  <input className="taskRadioInput" type="radio" value="Medium" id="medium" name="priority" onChange={this.priorityChange}/>
                  <label className="taskRadioText" for="medium">Medium</label>
                </div>
                <div className="taskRadioOption">
                  <input className="taskRadioInput" type="radio" value="Low" id="low" name="priority" onChange={this.priorityChange}/>
                  <label className="taskRadioText" for="low">Low</label>
                </div>
                <div className="taskRadioOption">
                  <input className="taskRadioInput" type="radio" value="Very Low" id="veryLow" name="priority" onChange={this.priorityChange}/>
                  <label className="taskRadioText" for="veryLow">Very Low</label>
                </div>
              </div>
              <p className="error taskError">{fields.priority.error}</p>
            </div>
            <div className="taskInputBox">
              <h3 className="taskInputText">Description:</h3>
              <textarea className="taskInput descriptionInput" type="text" name="description" onChange={(e) => {
                this.setState({fields: {
                  ...fields, description: {...fields.description, value: e.target.value}
                }});
              }}/>
              <p className="error taskError">{fields.description.error}</p>
            </div>
            <div className="taskInputBox timeInputBox">
              <div className="timeInputComponent">
                <h3 className="taskInputText">Start Time:</h3>
                <input className="taskInput timeInput" type="text" name="startTime" placeholder="11:30 AM" onChange={(e) => {
                  this.setState({fields: {
                    ...fields, startTime: {...fields.startTime, value: e.target.value}
                  }});
                }}/>
                <p className="error timeError">{fields.startTime.error}</p>
              </div>
              <div className="timeInputComponent">
                <h3 className="taskInputText">End Time:</h3>
                <input className="taskInput timeInput" type="text" name="endTime" placeholder="1:00 PM" onChange={(e) => {
                  this.setState({fields: {
                    ...fields, endTime: {...fields.endTime, value: e.target.value}
                  }});
                }}/>
                <p className="error timeError">{fields.endTime.error}</p>
              </div>
            </div>
          </div>
          <div className="createTaskRight">
            <div className="taskInputBox">
              <h3 className="taskInputText">Select Date(s):</h3>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="radio" value="specific" id="specific" name="dateType" onChange={this.dateTypeChange}/>
                <label className="taskRadioText specificDay" for="specific">Specific Day</label>
                <input className="taskRadioInput" type="radio" value="weekly" id="weekly" name="dateType" onChange={this.dateTypeChange}/>
                <label className="taskRadioText" for="weekly">Repeat Weekly</label>
              </div>
              <p className="error taskError">{fields.date.error}</p>
            </div>
            {fields.date.type == "specific" && <DateSelection class="createTaskCalendar" selectedDate={fields.date.value} setSelectedDate={this.setSelectedDate}/>}
            {fields.date.type == "weekly" && <div className="taskInputBox">
              <h3 className="taskInputText repeatsEvery">Repeats Every:</h3>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="sunday" id="sunday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="sunday">Sunday</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="monday" id="monday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="monday">Monday</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="tuesday" id="tuesday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="tuesday">Tuesday</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="wednesday" id="wednesday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="wednesday">Wednesday</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="thursday" id="thursday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="thursday">Thursday</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="friday" id="friday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="friday">Friday</label>
              </div>
              <div className="taskRadioOption">
                <input className="taskRadioInput" type="checkbox" value="saturday" id="saturday" name="weekday" onChange={this.repeatsChange}/>
                <label className="taskRadioText taskCheckText" for="saturday">Saturday</label>
              </div>
            </div>}
         </div>
        </div>
        <div className="bottomButtons">
          <button className="submitTask" onClick={this.submitTask}>Create Task</button>
          <button className="submitTask cancel" onClick={this.props.closeWindow}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default CreateTask;