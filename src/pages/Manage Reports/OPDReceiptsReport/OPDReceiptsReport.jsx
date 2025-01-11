import React, { useState } from "react";
import "./OPDReceiptsReport.css"; // Ensure this CSS file exists and is correctly linked

const OPDReceiptsReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [consultation, setConsultation] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const handleFind = () => {
    // Placeholder for API call or filtering logic
    console.log({
      fromDate,
      toDate,
      consultation,
      patientStatus,
      paymentMode,
    });
  };

  return (
    <div className="container">
      <h2 className="title">OPD Receipts Report</h2>
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="fromDate">From Date</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="toDate">To Date</label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="consultation">Consultation</label>
          <select
            id="consultation"
            value={consultation}
            onChange={(e) => setConsultation(e.target.value)}
          >
            <option value="">Select Consultation</option>
            <option value="General">General</option>
            <option value="Specialist">Specialist</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="patientStatus">Patient Status</label>
          <select
            id="patientStatus"
            value={patientStatus}
            onChange={(e) => setPatientStatus(e.target.value)}
          >
            <option value="">Select Patient Status</option>
            <option value="New">New</option>
            <option value="Follow-Up">Follow-Up</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="paymentMode">Payment Mode</label>
          <select
            id="paymentMode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <div className="filter-group">
          <button onClick={handleFind} className="find-button">
            Find
          </button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Consultation</th>
              <th>Patient Status</th>
              <th>Spray Qty</th>
              <th>Payment Mode</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="no-data">
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="footer">
        <div className="entries">
          <label htmlFor="entries">
            Show
            <select id="entries">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            entries
          </label>
        </div>
        <div className="search">
          <label htmlFor="search">
            Search: <input id="search" type="text" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default OPDReceiptsReport;
