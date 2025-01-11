import React, { useState } from 'react';
import './BillingReport.css'; // Importing the CSS for styling

const BillingReport = () => {
  // State for form inputs
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Placeholder data for the Billing Report
  const billingReport = [
    { date: '2025-01-01', patient: 'John Doe', amount: 5000, status: 'Paid' },
  ];

  // Filter data based on selected dates
  const filteredData = billingReport.filter((entry) => {
    const isDateValid =
      (!fromDate || new Date(entry.date) >= new Date(fromDate)) &&
      (!toDate || new Date(entry.date) <= new Date(toDate));
    return isDateValid;
  });

  // Handle Find button click
  const handleFindClick = () => {
    console.log(`Filtering Billing Report from ${fromDate} to ${toDate}`);
  };

  return (
    <div className="billing-report-container">
      <h1>Billing Report</h1>

      {/* Filters */}
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
            <button
              className="find-button"
              onClick={handleFindClick}
            >
              Find
            </button>
          </div>
        </div>
      </div>

      {/* Billing Report Table */}
      <table className="billing-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Amount (Rs)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.patient}</td>
                <td>{entry.amount}</td>
                <td>{entry.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No records found for the selected date range.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BillingReport;
