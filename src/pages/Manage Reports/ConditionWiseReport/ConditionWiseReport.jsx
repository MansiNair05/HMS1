import React, { useState } from 'react';
import './ConditionWiseReport.css';

const ConditionWiseReport = () => {
  // State for form inputs
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Placeholder data for the condition-wise report
  const conditionWiseReportData = [
    { date: '2025-01-01', condition: 'Diabetes', patients: 15, totalEarnings: 5000 },
  ];

  // Filter data based on selected dates
  const filteredData = conditionWiseReportData.filter((entry) => {
    const isDateValid =
      (!fromDate || new Date(entry.date) >= new Date(fromDate)) &&
      (!toDate || new Date(entry.date) <= new Date(toDate));
    return isDateValid;
  });

  // Handle Find button click
  const handleFindClick = () => {
    console.log(`Filtering condition-wise report from ${fromDate} to ${toDate}`);
  };
  

  return (
    <div className="condition-report-container">
      <h1>Condition Wise Report</h1>

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

      {/* Condition Wise Report Table */}
      <table className="condition-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Condition</th>
            <th>Patients</th>
            <th>Total Earnings (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.condition}</td>
                <td>{entry.patients}</td>
                <td>{entry.totalEarnings}</td>
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

export default ConditionWiseReport;