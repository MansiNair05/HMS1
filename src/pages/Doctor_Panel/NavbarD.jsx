import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function NavBarD() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const today = new Date();
  const formattedDate = today.toLocaleDateString();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="navbar-container">
      <Container fluid>
        <div className="navbar-content">
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb-nav">
            {/* <Link to="/">Dashboard</Link>
            <span>/</span>
            <Link to="/patient">Patient List</Link>
            <span>/</span> */}
            <Link to="/personal">Personal</Link>
            <span>/</span>
            <Link to="/patientHistory">Patient History</Link>
            <span>/</span>
            <Link to="/diagnosis">Diagnosis</Link>
            <span>/</span>
            <Link to="/follow-up">Follow Up</Link>
            <span>/</span>
            <Link to="/otherTests">Other Tests</Link>
            <span>/</span>
            <Link to="/opdPrescription">OPD Prescription</Link>
            <span>/</span>
            <Link to="/surgery">Surgery</Link>
            <span>/</span>
            <Link to="/dischargeCard">Discharge Card</Link>
          </nav>

          {/* Right Section: Time & Date */}
          <div className="date-time">
            <div className="time-box">
              <i className="fa fa-clock-o"></i>
              {time}
            </div>
            <div className="date-box">
              <i className="fa fa-calendar"></i>
              {formattedDate}
            </div>
          </div>
        </div>
      </Container>

      {/* CSS Styling */}
      <style>
        {`
          .navbar-container {
              background: linear-gradient(to right, #b3e5fc, #e1f5fe);
            padding: 10px 6px;
            border-radius: 8px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          }

          .navbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .breadcrumb-nav {
            display: flex;
            gap: 16px;
            font-weight: 575; /* Bolder Text */
            font-size: 12px; /* Bigger Text */
            color: #000;
          }

          .breadcrumb-nav a {
            text-decoration: none;
            color: #000;
            transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
          }

          .breadcrumb-nav a:hover {
            color: #333;
            text-decoration: underline;
            transform: scale(1.1); /* Zoom in on hover */
          }

          .date-time {
            display: flex;
            gap: 12px;
          }

          .time-box, .date-box {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.7);
            padding: 8px 14px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 15px; /* Bigger Text */
            color: #000;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease-in-out;
          }

          .time-box i, .date-box i {
            font-size: 15px; /* Bigger Icons */
            color: #000;
          }
        `}
      </style>
    </div>
  );
}
