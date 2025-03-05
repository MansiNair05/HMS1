import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

export default function NavBarD() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const today = new Date();
  const formattedDate = today.toLocaleDateString();
  const location = useLocation();

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
            {/* <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              <span className="nav-icon">🏠</span>
              Dashboard
            </Link> */}
            {/* <span className="separator">•</span> */}
            <Link
              to="/personal"
              className={`nav-link ${
                location.pathname === "/personal" ? "active" : ""
              }`}
            >
              Personal
            </Link>
            <span className="separator">•</span>
            <Link
              to="/patientHistory"
              className={`nav-link ${
                location.pathname === "/patientHistory" ? "active" : ""
              }`}
            >
              Patient History
            </Link>
            <span className="separator">•</span>
            <Link
              to="/diagnosis"
              className={`nav-link ${
                location.pathname === "/diagnosis" ? "active" : ""
              }`}
            >
              Diagnosis
            </Link>
            <span className="separator">•</span>
            <Link
              to="/follow-up"
              className={`nav-link ${
                location.pathname === "/follow-up" ? "active" : ""
              }`}
            >
              Follow Up
            </Link>
            <span className="separator">•</span>
            <Link
              to="/otherTests"
              className={`nav-link ${
                location.pathname === "/otherTests" ? "active" : ""
              }`}
            >
              Other Tests
            </Link>
            <span className="separator">•</span>
            <Link
              to="/opdPrescription"
              className={`nav-link ${
                location.pathname === "/opdPrescription" ? "active" : ""
              }`}
            >
              OPD Prescription
            </Link>
            <span className="separator">•</span>
            <Link
              to="/surgery"
              className={`nav-link ${
                location.pathname === "/surgery" ? "active" : ""
              }`}
            >
              Surgery
            </Link>
            <span className="separator">•</span>
            <Link
              to="/dischargeCard"
              className={`nav-link ${
                location.pathname === "/dischargeCard" ? "active" : ""
              }`}
            >
              Discharge Card
            </Link>
          </nav>

          {/* Right Section: Time & Date */}
          <div className="date-time">
            <div className="time-box">
              <i className="fa fa-clock-o pulse"></i>
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
            background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
            padding: 15px 12px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin: 12px;
            border: 1px solid rgba(255, 255, 255, 0.8);
          }

          .navbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          .breadcrumb-nav {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 2px;
            font-weight: 500;
            font-size: 14px;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            color: #2c3e50;
            padding: 8px 14px;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: transparent;
          }

          .nav-icon {
            font-size: 16px;
            opacity: 0.8;
          }

          .nav-link:hover {
            background-color: #ffffff;
            color: #1a73e8;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

                    .nav-link:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          }

          .separator {
            color: #94a3b8;
            font-size: 12px;
            gap: 1px;
          
          }

          .date-time {
            display: flex;
            gap: 12px;
          }

          .time-box, .date-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
            padding: 10px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            color:rgb(29, 32, 37);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            border: 1px solid rgba(226, 232, 240, 0.8);
          }

          .time-box:hover, .date-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          }

          .time-box i, .date-box i {
            font-size: 16px;
            color: #3b82f6;
          }

          .pulse {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }

          @media (max-width: 768px) {
            .navbar-content {
              flex-direction: column;
              align-items: stretch;
            }
            
            .breadcrumb-nav {
              justify-content: center;
              gap: 6px;
            }
            
            .nav-link {
              padding: 6px 10px;
              font-size: 13px;
            }
            
            .date-time {
              justify-content: center;
              flex-wrap: wrap;
            }

            .time-box, .date-box {
              padding: 8px 12px;
              font-size: 13px;
            }
          }

          @media (max-width: 480px) {
            .nav-icon {
              display: none;
            }
            
            .nav-link {
              padding: 4px 8px;
              font-size: 12px;
            }
          }

          .nav-link.active {
            background-color: #ffffff;
            color: #1a73e8;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            position: relative;
          }

          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background-color: #1a73e8;
            border-radius: 2px;
          }

          .nav-link.active .nav-icon {
            opacity: 1;
          }

          .nav-link.active:hover {
            transform: none;
          }

          @media (max-width: 768px) {
            .nav-link.active::after {
              width: 60%;
            }
          }
        `}
      </style>
    </div>
  );
}