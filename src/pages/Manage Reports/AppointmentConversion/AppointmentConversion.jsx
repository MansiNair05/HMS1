import React, { useState } from 'react';
import './AppointmentConversion.css'; 

// Sample data for appointment report
const appointmentTypes = ['Consultation', 'Follow-up', 'Check-up'];
const appointmentStatuses = ['Scheduled', 'Completed', 'Cancelled'];

const AppointmentReport = () => {
  // State for form inputs
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');

  // Sample report data (could be dynamic based on real data)
  const appointmentData = [
    { date: '2025-01-01', type: 'Consultation', status: 'Scheduled', patient: 'John Doe' },
   
  ];

  // Filter data based on selected inputs
  const filteredData = appointmentData.filter((appointment) => {
    const isDateValid =
      (!fromDate || new Date(appointment.date) >= new Date(fromDate)) &&
      (!toDate || new Date(appointment.date) <= new Date(toDate));
    const isTypeValid = !appointmentType || appointment.type === appointmentType;
    const isStatusValid = !appointmentStatus || appointment.status === appointmentStatus;

    return isDateValid && isTypeValid && isStatusValid;
  });

  return (
    <div className="appointment-report-container">
      <h1>Manage Appointment Report</h1>

      {/* Form for selecting filters */}
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

        <div className="form-group">
          <label>Appointment Type:</label>
          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
          >
            <option value="">All</option>
            {appointmentTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Appointment Status:</label>
          <select
            value={appointmentStatus}
            onChange={(e) => setAppointmentStatus(e.target.value)}
          >
            <option value="">All</option>
            {appointmentStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table for displaying filtered appointments */}
      <h2>Appointment Details</h2>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Patient</th>
            <th>Appointment Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.date}</td>
                <td>{appointment.patient}</td>
                <td>{appointment.type}</td>
                <td>{appointment.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No appointments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentReport;
