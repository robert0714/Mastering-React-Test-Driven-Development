import React, { useState } from "react";

export const CustomerForm = ({ firstName, lastName,phoneNumber, onSubmit }) => {
  const [customer, setCustomer] = useState({ firstName, lastName ,phoneNumber });
  const handleChangeFirstName = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      firstName: target.value 
    }));
  };
  const handleChangeLastName = ({ target }) => {
    setCustomer(customer => ({
      ...customer, 
      lastName: target.value
    }));
  };
  const handleChangePhoneNumber = ({ target }) => {
    setCustomer(customer => ({
      ...customer, 
      phoneNumber: target.value
    }));
  };

  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={handleChangeFirstName}
      ></input>
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={handleChangeLastName}
      ></input>
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onChange={handleChangePhoneNumber}
      ></input>
    </form>
  );
};
