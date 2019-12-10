import React, { useState } from "react";

export const CustomerForm = ({ firstName, lastName,phoneNumber, onSave}) => {
  const [customer, setCustomer] = useState({ firstName, lastName ,phoneNumber });
  
  const handleChange= ({ target }) => {
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
      const customerWithId = await result.json();
      onSave(customerWithId);
    } else {
      setError(true);
    }
  };
  return (
    <form id="customer" onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={handleChange}
      ></input>
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={handleChange}
      ></input>
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
      ></input>
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