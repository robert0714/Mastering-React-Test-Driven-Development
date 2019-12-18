import React, { useState, useEffect } from 'react';
const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
);
const SearchButtons = () => (
  <div className="button-bar">
    <button role="button" id="next-page">
      Next
    </button>
  </div>
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
    <React.Fragment>
      <SearchButtons />
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
          {Array.isArray(customer)
            ? customer.map(customer => (
                <CustomerRow
                  customer={customer}
                  key={customer.id}
                />
              ))
            : null}
        </tbody>
      </table>
    </React.Fragment>
  );
};
