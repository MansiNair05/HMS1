import React, { useState } from 'react';
import './OPDCollectionReport.css';

const OPDCollectionReport = () => {
  // State for form inputs
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Placeholder data for OPD collection (can be replaced with real API data)
  const opdCollectionData = [
    { date: '2025-01-01', patient: 'John Doe', amount: 500 },
  ];

  // Filter data based on selected dates
  const filteredData = opdCollectionData.filter((entry) => {
    const isDateValid =
      (!fromDate || new Date(entry.date) >= new Date(fromDate)) &&
      (!toDate || new Date(entry.date) <= new Date(toDate));
    return isDateValid;
  });

  // Handle Find button click
  const handleFindClick = () => {
    console.log(`Filtering OPD collection from ${fromDate} to ${toDate}`);
  };
  

  return (
    <div className="opd-collection-container">
      <h1>OPD Collection Report</h1>

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

      {/* OPD Collection Table */}
      <table className="opd-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.patient}</td>
                <td>{entry.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No records found for the selected date range.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OPDCollectionReport;