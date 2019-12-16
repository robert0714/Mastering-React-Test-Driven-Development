import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
export const App = () => (
  <React.Fragment>
    <div className ="button-bar">
        <button type ="button"  id ="addCustomer" >
            Add customer and appointment
        </button>
    </div>
    <AppointmentsDayViewLoader></AppointmentsDayViewLoader>
  </React.Fragment>
);
