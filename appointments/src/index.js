import React ,{ useState } from 'react';
import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types";
import ReactDOM from 'react-dom'; 
import { Appointment ,AppointmentsDayView } from "../src/Appointment"; 
import ReactTestUtils from 'react-dom/test-utils';
import {sampleAppointments} from './sampleData';
import {CustomerForm} from './CustomerForm';

ReactDOM.render(
    // <AppointmentsDayView  appointments={sampleAppointments} />,document.getElementById('root')
    <CustomerForm    />,document.getElementById('root')
);