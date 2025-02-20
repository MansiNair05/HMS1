import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import FeatherIcon from "feather-icons-react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
// import NavBarD from "./NavbarD";
import PageBreadcrumb from "../../componets/PageBreadcrumb";

const BASE_URL = "http://192.168.90.158:5000/api"; // Update your API base URL here

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(false); // Loading state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  // Fetch patients data
  const fetchPatientsData = async (withFilters = false) => {
    setLoading(true);
    try {
      const url = new URL(`${BASE_URL}/V1/patients/listPatient`);
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      if (withFilters && fromDate && toDate) {
        const params = {
          from: fromDate.split("-").reverse().join("/"),
          to: toDate.split("-").reverse().join("/"),
        };
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      } else {
        // Default filter for current date
        const params = {
          from: today.split("-").reverse().join("/"),
          to: today.split("-").reverse().join("/"),
        };
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Fetched Data:", data.data);
        const result = Array.isArray(data.data) ? data.data : [];
        setPatients(result);
        setFilteredPatients(result); // Initialize filtered data
      } else {
        console.error(
          "Error fetching patients:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsData(); // Fetch data on component mount
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = patients.filter((patient) =>
      Object.values(patient).some(
        (field) =>
          typeof field === "string" && field.toLowerCase().includes(value)
      )
    );

    setFilteredPatients(filteredData); // Update filtered data
  };

  // Navigate to Follow-Up page
  const handleViewPatient = async (patient) => {
    console.log("Patient Data Being Passed:", patient);

    try {
      localStorage.setItem("selectedPatientId", patient.patient_id);

      // Update API endpoints to match backend structure
      const followUpResponse = await fetch(
        `${BASE_URL}/V1/followUp/listFollowUp/${patient.patient_id}` // Updated endpoint
      );

      const personalResponse = await fetch(
        `${BASE_URL}/V1/patienttabs/personal/${patient.patient_id}`
      );

      const patientHistoryResponse = await fetch(
        `${BASE_URL}/V1/patientHistory/listPatientHistory/${patient.patient_id}` // Updated endpoint
      );

      // Check each response individually
      if (!followUpResponse.ok) {
        console.error("Follow-up fetch failed:", await followUpResponse.text());
      }

      if (!personalResponse.ok) {
        console.error("Personal fetch failed:", await personalResponse.text());
      }

      if (!patientHistoryResponse.ok) {
        console.error(
          "History fetch failed:",
          await patientHistoryResponse.text()
        );
      }

      // If personal data is available, proceed with navigation
      if (personalResponse.ok) {
        const personalData = await personalResponse.json();
        navigate("/personal", { state: { patient, personalData } });
      } else {
        // If personal data isn't available, still navigate but with just patient data
        navigate("/personal", { state: { patient } });
      }
    } catch (error) {
      console.error("Error in handleViewPatient:", error);
      // Still navigate even if there's an error
      navigate("/personal", { state: { patient } });
    }
  };

  // const handleOtherTests = (patient) => {
  //   console.log("Patient Data Being Passed to Other Tests:", patient); // Debugging line
  //   navigate("/otherTests", { state: { patient } });
  // };

  const handlePersonal = (patient) => {
    console.log("Patient Data Being Passed to Personal:", patient); // Debugging line
    navigate("/personal", { state: { patient } });
  };

  // Actions template for the DataTable
  const actionBodyTemplate = (rowData) => (
    <div className="cart-action" style={{ display: "flex", gap: "10px" }}>
      <Button
        variant="info"
        title="View Details"
        onClick={() => {
          handleViewPatient(rowData);
          handlePersonal(rowData);
        }}
        style={{
          width: "35px",
          height: "35px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          padding: "0",
        }}
      >
        <FeatherIcon icon="info" />
      </Button>
    </div>
  );

  // Header content with search and refresh button
  const renderHeader = () => (
    <div
      className="d-flex justify-content-between align-items-center"
      style={{
        border: "2px solid #4dd0e1",
        textAlign: "center",
        borderRadius: "8px",
        padding: "10px",
        backgroundColor: "#e0f7fa",
        fontWeight: "bold",
        color: "#006064",
      }}
    >
      {/* Left Section */}
      <div className="d-flex align-items-center" style={{ gap: "30px" }}>
        <Form.Group className="d-flex align-items-center pe-3 mb-0">
          <InputGroup>
            <Form.Control
              type="search"
              value={searchTerm}
              // value={filteredPatients.global.value || ""}
              // onChange={(e) =>
              //   setFilteredPatients({
              //     global: {
              //       value: e.target.value,
              //       matchMode: FilterMatchMode.CONTAINS,
              //     },
              //   })
              // }
              onChange={handleSearchChange} // Handle live search
              placeholder="Global Search"
            />
          </InputGroup>
        </Form.Group>
      </div>

      {/* Right Section */}
      <div
        className="d-flex align-items-center"
        style={{
          gap: "15px",
          border: "2px solid #4dd0e1",
          borderRadius: "8px",
          padding: "10px",
          backgroundColor: "#e0f7fa",
        }}
      >
        <Form.Group className="pe-3 mb-0">
          From Date
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="pe-3 mb-0">
          To Date
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={fetchPatientsData}>
          Refresh Data
        </Button>
      </div>
    </div>
  );

  const header = renderHeader();

  return (
    <div
      className="themebody-wrap"
      style={{
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        fontFamily: "'Poppins', Arial, sans-serif",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Breadcrumb */}
      <PageBreadcrumb pagename="All Patients" />
      {/* <NavBarD pagename="Patient List" /> */}
      {/* Theme body */}
      <div
        className="theme-body"
        style={{
          padding: "20px",
          background: "linear-gradient(to right, #e0f7fa, #80deea)",
          fontFamily: "'Poppins', Arial, sans-serif",
          minHeight: "100vh",
        }}
      >
        <Container fluid>
          <Row>
            <Col>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                  borderColor: "#00bcd4",
                  background: "white",
                  border: "1px solid #00bcd4",
                }}
              >
                <Card.Body>
                  {loading ? ( // Show loader if data is being fetched
                    <div
                      className="d-flex justify-content-center py-5"
                      style={{ color: "#00bcd4" }}
                    >
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <DataTable
                      value={filteredPatients}
                      paginator
                      rows={10}
                      header={header}
                      // globalFilterFields={[
                      //   "Uid_no",
                      //   "name",
                      //   "age",
                      //   "sex",
                      //   "phone",
                      //   "email",
                      //   "status",
                      // ]}

                      responsiveLayout="scroll"
                      className="p-datatable-customers"
                      rowClassName={(rowData, { rowIndex }) => ({
                        style: {
                          backgroundColor:
                            rowIndex % 2 === 0 ? "#e0f7fa" : "white", // Alternating colors
                          transition: "background-color 0.3s ease",
                        },
                        onMouseOver: (e) => {
                          e.currentTarget.style.backgroundColor = "#b2ebf2"; // Hover effect
                        },
                        onMouseOut: (e) => {
                          e.currentTarget.style.backgroundColor =
                            rowIndex % 2 === 0 ? "#e0f7fa" : "white"; // Revert on mouse out
                        },
                      })}
                      style={{
                        border: "1px solid #4dd0e1",
                        marginTop: "20px",
                        width: "100%",
                        background: "white",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Column
                        field="Uid_no"
                        header="UID"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        field="name"
                        header="Name"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        field="age"
                        header="Age"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        field="sex"
                        header="Gender"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        field="phone"
                        header="Phone No"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        field="email"
                        header="Email"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        header="Status"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        header="Actions"
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                    </DataTable>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
