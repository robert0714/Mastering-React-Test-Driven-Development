import React from 'react';
import { createContainer, withEvent } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import {
  fetchResponseOk,
  fetchResponseError,
  fetchRequestBodyOf
} from './spyHelpers';
import 'whatwg-fetch';

describe('CustomerForm', () => {
  const originalFetch = window.fetch;
  let render,
    container,
    form,
    field,
    labelFor,
    element,
    elements,
    change,
    submit,
    blur;
  let fetchSpy;

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
      submit,
      blur
    } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
    fetchSpy.mockReturnValue(fetchResponseOk({}));
    // jest.spyOn(window,'fetch').mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const itIncludesTheExistingValue = fieldName => {
    it('renders the existing value  ', () => {
      render(
        <CustomerForm {...{ [fieldName]: 'value' }}></CustomerForm>
      );
      expect(field('customer', fieldName).value).toEqual('value');
    });
  };
  const itRendersAsATextBox = fieldName => {
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field('customer', fieldName));
    });
  };
  const itRendersALabel = (fieldName, valueName) => {
    it('renders a label  ', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(valueName);
    });
  };
  const assignsAnIdThatMatchesTheLabelId = fieldName => {
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, valueName) => {
    it('saves existing value when submitted', async () => {
      // const fetchSpy = spy();
      render(
        <CustomerForm
          {...{ [fieldName]: valueName }}
          // fetch={fetchSpy.fn}
          // onSubmit={() => {}}
        />
      );
      // await ReactTestUtils.Simulate.submit(form('customer'));
      submit(form('customer'));
      expect(fetchRequestBodyOf(window.fetch)).toBeDefined();

      expect(fetchRequestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: valueName
      });
    });
  };
  const itSubmitsNewValue = (fieldName, valueName) => {
    it('saves existing new value when submitted', async () => {
      // expect.hasAssertions();
      // const fetchSpy = spy();
      render(
        <CustomerForm
          {...{ [fieldName]: valueName }}
          // onSubmit={props =>
          //   expect(props[fieldName]).toEqual(valueName)
          // }
          // fetch={fetchSpy.fn}
          // onSubmit={() => {}}
        />
      );
      // await ReactTestUtils.Simulate.change(
      //   field("customer" ,fieldName),
      //   {
      //     target: { value: valueName, name: fieldName }
      //   }
      // );

      // change(form('customer'),{
      //   target: { value: valueName, name: fieldName }
      // });
      change(
        field('customer', fieldName),
        withEvent(fieldName, valueName)
      );

      // await ReactTestUtils.Simulate.submit(form('customer'));
      submit(form('customer'));

      expect(fetchRequestBodyOf(window.fetch)).toBeDefined();

      expect(fetchRequestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: valueName
      });
    });
  };

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  it('renders the first name field  as a text box', () => {
    render(<CustomerForm />);
    const field = form('customer').elements.firstName;

    expectToBeInputFieldOfTypeText(field);
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First Name');
    assignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName', 'Ashley');
    itSubmitsNewValue('firstName', 'Ashley');
  });
  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last Name');
    assignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName', 'Ashley');
    itSubmitsNewValue('lastName', 'Ashley');
  });
  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone Number');
    assignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber', '012345');
    itSubmitsNewValue('phoneNumber', '012345');
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const btn = element("INPUT[type='submit']");
    expect(btn).not.toBeNull();
  });
  it('call fetch with the right properies when submitting data', async () => {
    render(
      <CustomerForm fetch={window.fetch.fn} onSubmit={() => {}} />
    );
    // await ReactTestUtils.Simulate.submit(form('customer'));
    submit(form('customer'));

    expect(window.fetch).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
  });
  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    // await act(async () => {
    //   ReactTestUtils.Simulate.submit(form('customer'));
    // });

    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });
  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    // await act(async () => {
    //   ReactTestUtils.Simulate.submit(form('customer'));
    // });
    await submit(form('customer'));

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();

    render(<CustomerForm />);
    // await act(async () => {
    //   ReactTestUtils.Simulate.submit(form('customer'), {
    //     preventDefault: preventDefaultSpy
    //   });
    // });
    await submit(form('customer'), {
      preventDefault: preventDefaultSpy
    });
  });
  it('renders a error message when fetch call fails', async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    // fetchSpy.stubReturnValue(Promise.resolve({ ok: false}));
    render(<CustomerForm />);
    // await act(async () => {
    //   ReactTestUtils.Simulate.submit(form('customer'));
    // });
    await submit(form('customer'));

    const errorElemet = element('.error');
    // const errorElemet = container.querySelector('.error');
    // expect(errorElemet).toEqual('');
    expect(errorElemet).not.toBeNull();
    expect(errorElemet.textContent).toMatch('error occurred');
  });
  it('clears error message when fetch call succeeds', async () => {
    fetchSpy.mockReturnValueOnce(fetchResponseError());
    fetchSpy.mockReturnValue(fetchResponseOk());
    render(<CustomerForm />);
    await submit(form('customer'));
    // await act(async () => {
    //   ReactTestUtils.Simulate.submit(form('customer'));
    // });
    // await act(async () => {
    //   ReactTestUtils.Simulate.submit(form('customer'));
    // });
    await submit(form('customer'));

    expect(element('.error')).toBeNull();
  });
  it('displays error after blur when first name field is blank', () => {
    render(<CustomerForm />);
    blur(
      field('customer', 'firstName'),
      withEvent('firstName', '')
    );
    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('First name is required');
  });
  it('displays error after blur when last name field is blank', () => {
    render(<CustomerForm />);
    blur(
      field('customer', 'lastName'),
      withEvent('lastName', '')
    );
    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('Last name is required');
  });
});
