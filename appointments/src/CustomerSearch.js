import React, { useState, useEffect } from 'react';
export const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
);
export const CustomerSearch = () => {
  const [customer, setCustomers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await window.fetch('/customers', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCustomers(await result.json());
    };

    fetchData();
  }, []);
  return (
    <table>
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Phone number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customer.map(customer => (
          <CustomerRow customer={customer} key={customer.id} />
        ))}
      </tbody>
    </table>
  );
};
