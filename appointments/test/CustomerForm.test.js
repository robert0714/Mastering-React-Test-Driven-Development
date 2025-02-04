import React from 'react';
import { createContainer, withEvent } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import {
  fetchResponseOk,
  fetchResponseError,
  fetchRequestBodyOf,
  requestBodyOf
} from './spyHelpers';
import 'whatwg-fetch';
import ReactTestUtils, { act } from 'react-dom/test-utils';

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

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };
  const validCustomer = {
    firstName: 'first',
    lastName: 'last',
    phoneNumber: '123456789'
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
          {...validCustomer}
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
          {...validCustomer}
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
  it('renders field validation errors from server', async () => {
    const errors = {
      phoneNumber: 'Phone number already exists in the system'
    };
    window.fetch.mockReturnValue(
      fetchResponseError(422, { errors })
    );
    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    expect(element('.error').textContent).toMatch(
      errors.phoneNumber
    );
  });
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
    // render(
    //   <CustomerForm fetch={window.fetch.fn} onSubmit={() => {}} />
    // );
    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));

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

    render(<CustomerForm {...validCustomer} onSave={saveSpy} />);
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
    window.fetch.mockReturnValue(fetchResponseError());
    // fetchSpy.stubReturnValue(Promise.resolve({ ok: false}));
    render(<CustomerForm {...validCustomer} />);
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
    // fetchSpy.mockReturnValueOnce(fetchResponseError());
    // fetchSpy.mockReturnValue(fetchResponseOk());
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());

    render(<CustomerForm {...validCustomer} />);
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
  describe('validation', () => {
    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        render(<CustomerForm />);

        blur(
          field('customer', fieldName),
          withEvent(fieldName, value)
        );

        expect(element('.error')).not.toBeNull();
        expect(element('.error').textContent).toMatch(description);
      });
    };

    itInvalidatesFieldWithValue(
      'firstName',
      ' ',
      'First name is required'
    );
    itInvalidatesFieldWithValue(
      'lastName',
      ' ',
      'Last name is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      ' ',
      'Phone number is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      'invalid',
      'Only numbers, spaces and these symbols are allowed: ( ) + -'
    );

    it('accepts standard phone number characters when validating', () => {
      render(<CustomerForm />);

      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber', '0123456789+()- ')
      );

      expect(element('.error')).toBeNull();
    });
  });
  describe('submitting the form', () => {
    it('does not submit the form when there are validation errors', async () => {
      render(<CustomerForm />);
      await submit(form('customer'));
      expect(window.fetch).not.toHaveBeenCalled();
    });

    it('renders validation errors after submission fails', async () => {
      render(<CustomerForm />);
      await submit(form('customer'));
      expect(window.fetch).not.toHaveBeenCalled();
      expect(element('.error')).not.toBeNull();
    });

    it('displays indicator when the form is submitting', async () => {
      render(<CustomerForm {...validCustomer} />);
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(element('span.submittingIndicator')).not.toBeNull();
      });
    });
    it('initially does not displays submitting indicator', async () => {
      render(<CustomerForm {...validCustomer} />);
      expect(element('.submittingIndicator')).toBeNull();
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(element('span.submittingIndicator')).not.toBeNull();
      });
    });
    it('hides indicator when form has submitted', async () => {
      render(<CustomerForm {...validCustomer} />);
      expect(element('.submittingIndicator')).toBeNull();
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      // await act(async () => {
      //   expect(element('span.submittingIndicator')).not.toBeNull();
      // });
      await submit(form('customer'));
      expect(element('.submittingIndicator')).toBeNull();
    });
  });
});
