import React from 'react';
import { createContainer, withEvent } from './domManipulators';
import {
  fetchResponseOk,
  fetchResponseError,
  fetchRequestBodyOf,
  requestBodyOf
} from './spyHelpers';
import 'whatwg-fetch';
// import ReactTestUtils, { act } from 'react-dom/test-utils';
import { CustomerSearch } from '../src/CustomerSearch';

describe('CustomerSearch', () => {
  let render,
    renderAndWait,
    container,
    form,
    field,
    labelFor,
    element,
    elements,
    change,
    submit,
    blur;

  beforeEach(() => {
    ({
      render,
      renderAndWait,
      container,
      form,
      field,
      labelFor,
      element,
      elements,
      change,
      submit,
      blur
    } = createContainer());

    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });
  it('fetches all customer data when component mounts', async () => {
    await renderAndWait(<CustomerSearch />);
    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
   
  it('renders a table with four headings', async () => {
    await renderAndWait(<CustomerSearch />);
    const headings = elements('table th');
    expect(headings).toBeDefined();
    expect(headings.length).toEqual(4);
    expect(headings.map(h => h.textContent)).toEqual([
        'First name',
        'Last name',
        'Phone number',
        'Actions'
      ]);
  });
  const oneCustomer = [
    {
      id: 1,
      firstName: 'A',
      lastName: 'B',
      phoneNumber: '1'
    }
  ];
  it('renders all customer data in a table row', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch />);
    const columns = elements('table tbody tr  td');
    expect(columns).toBeDefined();
    expect(columns.length).toEqual(3);    
    expect(columns[0].textContent).toEqual('A');
    expect(columns[1].textContent).toEqual('B');
    expect(columns[2].textContent).toEqual('1');
  });
});
