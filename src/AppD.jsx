import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout"; // Layout Component that contains Static Navbar
import Patient from "./Patient"; // Patient List Page
import Personal from "./Personal"; // Personal Page
import PatientHistory from "./PatientHistory"; // Other Pages (e.g., Diagnosis, Surgery, etc.)
import Diagnosis from "./Diagnosis";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define Layout route with static Navbar for Personal, PatientHistory, etc. */}
        <Route path="/" element={<Layout />}>
          {/* Nested Routes */}
          <Route path="/patient" element={<Patient />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/patientHistory" element={<PatientHistory />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          {/* Define other routes for remaining pages */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
