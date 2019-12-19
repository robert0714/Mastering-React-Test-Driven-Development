import React, { useState, useEffect, useCallback } from 'react';
const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
);
const SearchButtons = ({ handleNext, handlePrevious }) => (
  <div className="button-bar">
    <button
      role="button"
      id="previous-page"
      onClick={handlePrevious}>
      Previous
    </button>
    <button role="button" id="next-page" onClick={handleNext}>
      Next
    </button>
  </div>
);
const request = {
  method: 'GET',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
};
export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([]);
  // const [queryString, setQueryString] = useState('');
  const [queryStrings, setQueryStrings] = useState([]);
  const [previousQueryString, setPreviousQueryString] = useState(
    ''
  );

  const handleNext = useCallback(
    async queryString => {
      const after = customers[customers.length - 1].id;
      const newQueryString = `/customers?after=${after}`;
      setPreviousQueryString(queryString);
      setQueryStrings([...queryStrings, newQueryString]);
      const result = await window.fetch(newQueryString, request);
      setCustomers(await result.json());
    },
    [customers,queryStrings]
  );

  const handlePrevious = useCallback(() => {    
    setQueryStrings(queryStrings.slice(0,-1));
  }, [queryStrings]);

  useEffect(() => {
    const fetchData = async () => {
      let queryString = '';
      if (queryStrings.length > 0) {
        queryString = queryStrings[queryStrings.length - 1];
      }
      const result = await window.fetch(
        `/customers${queryString}`,
        request
      );
      setCustomers(await result.json());
    };
    fetchData();
  }, [queryStrings]);
  return (
    <React.Fragment>
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
      <input placeholder="Enter filter text"  />
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
