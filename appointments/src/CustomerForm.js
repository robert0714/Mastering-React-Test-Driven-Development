import React, { useState } from 'react';

const Error = () => {
  return (
    <div className="error">An error occurred during save.</div>
  );
};
const required = description => value =>
  !value || value.trim() === '' ? description : undefined;

export const CustomerForm = ({
  firstName,
  lastName,
  phoneNumber,
  onSave
}) => {
  const [customer, setCustomer] = useState({
    firstName,
    lastName,
    phoneNumber
  });
  const [error, setError] = useState(false);
  const [valiationErrors, setValiationErrors] = useState({});
  const match = (re, description) => value =>
    !value.match(re) ? description : undefined;
  const list = (...validators) => value =>
    validators.reduce(
      (result, validator) => result || validator(value),
      undefined
    );
  const handleBlur = ({ target }) => {
    const validators = {
      firstName: required('First name is required'),
      lastName: required('Last name is required'),
      phoneNumber: list(
        required('Phone number is required'),
        match(
          /^[0-9+()\- ]*$/,
          'Only numbers, spaces and these symbols are allowed: ( ) + -'
        )
      )
    };
    const result = validators[target.name](target.value);
    setValiationErrors({
      ...valiationErrors,
      [target.name]: result
    });
  };

  const hasError = fieldName =>
    valiationErrors[fieldName] !== undefined;

  const renderError = fieldName => {
    if (hasError(fieldName)) {
      return (
        <span className="error">{valiationErrors[fieldName]}</span>
      );
    }
  };

  const handleChange = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (result.ok) {
      setError(false);
      const customerWithId = await result.json();
      onSave(customerWithId);
    } else {
      setError(true);
    }
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
      {/* <Error /> */}
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onBlur={handleBlur}
        onChange={handleChange}></input>
      {renderError('firstName')}
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onBlur={handleBlur}
        onChange={handleChange}></input>
      {renderError('lastName')}
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onBlur={handleBlur}
        onChange={handleChange}></input>
      {renderError('phoneNumber')}
      <input type="submit" value="Add" />
    </form>
  );
};

// CustomerForm.defaultProps ={
//   fetch: async () => {}
// };

CustomerForm.defaultProps = {
  onSave: () => {}
};
