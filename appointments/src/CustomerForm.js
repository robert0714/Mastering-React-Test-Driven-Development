import React, { useState } from 'react';

const Error = () => {
  return (
    <div className="error">An error occurred during save.</div>
  );
};

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

  const required = description => value =>
    !value || value.trim() === '' ? description : undefined;

  const validateMany = fields =>
    Object.entries(fields).reduce(
      (result, [name, value]) => ({
        ...result,
        [name]: validators[name](value)
      }),
      {}
    );
  const anyErrors = errors =>
    Object.values(errors).some(error => error !== undefined);

  const match = (re, description) => value =>
    !value.match(re) ? description : undefined;
  const list = (...validators) => value =>
    validators.reduce(
      (result, validator) => result || validator(value),
      undefined
    );
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
  const handleBlur = ({ target }) => {
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
    const validationResult = validateMany(customer);

    if (!anyErrors(validationResult)) {
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
    } else {
      setError(true);
      setValiationErrors(validationResult);
    }
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error /> : null}
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
