// src/components/MealPlanCalendar.js
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MealPlanCalendar.css"; // Global CSS for calendar customization

const MealPlanCalendar = ({ mealPlans, onDateClick }) => {
  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const hasMeal = mealPlans.some(
        (meal) =>
          new Date(meal.date).toLocaleDateString('en-CA') === new Date(date).toLocaleDateString('en-CA')

      );
      return hasMeal ? "calendar-has-meal" : null;
    }
  };

  return (
    <div className="calendar-wrapper my-4">
      <Calendar
        tileClassName={getTileClassName}
        onClickDay={onDateClick}
      />
    </div>
  );
};

export default MealPlanCalendar;
