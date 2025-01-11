import React, { useState } from 'react';
import './EnquiryConversion.css';

const EnquiryConversation = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Placeholder data for enquiry conversations
  const enquiryConversationData = [
    { date: '2025-01-01', customer: 'Jane Doe', topic: 'Product Details' },
  ];

  // Filter data based on selected dates
  const filteredData = enquiryConversationData.filter((entry) => {
    const isDateValid =
      (!fromDate || new Date(entry.date) >= new Date(fromDate)) &&
      (!toDate || new Date(entry.date) <= new Date(toDate));
    return isDateValid;
  });

  // Handle Find button click
  const handleFindClick = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      console.error('Invalid date range: From Date should not be after To Date.');
      return;
    }
    console.log(`Filtering EnquiryConversation from ${fromDate} to ${toDate}`);
  };

  return (
    <div className="enquiry-conversation-container">
      <h1>Enquiry Conversation Report</h1>

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
            <button className="find-button" onClick={handleFindClick}>
              Find
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Conversation Table */}
      <table className="enquiry-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.customer}</td>
                <td>{entry.topic}</td>
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

export default EnquiryConversation;
