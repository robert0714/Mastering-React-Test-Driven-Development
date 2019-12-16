import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import CustomerForm from './CustomerForm';

export const App = ({ today }) => {
  const [view, setView] = useState('dayView');
  const [customer, setCustomer] = useState();
  const transitionToAddCustomer = useCallback(customer => {
    setCustomer(customer);
    setView('addCustomer');
  }, []);
  const transitionToAddAppointment = useCallback(() => {
    setView('addAppointment');
  }, []);

  const transitionToDayView = useCallback(
    () => {
      setView('dayView')
    },
    [],
  )
  switch (view) {
    case 'addCustomer':
      return <CustomerForm onSave={transitionToAddAppointment} />;
    case 'addAppointment':
      return <AppointmentsDayViewLoader  customer ={customer}  onSave ={transitionToDayView} />;
    default:
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
          <AppointmentsDayViewLoader today={today} />
        </React.Fragment>
      );
      break;
  }
};
