import React from "react";
import { Route, Routes, Link } from "react-router-dom";

// Create simple components for pages
const Home = () => (
  <div>
    <h2>Home Page</h2>
    <p>This is the Home page content inside the card body.</p>
  </div>
);

const Personal = () => (
  <div>
    <h2>Personal Page</h2>
    <p>This is the Personal page content inside the card body.</p>
  </div>
);

const PatientHistory = () => (
  <div>
    <h2>Services Page</h2>
    <p>This is the Services page content inside the card body.</p>
  </div>
);

const Diagnosis = () => (
  <div>
    <h2>Contact Page</h2>
    <p>This is the Contact page content inside the card body.</p>
  </div>
);

const FollowUp = () => (
  <div>
    <h2>Follow Up Page</h2>
    <p>This is the Follow Up page content inside the card body.</p>
  </div>
);

const OtherTests = () => (
  <div>
    <h2>Other Tests Page</h2>
    <p>This is the Other Tests page content inside the card body.</p>
  </div>
);

const OpdPrescription = () => (
  <div>
    <h2>OPD Prescription Page</h2>
    <p>This is the OPD Prescription page content inside the card body.</p>
  </div>
);

const Surgery = () => (
  <div>
    <h2>Surgery Page</h2>
    <p>This is the Surgery page content inside the card body.</p>
  </div>
);

const DischargeCard = () => (
  <div>
    <h2>Discharge Card Page</h2>
    <p>This is the Discharge Card page content inside the card body.</p>
  </div>
);

// Navbar component
const Navbar = () => {
  return (
    <nav
      style={{
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>Logo</div>
      <ul
        style={{
          listStyleType: "none",
          display: "flex",
          gap: "15px",
          margin: "0",
          padding: "0",
        }}
      >
        <li>
          <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/personal" style={{ textDecoration: "none", color: "#000" }}>
            Personal
          </Link>
        </li>
        <li>
          <Link to="/patientHistory" style={{ textDecoration: "none", color: "#000" }}>
            Patient History
          </Link>
        </li>
        <li>
          <Link to="/diagnosis" style={{ textDecoration: "none", color: "#000" }}>
            Diagnosis
          </Link>
        </li>
        <li>
          <Link to="/followUp" style={{ textDecoration: "none", color: "#000" }}>
            Follow Up
          </Link>
        </li>
        <li>
          <Link to="/otherTests" style={{ textDecoration: "none", color: "#000" }}>
            Other Tests
          </Link>
        </li>
        <li>
          <Link to="/opdPrescription" style={{ textDecoration: "none", color: "#000" }}>
            OPD Prescription
          </Link>
        </li>
        <li>
          <Link to="/surgery" style={{ textDecoration: "none", color: "#000" }}>
            Surgery
          </Link>
        </li>
        <li>
          <Link to="/dischargeCard" style={{ textDecoration: "none", color: "#000" }}>
            Discharge Card
          </Link>
        </li>
      </ul>
    </nav>
  );
};

// App component with card structure
const App = () => {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "#f7f7f7",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginTop: "100px",
      }}
    >
      {/* Card Header with Navbar */}
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Navbar />
      </div>

      {/* Card Body with dynamic content based on Routes */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/patientHistory" element={<PatientHistory />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/followUp" element={<FollowUp />} />
          <Route path="/otherTests" element={<OtherTests />} />
          <Route path="/opdPrescription" element={<OpdPrescription />} />
          <Route path="/surgery" element={<Surgery />} />
          <Route path="/dischargeCard" element={<DischargeCard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
