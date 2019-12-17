import React from 'react';
import 'whatwg-fetch';
import { createContainer, withEvent } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';
import {
  fetchResponseOk,
  fetchResponseError,
  requestBodyOf,
  fetchRequestBodyOf
} from './spyHelpers';

describe('AppointmentForm', () => {
  let fetchSpy;

  const customer = { id: 123 };
  let render,
    container,
    form,
    field,
    labelFor,
    element,
    elements,
    change,
    children,
    submit;

  beforeEach(() => {
    ({
      render,
      container,
      form,
      field,
      labelFor,
      element,
      elements,
      change,
      children,
      submit
    } = createContainer());

    // fetchSpy = jest.fn(() => fetchResponseOk({}));
    // window.fetch = fetchSpy;
    // fetchSpy.mockReturnValue(fetchResponseOk({}));
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      option => option.textContent === textContent
    );
  };

  const startsAtField = index =>
    elements(`input[name="startsAt"]`)[index];

  it('it renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<AppointmentForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  const timeSlotTable = () => element('table#time-slots');

  const itRendersALabel = (fieldName, valueName) => {
    it('renders a label  ', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(valueName);
    });
  };
  it('calls fetch with the right properties when submitting data', async () => {
    render(<AppointmentForm customer={customer} />);
    await submit(form('appointment'));
    expect(window.fetch).toHaveBeenCalledWith(
      '/appointments',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });
  it('notifies onSave when form is submitted', async () => {
    const appointment = { id: 123 };
    window.fetch.mockReturnValue(fetchResponseOk({}));
    const saveSpy = jest.fn();

    render(
      <AppointmentForm onSave={saveSpy} customer={customer} />
    );
    await submit(form('appointment'));
    expect(saveSpy).toHaveBeenCalled();
  });
  const itSubmitsExistingValue = (fieldName, props) => {
    //Warining happend
    it('saves existing value when submitted', async () => {
      render(
        <AppointmentForm
          customer={customer}
          {...props}
          {...{ [fieldName]: 'value' }}
        />
      );
      await submit(form('appointment'));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: 'value'
      });
    });
  };
  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(
      <AppointmentForm onSave={saveSpy} customer={customer} />
    );
    await submit(form('appointment'));

    expect(saveSpy).not.toHaveBeenCalled();
  });
  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    render(<AppointmentForm customer={customer} />);
    await submit(form('appointment'), {
      preventDefault: preventDefaultSpy
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());

    render(<AppointmentForm customer={customer} />);
    await submit(form('appointment'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch(
      'error occurred'
    );
  });

  it('clears error message when fetch call succeeds', async () => {
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());

    render(<AppointmentForm customer={customer} />);
    await submit(form('appointment'));
    await submit(form('appointment'));

    expect(element('.error')).toBeNull();
  });

  it('passes the customer id to fetch when submitting', async () => {
    render(<AppointmentForm customer={customer} />);
    await submit(form('appointment'));
    expect(requestBodyOf(window.fetch)).toMatchObject({
      customer: customer.id
    });
  });
  const itSubmitsNewValue = (fieldName, valueName) => {
    it('saves existing new value when submitted', async () => {
      // expect.hasAssertions();
      render(
        <AppointmentForm
          customer={customer}
          {...{ [fieldName]: valueName }}
          onSubmit={props =>
            expect(props[fieldName]).toEqual(valueName)
          }
        />
      );
      change(field('appointment', fieldName), {
        target: { value: valueName, name: fieldName }
      });
      submit(form('appointment'));
    });
  };
  const itRendersASelectBox = fieldName => {
    it('it rendes a select box', () => {
      render(<AppointmentForm />);
      expect(field('appointment', fieldName)).not.toBeNull();
      expect(field('appointment', fieldName).tagName).toEqual(
        'SELECT'
      );
    });
  };
  const itInitiallyHasABlankValueChosen = fieldName => {
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field('appointment', fieldName)
        .childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });
  };

  describe('service field', () => {
    itRendersASelectBox('service');
    itInitiallyHasABlankValueChosen('service');

    it('lists all salon services', () => {
      const selectableServices = [
        'Cut',
        'Blow-dry',
        'Cut & color'
      ];

      render(
        <AppointmentForm selectableServices={selectableServices} />
      );

      const optionNodes = Array.from(
        field('appointment', 'service').childNodes
      );
      const renderedServices = optionNodes.map(
        node => node.textContent
      );
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });

    it('lists all salon services', () => {
      const selectableServices = ['Cut', 'Blow-dry'];

      render(
        <AppointmentForm selectableServices={selectableServices} />
      );

      const optionNodes = Array.from(
        field('appointment', 'service').childNodes
      );
      const renderedServices = optionNodes.map(
        node => node.textContent
      );
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
    it('pre-selects the existing value', () => {
      const services = ['Cut', 'Blow-dry', 'Cut & color'];
      render(
        <AppointmentForm
          selectableServices={services}
          service="Blow-dry"
        />
      );
      const option = findOption(
        field('appointment', 'service'),
        'Blow-dry'
      );
      expect(option.selected).toBeTruthy();
    });
    itRendersALabel('service', 'Salon Service');
    itSubmitsExistingValue('service', 'Blow-dry');
    itSubmitsNewValue('service', 'Cut');
  });
  describe('time slots table', () => {
    const today = new Date();
    const availableTimeSlots = [
      { startsAt: today.setHours(9, 0, 0, 0) },
      { startsAt: today.setHours(9, 30, 0, 0) }
    ];
    it('renders a table for time slots', () => {
      render(<AppointmentForm />);
      expect(
        container.querySelector('table#time-slots')
      ).not.toBeNull();
    });
    it('renders a time slot for every half  an hour between  open  and close times ', () => {
      render(
        <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDay = timeSlotTable().querySelectorAll(
        'tbody >* th'
      );
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });
    it('renders an empty cell at the start  of the header row', () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      );
      expect(headerRow.firstChild.textContent).toEqual('');
    });
    it('renders a week of available dates', () => {
      const date = new Date(2018, 11, 1);
      render(<AppointmentForm today={date} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead > * th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });
    it('renders a radio button for each time slot', () => {
      render(
        <AppointmentForm
          today={today}
          availableTimeSlots={availableTimeSlots}
        />
      );

      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).not.toBeNull();
    });
    it('does not render a radio button for unavailable time slots', () => {
      const availableTimeSlots = [];

      render(
        <AppointmentForm availableTimeSlots={availableTimeSlots} />
      );

      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets the radio button values to the index of the corresponding appointment', () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];

      render(
        <AppointmentForm
          today={today}
          availableTimeSlots={availableTimeSlots}
        />
      );
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(2);
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });

    it('saves new value when submitted', () => {
      //Warining happend

      render(
        <AppointmentForm
          customer={customer}
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      change(
        startsAtField(1),
        withEvent(
          'startsAt',
          availableTimeSlots[1].startsAt.toString()
        )
      );
      submit(form('appointment'));
    });
    it('passes the customer id to fetch when submitting', async () => {
      const customer = { id: 123 };
      render(<AppointmentForm customer={customer} />);
      await submit(form('appointment'));
      expect(fetchRequestBodyOf(window.fetch)).toMatchObject({
        customer: customer.id
      });
    });
  });
});
