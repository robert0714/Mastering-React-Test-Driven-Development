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
    clickAndWait,
    changeAndWait;

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
      clickAndWait,
      changeAndWait
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
  const twoCustomer = [
    {
      id: 1,
      firstName: 'A',
      lastName: 'B',
      phoneNumber: '1'
    },
    {
      id: 2,
      firstName: 'C',
      lastName: 'D',
      phoneNumber: '2'
    }
  ];
  it('renders multiple customer rows', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(twoCustomer));
    await renderAndWait(<CustomerSearch />);
    const rows = elements('table tbody tr');
    expect(rows).toBeDefined();
    expect(rows.length).toEqual(2);
    expect(rows[1].childNodes[0].textContent).toEqual('C');
    expect(rows[1].childNodes[1].textContent).toEqual('D');
    expect(rows[1].childNodes[2].textContent).toEqual('2');
  });
  it('has a next button', async () => {
    await renderAndWait(<CustomerSearch />);
    expect(element('button#next-page')).not.toBeNull();
  });
  const tenCustomers = Array.from('0123456789', id => ({ id }));
  it('requests next page of data when next button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderAndWait(<CustomerSearch />);
    // expect(element('button#next-page')).not.toBeNull();
    await clickAndWait(element('button#next-page'));

    expect(window.fetch).toHaveBeenCalledWith(
      '/customers?after=9',
      expect.anything()
    );
  });
  it('displays next page of data when next button is clicked', async () => {
    const nextCustomer = [{ id: 'next', firstName: 'Next' }];
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(nextCustomer));
    // window.fetch
    //   .mockReturnValueOnce(fetchResponseOk(nextCustomer));
    await renderAndWait(<CustomerSearch />);
    await clickAndWait(element('button#next-page'));
    expect(elements('tbody tr').length).toEqual(1);
    expect(elements('td')[0].textContent).toEqual('Next');
  });
  it('has a previous button', async () => {
    await renderAndWait(<CustomerSearch />);
    expect(element('button#previous-page')).not.toBeNull();
  });
  it('moves back to first page when previous button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderAndWait(<CustomerSearch />);
    await clickAndWait(element('button#next-page'));

    expect(window.fetch).toHaveBeenCalledWith(
      '/customers?after=9',
      expect.anything()
    );
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    );
  });
  const anotherCustomers = Array.from('ABCDEFGHIJ', id => ({
    id
  }));
  if (
    ('move back one page when clicking previous after multiple clicks of the next button',
    async () => {
      window.fetch
        .mockReturnValueOnce(fetchResponseOk(tenCustomers))
        .mockReturnValue(fetchResponseOk(anotherCustomers));
      await renderAndWait(<CustomerSearch />);
      await clickAndWait(element('button#next-page'));
      await clickAndWait(element('button#next-page'));
      await clickAndWait(element('button#previous-page'));
      expect(window.fetch).toHaveBeenCalledWith(
        '/customers?after=9',
        expect.anything()
      );
    })
  );
  it('has a search input field with a placeholder', async () => {
    await renderAndWait(<CustomerSearch />);
    expect(element('input')).not.toBeNull();
    expect(element('input').getAttribute('placeholder')).toEqual(
      'Enter filter text'
    );
  });
  it('performs search when search term is changed', async () => {
    await renderAndWait(<CustomerSearch />);
    await changeAndWait(
      element('input'),
      withEvent('input', 'robert1')
    );
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?searchTerm=robert1',
      expect.anything()
    );
  });
  it('includes search term when moving to next page', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderAndWait(<CustomerSearch />);
    await changeAndWait(
      element('input'),
      withEvent('input', 'pamela')
    );
    await clickAndWait(element('button#next-page'));
    
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers/customers?after=9&searchTerm=pamela',
      expect.anything()
    );
  });
});
