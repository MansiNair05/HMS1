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
import * as XLSX from "xlsx";

const BASE_URL = "http://192.168.90.158:5000/api";

export default function DiagnosisReport() {
  const [showModal, setShowModal] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
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
      console.log("Fetching data from:", url.toString());

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Raw API Response:", data);

      if (response.ok) {
        const result = Array.isArray(data.data)
          ? data.data.map((item, index) => ({
              srNo: index + 1,
              patient_id: item.patient_id,
              date_diagnosis: item.date_diagnosis,
              diagnosis: item.diagnosis,
              diagnosisAdvice: item.diagnosisAdvice,
              adviceComment: item.adviceComment,
              consultantDoctor: item.consultantDoctor,
              assistanceDoctor: item.assistanceDoctor,
              feedback: item.feedback,
              comment: item.comment,
              // Patient details
              Uid_no: item.patientDetail?.Uid_no,
              // prefix: item.patientDetail?.prefix,
              name: `${item.patientDetail?.prefix} ${item.patientDetail?.name}`, // Concatenate prefix and name
              age: item.patientDetail?.age,
              sex: item.patientDetail?.sex,
              phone: item.patientDetail?.phone,
              // mobile_2: item.patientDetail?.mobile_2,
              // occupation: item.patientDetail?.occupation,
              address: item.patientDetail?.address,
              ref: item.patientDetail?.ref,
              // Patient history details
              past_history: item.patientHistoryDetail?.past_history,
            }))
          : [];

        console.log("Mapped Results:", result);
        setReports(result);
        setFilteredReports(result);
        localStorage.setItem("diagnosisReports", JSON.stringify(result));
      } else {
        console.error("Error Response:", {
          status: response.status,
          statusText: response.statusText,
          message: data.message || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const feedbackBodyTemplate = (rowData) => {
    return rowData.feedback && rowData.feedback.trim() !== ""
      ? rowData.feedback
      : "No comments";
  };

  const exportToExcel = () => {
    if (!filteredReports.length) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredReports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Diagnosis Reports");
    XLSX.writeFile(workbook, "DiagnosisReports.xlsx");
  };

  const handleOpenModal = (patient_id) => {
    console.log("handleopen", patient_id);
    setCurrentPatientId(patient_id);
    setShowModal(true);
  };

  // Function to handle comment changes
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    setComments(updatedComments);
  };

  const handleSaveComments = async (event) => {
    event.preventDefault();

    const combinedFeedback = comments
      .map((comment, index) => `Comment ${index + 1}: ${comment}`)
      .join(", ");

    const payload = {
      feedback: combinedFeedback,
    };

    console.log("patientId", currentPatientId);
    try {
      const response = await fetch(
        `${BASE_URL}/V1/diagnosis/addDoctorComment/${currentPatientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Update feedback in local storage using patient_id
        const updatedReports = reports.map((report) =>
          report.patient_id === currentPatientId
            ? { ...report, feedback: combinedFeedback }
            : report
        );
        setReports(updatedReports);
        setFilteredReports(updatedReports);
        localStorage.setItem(
          "diagnosisReports",
          JSON.stringify(updatedReports)
        );

        setShowModal(false);
      } else {
        console.error("Failed to save feedback:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const filterByVisitDate = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    console.log("Raw Reports Data:", reports); // Debugging: Check the original API data

    if (!fromDate || !toDate) {
      // Default to showing only today's data
      const todaysData = reports.filter((report) => {
        const reportDate = new Date(report.date_diagnosis)
          .toISOString()
          .split("T")[0];
        return reportDate === today;
      });

      setFilteredReports(todaysData);
      console.log("Filtered Today's Data:", todaysData);
      return;
    }

    // If date range is selected, filter accordingly
    const filteredData = reports.filter((report) => {
      const visitDate = new Date(report.date_diagnosis)
        .toISOString()
        .split("T")[0];
      return visitDate >= fromDate && visitDate <= toDate;
    });

    setFilteredReports(filteredData);
    console.log("Filtered Reports by Date Range:", filteredData);
  };

  // Load only today's data initially
  useEffect(() => {
    fetchReportsData();
  }, []);

  useEffect(() => {
    filterByVisitDate();
  }, [reports]); // Apply filtering once reports are fetched

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = reports.filter((report) =>
      Object.values(report).some(
        (field) =>
          typeof field === "string" && field.toLowerCase().includes(value)
      )
    );

    setFilteredReports(filteredData);
    console.log("Search Results:", filteredData);
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

      <div className="d-flex align-items-center" style={{ gap: "15px" }}>
        <Button variant="success" onClick={exportToExcel}>
          Export to Excel
        </Button>

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
              max={new Date().toISOString().split("T")[0]} // Disable future dates
            />
          </Form.Group>

          <Form.Group className="pe-3 mb-0">
            To Date
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]} // Disable future dates
            />
          </Form.Group>
          <Button variant="primary" onClick={filterByVisitDate}>
            Find Data
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
                    {/* 
                    <Column
                      field="sex"
                      header="Gender"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    /> */}

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
                    {/* 
                    <Column
                      field="mobile_2"
                      header="Alt Phone No"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    /> */}

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
                    {/* 
                    <Column
                      field="occupation"
                      header="Occupation"
                      sortable
                      style={{
                        border: "1px solid #90caf9",
                        textAlign: "center",
                        padding: "0.75rem",
                      }}
                    /> */}

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
                      body={feedbackBodyTemplate}
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
                          onClick={() => {
                            console.log("Rowdata", rowData);
                            handleOpenModal(rowData.patient_id);
                            console.log("PATIENT ID", rowData.patient_id);
                          }}
                        >
                          <i className="fa fa-envelope"></i>
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
          <Form onSubmit={handleSaveComments}>
            {[...Array(5)].map((_, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>Comment {index + 1}:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={comments[index]}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  placeholder={`Enter comment ${index + 1}`}
                />
              </Form.Group>
            ))}
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
