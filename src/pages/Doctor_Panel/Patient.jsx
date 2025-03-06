import { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import FeatherIcon from "feather-icons-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
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

const BASE_URL = "http://192.168.90.223:5000/api"; // Update your API base URL here

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(false); // Loading state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();
  const [filters1, setFilters1] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

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
    if (!patient || !patient.patient_id) {
      console.error("Invalid patient data:", patient);
      return;
    }

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

  // const handlePersonal = (patient) => {
  //   console.log("Patient Data Being Passed to Personal:", patient); // Debugging line
  //   navigate("/personal", { state: { patient } });
  // };

  // Actions template for the DataTable
  const actionBodyTemplate = (rowData) => (
    <div className="cart-action" style={{ display: "flex", gap: "10px" }}>
      <Button
        variant="info"
        title="View Details"
        onClick={() => {
          handleViewPatient(rowData);
          // handlePersonal(rowData);
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

  // // Header content with search and refresh button
  // const renderHeader = () => (
  //   <div
  //     className="d-flex justify-content-between align-items-center"
  //     style={{
  //       border: "2px solid #4dd0e1",
  //       textAlign: "center",
  //       borderRadius: "8px",
  //       padding: "10px",
  //       backgroundColor: "#e0f7fa",
  //       fontWeight: "bold",
  //       color: "#006064",
  //     }}
  //   >
  //     {/* Left Section */}
  //     <div className="d-flex align-items-center" style={{ gap: "30px" }}>
  //       <Form.Group className="d-flex align-items-center pe-3 mb-0">
  //         <InputGroup>
  //           <Form.Control
  //             type="search"
  //             value={searchTerm}
  //             // value={filteredPatients.global.value || ""}
  //             // onChange={(e) =>
  //             //   setFilteredPatients({
  //             //     global: {
  //             //       value: e.target.value,
  //             //       matchMode: FilterMatchMode.CONTAINS,
  //             //     },
  //             //   })
  //             // }
  //             onChange={handleSearchChange} // Handle live search
  //             placeholder="Global Search"
  //           />
  //         </InputGroup>
  //       </Form.Group>
  //     </div>

  //     {/* Right Section */}
  //     <div
  //       className="d-flex align-items-center"
  //       style={{
  //         gap: "15px",
  //         border: "2px solid #4dd0e1",
  //         borderRadius: "8px",
  //         padding: "10px",
  //         backgroundColor: "#e0f7fa",
  //       }}
  //     >
  //       <Form.Group className="pe-3 mb-0">
  //         From Date
  //         <Form.Control
  //           type="date"
  //           value={fromDate}
  //           onChange={(e) => setFromDate(e.target.value)}
  //         />
  //       </Form.Group>
  //       <Form.Group className="pe-3 mb-0">
  //         To Date
  //         <Form.Control
  //           type="date"
  //           value={toDate}
  //           onChange={(e) => setToDate(e.target.value)}
  //         />
  //       </Form.Group>
  //       <Button variant="primary" onClick={fetchPatientsData}>
  //         Refresh Data
  //       </Button>
  //     </div>
  //   </div>
  // );

  const renderHeader = () => (
    <div
      style={{
        border: "2px solid #4dd0e1",
        textAlign: "center",
        borderRadius: "12px",
        padding: "15px",
        backgroundColor: "#e0f7fa",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Global Search Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <Form.Group
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
            }}
          >
            <InputGroup>
              <Form.Control
                type="search"
                value={filters1.global.value || ""}
                onChange={(e) => {
                  const searchValue = e.target.value.toLowerCase();

                  // Update search state
                  setFilters1({
                    global: {
                      value: searchValue,
                      matchMode: FilterMatchMode.CONTAINS,
                    },
                  });

                  // Filter patients based on name
                  const filteredData = patients.filter((patient) =>
                    patient.name?.toLowerCase().includes(searchValue)
                  );

                  setFilteredPatients(filteredData); // Update the displayed data
                }}
                placeholder="Search by Name"
                style={{
                  borderRadius: "8px",
                  border: "2px solid #4dd0e1",
                  padding: "8px 12px",
                  width: "250px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              />
            </InputGroup>
          </Form.Group>
        </div>

        {/* Date Picker Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            border: "2px solid #4dd0e1",
            borderRadius: "12px",
            padding: "15px",
            backgroundColor: "#f5fcfd",
          }}
        >
          <div
            style={{
              margin: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#00838f",
                marginBottom: "5px",
              }}
            >
              From Date
            </div>
            <DatePicker
              selected={fromDate ? new Date(fromDate) : null}
              onChange={(date) => {
                const formattedDate = date
                  ? date.toISOString().split("T")[0]
                  : "";
                setFromDate(formattedDate);
                console.log("From Date Selected:", formattedDate);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select from date"
              maxDate={new Date()} // Disable future dates
              customInput={
                <Form.Control
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #4dd0e1",
                    padding: "8px 12px",
                    width: "160px",
                    fontSize: "14px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                  }}
                />
              }
              popperClassName="custom-popper"
              popperPlacement="bottom-start"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
              ]}
            />
          </div>

          <div
            style={{
              margin: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#00838f",
                marginBottom: "5px",
              }}
            >
              To Date
            </div>
            <DatePicker
              selected={toDate ? new Date(toDate) : null}
              onChange={(date) => {
                const formattedDate = date
                  ? date.toISOString().split("T")[0]
                  : "";
                setToDate(formattedDate);
                console.log("To Date Selected:", formattedDate);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select to date"
              maxDate={new Date()} // Disable future dates
              minDate={fromDate ? new Date(fromDate) : null} // Ensure "To Date" is not before "From Date"
              customInput={
                <Form.Control
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #4dd0e1",
                    padding: "8px 12px",
                    width: "160px",
                    fontSize: "14px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",
                  }}
                />
              }
              popperClassName="custom-popper"
              popperPlacement="bottom-start"
              popperModifiers={[
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
              ]}
            />
          </div>

          <Button
            variant="primary"
            onClick={() => fetchPatientsData(true)}
            style={{
              backgroundColor: "#00bcd4",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: "500",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              marginTop: "20px",
              ":hover": {
                backgroundColor: "#00acc1",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              },
            }}
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );

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
                  border: "4px solid #00bcd4",
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
                      header={renderHeader}
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
      <style>
        {`
          .enquiry-card {
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border: none;
            background: #f8f9fa;
            overflow: hidden;
            margin-bottom: 30px;
          }

          .card-body {
            padding: 30px;
          }

          .form-section {
            background: #ffffff;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95rem;
          }

          .form-control, .form-select {
            border-radius: 8px;
            border: 3px solid #dee2e6;
            padding: 12px 15px;
            transition: all 0.3s ease;
            background-color: #ffffff;
            color: #2c3e50;
            font-size: 0.95rem;
          }

          .form-control:focus, .form-select:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
            background-color: #f8F9FA;
          }

          textarea.form-control {
            min-height: 120px;
            resize: vertical;
          }

          .form-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
          }

          .btn-primary {
            background:linear-gradient(45deg, #00bcd4, #00acc1);
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
          }

          .btn-primary:hover {
            background: linear-gradient(45deg, #00acc1, #0097a7);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 188, 212, 0.3);
          }

          .btn-primary:disabled {
            background: #bdc3c7;
            transform: none;
          }

          /* Error message styling */
          .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .card-body {
              padding: 20px;
            }

            .form-section {
              padding: 15px;
            }

            .btn-primary {
              width: 100%;
              margin-top: 15px;
            }
          }

          /* Row spacing */
          .row {
            margin-bottom: 20px;
          }

          /* Spinner styling */
          .spinner-border {
            margin-right: 8px;
            width: 1.2rem;
            height: 1.2rem;
          }

          /* Optional: Add animation for form elements */
          .form-control, .form-select, .btn {
            animation: fadeIn 0.5s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Optional: Add hover effect for form controls */
          .form-control:hover, .form-select:hover {
            border-color: #3498db;
          }
        `}
      </style>
    </div>
  );
}
