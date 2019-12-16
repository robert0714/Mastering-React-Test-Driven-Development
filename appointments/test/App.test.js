import React from 'react';
import {
  createShallowRenderer,
  type,
  click,
  id,
  childrenOf,
  className
} from './shallowHelpers';
import 'whatwg-fetch';
import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { App } from '../src/App';
import CustomerForm from '../src/CustomerForm';

describe('App', () => {
  let render, elementMatching, child;
  beforeEach(() => {
    ({ render, elementMatching, child } = createShallowRenderer());
  });
  afterEach(() => {
    // window.fetch.mockRestore();
  });
  const begineAddingCustomerFormAppointment =()=>{
    render(<App />);
    click(elementMatching(id('addCustomer')));
  }
  it('initially shows the AppointmentsDayViewLoader', () => {
    render(<App />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });
  it('has a button bar as the first child', () => {
    render(<App />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('has a button to initiate add customer and appointment action', () => {
    render(<App />);
    const buttons = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(buttons[0].type).toEqual('button');
    expect(buttons[0].props.children).toEqual(
      'Add customer and appointment'
    );
  });

  it('displays the CustomerForm when button is clicked',() =>{
    begineAddingCustomerFormAppointment();
    expect(elementMatching(type(CustomerForm))).toBeDefined();
  });
});
