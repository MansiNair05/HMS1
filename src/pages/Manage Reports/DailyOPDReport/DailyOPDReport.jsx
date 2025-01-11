import React from 'react';
import './DailyOPDReport.css'; // Importing the CSS for styling

// Data for the daily OPD report
const reportData = {
  opdCounts: [
    { type: "New", count: 0 },
    { type: "Follow UP", count: 0 },
    { type: "PO", count: 0 },
    { type: "PROCTOSCOPY", count: 0 },
    { type: "TOTAL", count: 0 },
  ],
  opdDetails: [
    { type: "DNC", new: 0, followUp: 0, po: 0, total: 0 },
    { type: "DNP", new: 0, followUp: 0, po: 0, total: 0 },
    { type: "DNW", new: 0, followUp: 0, po: 0, total: 0 },
    { type: "DNT", new: 0, followUp: 0, po: 0, total: 0 },
    { type: "WALK IN", new: 0, followUp: 0, po: 0, total: 0 },
  ],
  collectionDetails: [
    { method: "Cash", amount: 0 },
    { method: "Card", amount: 0 },
    { method: "Online", amount: 0 },
    { method: "Paytm", amount: 0 },
    { method: "TOTAL", amount: 0 },
  ],
  testDetails: [
    { testName: "Test A", amount: 0 },
  ],
};

const DailyOPDReport = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-container">
      <h1>Daily OPD Report - 02-01-2025</h1>

      {/* OPD Counts */}
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {reportData.opdCounts.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* OPD Details */}
      <h2>OPD Details</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>New</th>
            <th>Follow UP</th>
            <th>PO</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {reportData.opdDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.new}</td>
              <td>{item.followUp}</td>
              <td>{item.po}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Test Details */}
      <h2>Test Details</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {reportData.testDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.testName}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Collection Details */}
      <h2>Overall Collection Details (Rs)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {reportData.collectionDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.method}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Button placed after the last table */}
      <button className="print-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default DailyOPDReport;
