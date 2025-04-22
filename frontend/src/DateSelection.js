import React from 'react';
import './TaskScreen.css'

class DateSelection extends React.Component {
  constructor() {
    super();
    const date = new Date();
    this.state = {
      selectedMonth: date.getMonth(),
      selectedYear: date.getFullYear(),
    }
  }

  previousMonth = () => { // Move back a month on the calendar
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

  nextMonth = () => { // Move forward a month on the calendar
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

  selectDate = (day) => { // When a date for the current month is selected on the calendar
    const {selectedMonth, selectedYear} = this.state;
    this.props.setSelectedDate(new Date(selectedYear, selectedMonth, day));
  }

  selectPrevMonthDate = (date) => { // When a date for the previous month is selected on the calendar
    this.props.setSelectedDate(date);
    this.previousMonth();
  }

  selectNextMonthDate = (date) => { // When a date for the next month is selected on the calendar
    this.props.setSelectedDate(date);
    this.nextMonth();
  }

  render() {
    const {selectedMonth, selectedYear} = this.state;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const weekDayLabels = days.map((day) => 
      <p className={`weekDayLabel ${this.props.class}WeekDayLabel`}>{day.substring(0, 3)}</p>
    ); // Each of the labels for days of the week on the calendar
    
    const prevMonthDate = (distance) => { // Get date by backtracking a certain number of days from the first day of the current month
      var date = new Date(selectedYear, selectedMonth, 1);
      date.setDate(date.getDate() - (distance));
      return date;
    }

    const prevMonthDayButtons = [...Array(new Date(selectedYear, selectedMonth, 1).getDay()).keys()].reverse().map((distance) =>
      <button className={(this.props.selectedDate.getTime() === prevMonthDate(distance + 1).getTime()) ? "dayButton selectedDay" : "dayButton otherMonth"} onClick={() => this.selectPrevMonthDate(prevMonthDate(distance + 1))}>
        {prevMonthDate(distance + 1).getDate()}
      </button>
    ); // Each of the gray days on the calendar from the previous month

    const dayButtons = Array(new Date(selectedYear, selectedMonth + 1, 0).getDate()).keys().map((day) =>
      <button className={(this.props.selectedDate.getMonth() === selectedMonth && this.props.selectedDate.getFullYear() === selectedYear && this.props.selectedDate.getDate() == (day + 1)) ? "dayButton selectedDay" : "dayButton"} onClick={() => this.selectDate(day + 1)}>
        {day + 1}
      </button>
    ); // Each of the normal days on the calendar for the current month
    
    const nextMonthDate = (distance) => { // Get date by moving forward a certain number of days from the last day of the current month
      var date = new Date(selectedYear, selectedMonth + 1, 0);
      date.setDate(date.getDate() + (distance));
      return date;
    }
    
    const nextMonthDayButtons = [...Array(6 - new Date(selectedYear, selectedMonth + 1, 0).getDay()).keys()].map((distance) =>
      <button className={(this.props.selectedDate.getTime() === nextMonthDate(distance + 1).getTime()) ? "dayButton selectedDay" : "dayButton otherMonth"} onClick={() => this.selectNextMonthDate(nextMonthDate(distance + 1))}>
        {nextMonthDate(distance + 1).getDate()}
      </button>
    ); // Each of the gray days on the calendar from the next month
    
    return (
      <div className={`dateSelection ${this.props.class}`}>
        <div className="calendarHeader">
          <button className="changeMonth" onClick={this.previousMonth}>◀︎</button>
          <h3 className={`calendarTitle ${this.props.class}Title`}>{`${months[selectedMonth]} ${selectedYear}`}</h3>
          <button className="changeMonth" onClick={this.nextMonth}>▶︎</button>
        </div>
        <div className="calendarLine"/>
        <div className="calendar">
          {weekDayLabels}
          {prevMonthDayButtons}
          {dayButtons}
          {nextMonthDayButtons}
        </div>
      </div>
    )
  }
}

export default DateSelection;