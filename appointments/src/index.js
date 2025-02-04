import React ,{ useState } from 'react';
import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types";
import ReactDOM from 'react-dom'; 
import { Appointment ,AppointmentsDayView } from "../src/AppointmentsDayView"; 
import ReactTestUtils from 'react-dom/test-utils';
import {sampleAppointments} from './sampleData';
// import {CustomerForm} from './CustomerForm';
import { AppointmentForm   } from "../src/AppointmentForm"; 
import { sampleAvailableTimeSlots } from './sampleData';
import 'whatwg-fetch';
import { App   } from "../src/App"; 

ReactDOM.render(
    // <AppointmentsDayView  appointments={sampleAppointments} />,document.getElementById('root')
    // <CustomerForm    />,document.getElementById('root')
    // <AppointmentForm    />,document.getElementById('root')
    // <AppointmentForm     availableTimeSlots={sampleAvailableTimeSlots}  />,  document.getElementById('root')
    <App  />,  document.getElementById('root')

);