import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";

const BASE_URL = "http://192.168.90.158:5000/api";

export default function DiagnosisReport() {
  const [showModal, setShowModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [comments, setComments] = useState(["", "", "", "", ""]); // Array for 5 comments
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const url = new URL(`${BASE_URL}/V1/diagnosis/listAllDiagnosis`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Fetched Data:", data.data);

        const result = Array.isArray(data.data)
          ? data.data.map((item, index) => ({
              srNo: index + 1, // Adding serial number
              ...item,
              ...(item.patientDetail || {}), // Merge patient details
              ...(item.patientHistoryDetail || {}), // Merge patient history
            }))
          : [];

        setReports(result);
        setFilteredReports(result); // Initially, show all data
      } else {
        console.error(
          "Error fetching reports:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to open the modal and set the current doctor
  const handleOpenModal = (doctor) => {
    setCurrentDoctor(doctor);
    setShowModal(true);
  };

  // Function to handle comment changes
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    setComments(updatedComments);
  };

  // Function to save comments
  const handleSaveComments = () => {
    console.log(`Comments for ${currentDoctor}:`, comments);
    setShowModal(false);
  };

  const filterByVisitDate = () => {
    if (!fromDate || !toDate) {
      setFilteredReports(reports);
      return;
    }

    const filteredData = reports.filter((report) => {
      const visitDate = new Date(report.date_diagnosis);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      return visitDate >= startDate && visitDate <= endDate;
    });

    setFilteredReports(filteredData);
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter reports based on fields that START WITH the search term
    const filteredData = reports.filter((report) =>
      Object.values(report).some(
        (field) =>
          typeof field === "string" && field.toLowerCase().includes(value) // Changed to startsWith
      )
    );

    setFilteredReports(filteredData);
  };

  const header = (
    <div className="d-flex justify-content-between align-items-center">
      <Form.Group
        className="d-flex align-items-center pe-3 mb-0"
        style={{ gap: "30px" }}
      >
        <InputGroup>
          <Form.Control
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Global Search"
          />
        </InputGroup>
      </Form.Group>
      <div
        className="d-flex align-items-center"
        style={{
          gap: "15px",
          border: "2px solid #4dd0e1",
          textAlign: "center",
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
        <Button variant="primary" onClick={() => filterByVisitDate(true)}>
          Refresh Data
        </Button>
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
      <PageBreadcrumb pagename="Diagnosis Report" />
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
                {loading ? (
                  <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <DataTable
                    value={filteredReports}
                    paginator
                    rows={10}
                    header={header}
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
                      field="srNo"
                      header="Sr. No"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="date_diagnosis"
                      header="Visit Date"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="Uid_no"
                      header="Uid No"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="name"
                      header="Patient Name"
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
                      field="mobile_2"
                      header="Alt Phone No"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="ref"
                      header="Patient Ref"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="occupation"
                      header="Occupation"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="address"
                      header="Address"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="past_history"
                      header="Past History"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="diagnosis"
                      header="Diagnosis"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="diagnosisAdvice"
                      header="Advice"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="adviceComment"
                      header="Advice Comment"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="consultantDoctor"
                      header="Consultamt Doctor"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="assistanceDoctor"
                      header="Assistance Doctor"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      field="feedback"
                      header="Feedback"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    />

                    <Column
                      header="Doctor Comments"
                      body={(rowData) => (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleOpenModal(rowData.consultantDoctor)
                          }
                        >
                          <i className="fa fa-envelope"></i>{" "}
                          {/* Email icon for comment */}
                        </Button>
                      )}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Patient Feedback Call Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[...Array(5)].map((_, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>Comment {index + 1} :</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={comments[index]}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  placeholder={`Enter comment ${index + 1}`}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveComments}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
