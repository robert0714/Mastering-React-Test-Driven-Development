import React, { useState } from 'react';
import { createContainer } from './domManipulators';
import {
  isTSAnyKeyword,
  exportAllDeclaration
} from '@babel/types';
import { CustomerForm } from '../src/CustomerForm';
import ReactTestUtils from 'react-dom/test-utils';

describe('CustomweForm', () => {
  const originalFetch = window.fetch;
  let fetchSpy;
  let render, container;
  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}"]`);

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  //   const firstNameField = () => form("customer").elements.firstName;
  // const firstNameField = () =>  fieldProgram("firstName") ;
  //   const lastNameField = () => form("customer").elements.lastName;
  // const lastNameField = () =>  fieldProgram("lastName") ;

  const fieldProgram = name => form('customer').elements[name];

  const itIncludesTheExistingValue = fieldName => {
    it('renders the existing value  ', () => {
      render(
        <CustomerForm {...{ [fieldName]: 'value' }}></CustomerForm>
      );
      expect(fieldProgram(fieldName).value).toEqual('value');
    });
  };
  const itRendersAsATextBox = fieldName => {
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(fieldProgram(fieldName));
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
      expect(fieldProgram(fieldName).id).toEqual(fieldName);
    });
  };
  const spy = () => {
    let receivedArguments;
    return {
      fn: (...args) => (receivedArguments = args),
      receivedArguments: () => receivedArguments,
      receivedArgument: n => receivedArguments[n]
    };
  };
  expect.extend({
    toHaveBeenCalled(received) {
      if (received.receivedArguments() === undefined) {
        return {
          pass: false,
          message: () => 'Spy was not called'
        };
      }
      return { pass: true, message: () => 'Spy was called' };
    }
  });
  const itSubmitsExistingValue = (fieldName, valueName) => {
    it('saves existing value when submitted', async () => {
      // const fetchSpy = spy();
      render(
        <CustomerForm
          {...{ [fieldName]: valueName }}
          fetch={fetchSpy.fn}
          onSubmit={() => {}}
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));

      // expect(fetchSpy).toHaveBeenCalled();
      // expect(fetchSpy.receivedArgument(0)).toEqual('/customers');
      const fetchOpts = fetchSpy.receivedArgument(1);
      // expect(fetchOpts).toEqual("...");
      expect(fetchOpts).toBeDefined();
      expect(fetchOpts.body).toBeDefined();
      expect(JSON.parse(fetchOpts.body)[fieldName]).toBeDefined();
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(
        valueName
      );
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
          fetch={fetchSpy.fn}
          onSubmit={() => {}}
        />
      );
      await ReactTestUtils.Simulate.change(
        fieldProgram(fieldName),
        {
          target: { value: valueName, name: fieldName }
        }
      );
      await ReactTestUtils.Simulate.submit(form('customer'));

      const fetchOpts = fetchSpy.receivedArgument(1);
      // expect(fetchOpts).toEqual("...");
      expect(fetchOpts).toBeDefined();
      expect(fetchOpts.body).toBeDefined();
      expect(JSON.parse(fetchOpts.body)[fieldName]).toBeDefined();
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(
        valueName
      );
    });
  };

  it('renders a form', () => {
    render(<CustomerForm />);
    // expect(container.querySelector('form[id="customer"]')).not.toBeNull();
    expect(form('customer')).not.toBeNull();
  });

  it('renders the first name field  as a text box', () => {
    render(<CustomerForm />);
    const field = form('customer').elements.firstName;
    // expect(field).not.toBeNull();
    // expect(field.tagName).toEqual("INPUT");
    // expect(field.type).toEqual("text");
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
    const btn = container.querySelector("INPUT[type='submit']");
    expect(btn).not.toBeNull();
    // expect(container.querySelector('form[id="customer"]')).not.toBeNull();
  });
  it('call fetch with the right properies when submitting data', async () => {
    // const fetchSpy = spy();
    render(
      <CustomerForm fetch={fetchSpy.fn} onSubmit={() => {}} />
    );
    await ReactTestUtils.Simulate.submit(form('customer'));
    // expect(fetchSpy.receivedArguments()).toBeDefined();
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArgument(0)).toEqual('/customers');
    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(fetchOpts.method).toEqual('POST');
    expect(fetchOpts.credentials).toEqual('same-origin');
    expect(fetchOpts.headers).toEqual({
      'Content-Type': 'application/json'
    });
  });
});
