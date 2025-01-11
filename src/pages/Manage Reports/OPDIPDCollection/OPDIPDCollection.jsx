import React, { useState } from "react";
import './OPDIPDCollection.css';

const OPDCollectionReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const collectionData = [
    {
      id: 1,
      receiptDate: "2025-01-07",
      opdCash: 0,
      ipdCash: 0,
      opdCard: 0,
      ipdCard: 0,
      opdCheque: 0,
      ipdCheque: 0,
      opdOnline: 0,
      ipdOnline: 0,
    },
  ];

  const filteredData = collectionData.filter((data) => {
    return (
      (!fromDate || new Date(data.receiptDate) >= new Date(fromDate)) &&
      (!toDate || new Date(data.receiptDate) <= new Date(toDate))
    );
  });

  const totals = filteredData.reduce(
    (acc, curr) => {
      acc.opdCash += curr.opdCash;
      acc.ipdCash += curr.ipdCash;
      acc.opdCard += curr.opdCard;
      acc.ipdCard += curr.ipdCard;
      acc.opdCheque += curr.opdCheque;
      acc.ipdCheque += curr.ipdCheque;
      acc.opdOnline += curr.opdOnline;
      acc.ipdOnline += curr.ipdOnline;
      return acc;
    },
    {
      opdCash: 0,
      ipdCash: 0,
      opdCard: 0,
      ipdCard: 0,
      opdCheque: 0,
      ipdCheque: 0,
      opdOnline: 0,
      ipdOnline: 0,
    }
  );

  return (
    <div className="container">
      <h2>OPD+IPD COLLECTION</h2>

      {/* Filter Section */}
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
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <button className="find-button">Find</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Receipt Date</th>
              <th>OPD Cash</th>
              <th>IPD Cash</th>
              <th>OPD Card</th>
              <th>IPD Card</th>
              <th>OPD Cheque</th>
              <th>IPD Cheque</th>
              <th>OPD Online</th>
              <th>IPD Online</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>
                <td>{data.receiptDate}</td>
                <td>{data.opdCash}</td>
                <td>{data.ipdCash}</td>
                <td>{data.opdCard}</td>
                <td>{data.ipdCard}</td>
                <td>{data.opdCheque}</td>
                <td>{data.ipdCheque}</td>
                <td>{data.opdOnline}</td>
                <td>{data.ipdOnline}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2"><strong>Total</strong></td>
              <td>{totals.opdCash}</td>
              <td>{totals.ipdCash}</td>
              <td>{totals.opdCard}</td>
              <td>{totals.ipdCard}</td>
              <td>{totals.opdCheque}</td>
              <td>{totals.ipdCheque}</td>
              <td>{totals.opdOnline}</td>
              <td>{totals.ipdOnline}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OPDCollectionReport ;
