import React, { useState, useEffect, useCallback } from 'react';
const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
);
const SearchButtons = ({ handleNext }) => (
  <div className="button-bar">
    <button role="button" id="next-page" onClick={handleNext}>
      Next
    </button>
  </div>
);

export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([]);
  const handleNext = useCallback(() => {
    const after = customers[customers.length - 1].id;
    const url = `/customers?after=${after}`;
    // const request = {
    //   method: 'GET',
    //   credentials: 'same-origin',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // };
    window.fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }, [customers]);
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
      <SearchButtons handleNext={handleNext} />
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
          {Array.isArray(customers)
            ? customers.map(customer => (
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
