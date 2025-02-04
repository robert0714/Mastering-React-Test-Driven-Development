import React from 'react';
import {
  createShallowRenderer,
  type,
  click,
  childrenOf,
  className,
  id
} from './shallowHelpers';
import { App } from '../src/App';
import { AppointmentFormLoader } from '../src/AppointmentFormLoader';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { CustomerForm } from '../src/CustomerForm';
import { CustomerSearch } from '../src/CustomerSearch';

describe('App', () => {
  let render, elementMatching, child;
  beforeEach(() => {
    ({ render, elementMatching, child } = createShallowRenderer());
  });
  afterEach(() => {
    // window.fetch.mockRestore();
  });
  const beginAddingCustomerAndAppointment = () => {
    render(<App />);
    click(elementMatching(id('addCustomer')));
  };
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

  it('displays the CustomerForm when button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(CustomerForm))).toBeDefined();
  });

  it('hides the AppointmentDayViewLoader when button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).not.toBeDefined();
  });

  it('hides the button bar when CustomerForm is being displayed', async () => {
    beginAddingCustomerAndAppointment();
    expect(
      elementMatching(className('button-bar'))
    ).not.toBeTruthy();
  });

  const saveCustomer = customer => {
    const element = elementMatching(type(CustomerForm));
    expect(element).toBeDefined();
    element.props.onSave(customer);
  };

  it('displays the AppointmentFormLoader after the CustomerForm is submittted', async () => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    expect(
      elementMatching(type(AppointmentFormLoader))
    ).toBeDefined();
  });

  it('passes the customer to the AppointmentForm', async () => {
    const customer = { id: 123 };

    beginAddingCustomerAndAppointment();
    saveCustomer(customer);

    expect(
      elementMatching(type(AppointmentFormLoader)).props.customer
    ).toBe(customer);
  });

  const saveAppointment = () =>
    elementMatching(type(AppointmentFormLoader)).props.onSave();

  it('renders AppointmentDayViewLoader after AppointmentForm is submitted', async () => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    saveAppointment();

    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });
  const searchCustomers = () => {
    render(<App />);
    click(elementMatching(id('searchCustomers')));
  };

  it('displays the CustomerSearch when button is clicked', async () => {
    searchCustomers();
    expect(elementMatching(type(CustomerSearch))).toBeDefined();
  });
  const renderSearchActionsForCustomer = customer => {
    searchCustomers();
    const customerSearch = elementMatching(type(CustomerSearch));
    const SearchActionComponent =
      customerSearch.props.renderCustomerActions;
    return SearchActionComponent(customer);
  };
  it('passes a button to the CustomerSearch named Create appointment', async () => {
    const button = childrenOf(renderSearchActionsForCustomer())[0];
    expect(button).toBeDefined();
    expect(button.type).toEqual('button');
    expect(button.props.role).toEqual('button');
    expect(button.props.children).toEqual('Create appointment');
  });
  it('clicking the appointment button shows the appointment from for that customer', async () => {
    const customer = { if: 123 };
    const button = childrenOf(renderSearchActionsForCustomer(customer))[0];
    click(button);
    expect(elementMatching(type(AppointmentFormLoader))).not.toBeNull();
    expect(elementMatching(type(AppointmentFormLoader)).props.customer).toBe(customer) ;
  });
});
