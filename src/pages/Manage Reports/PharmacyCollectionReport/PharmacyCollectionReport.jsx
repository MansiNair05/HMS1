import React, { useState } from 'react';
import './PharmacyCollectionReport.css';

const PharmacyCollectionReport = () => {
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const pharmacyCollectionData = [
    { date: '2025-01-01', customer: 'Jane Doe', amount: 1200 },
    { date: '2025-01-02', customer: 'John Smith', amount: 800 },
    { date: '2025-01-03', customer: 'Alice Brown', amount: 1500 },
  ];

  const filteredData = pharmacyCollectionData.filter((entry) => {
    const isDateValid =
      (!fromDate || new Date(entry.date) >= new Date(fromDate)) &&
      (!toDate || new Date(entry.date) <= new Date(toDate));
    return isDateValid;
  });

  const handleFindClick = () => {
    console.log(`Filtering Pharmacy collection from ${fromDate} to ${toDate}`);
    console.log('Filtered Data:', filteredData);
  };

  return (
    <div className="pharmacy-collection-container">
      <h1>Pharmacy Collection Report</h1>
      <div className="filter-container">
        <div className="form-group">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>To Date:</label>
          <div className="to-date-container">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button className="find-button" onClick={handleFindClick}>
              Find
            </button>
          </div>
        </div>
      </div>
      <table className="pharmacy-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.customer}</td>
                <td>{entry.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>
                No records found for the selected date range.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PharmacyCollectionReport;
