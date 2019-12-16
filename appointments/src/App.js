import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import CustomerForm from './CustomerForm';

export const App = () => {
  const [view, setView] = useState('dayView');
  const transitionToAddCustomer = useCallback(
    () => setView('addCustomer'),
    []
  );
  return (
    <React.Fragment>
      <div className="button-bar">
        <button
          type="button"
          id="addCustomer"
          onClick={transitionToAddCustomer}>
          Add customer and appointment
        </button>
      </div>
      <AppointmentsDayViewLoader></AppointmentsDayViewLoader>
      {/* {view === 'addCustomer' ? <CustomerForm /> : null} */}
    </React.Fragment>
  );
};
