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

export default function OpdSurgeryReport() {
  const [showModal, setShowModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    oneMonth: "",
    twoMonth: "",
    threeMonth: "",
    sixMonth: "",
    oneYear: "",
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPatientId, setCurrentPatientId] = useState(null);

  const [comments, setComments] = useState(["", "", "", "", ""]);

  const handleShowModal = (patientId) => {
    setCurrentPatientId(patientId);
    setShowModal(true);
  };
  const feedbackBodyTemplate = (rowData) => {
    return rowData.feedback && rowData.feedback.trim() !== ""
      ? rowData.feedback
      : "No comments";
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPatientId(null);
  };
  const handleCommentChange = (title, value) => {
    setComments((prevComments) => ({ ...prevComments, [title]: value }));
  };
  const handleSaveComments = async (event) => {
    event.preventDefault();

    const combinedFeedback = Object.entries(comments)
      .map(([title, comment]) => `${title}: ${comment}`)
      .join(", ");

    const payload = {
      patient_id: currentPatientId,
      opd_feedback: combinedFeedback,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/V1/surgery/updateSurgeryFeedback/${currentPatientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedReports = reports.map((report) =>
          report.patient_id === currentPatientId
            ? { ...report, opd_feedback: combinedFeedback }
            : report
        );
        setReports(updatedReports);
        setFilteredReports(updatedReports);
        localStorage.setItem("reports", JSON.stringify(updatedReports));

        setShowModal(false);
        setComments({});
      } else {
        console.error("Failed to save feedback:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const storedReports = localStorage.getItem("reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
      setFilteredReports(JSON.parse(storedReports));
      console.log("Stored Reports:", JSON.parse(storedReports)); // Log stored reports
    } else {
      fetchReportsData();
    }
  }, []);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const url = new URL(
        `${BASE_URL}/V1/surgeryDetails/listAllSurgeryDetails`
      );
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
              admission_date: item.admission_date,
              surgery_date: item.surgery_date,
              plan: item.plan || "",
              assistanceDoctor: item.assistanceDoctor || "",
              opd_feedback: item.opd_feedback || "",
              // Patient details from nested patientDetail object
              name: item.patientDetail?.name || "",
              age: item.patientDetail?.age || "",
              sex: item.patientDetail?.sex || "",
              phone: item.patientDetail?.phone || "",
              mobile_2: item.patientDetail?.mobile_2 || "",
              occupation: item.patientDetail?.occupation || "",
              address: item.patientDetail?.address || "",
              ref: item.patientDetail?.ref || "",
            }))
          : [];

        console.log("Mapped Results:", result);
        setReports(result);
        setFilteredReports(result);
        localStorage.setItem("reports", JSON.stringify(result));
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

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredReports(
      reports.filter((report) =>
        Object.values(report).some(
          (field) =>
            typeof field === "string" && field.toLowerCase().includes(value)
        )
      )
    );
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
        <Button variant="primary" onClick={fetchReportsData}>
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
      <PageBreadcrumb pagename="OPD Surgery Report" />
      <Container fluid>
        <Row>
          <Col>
            <Card
              className="shadow-sm border-info bg-white rounded"
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
                  <>
                    <DataTable
                      value={filteredReports}
                      paginator
                      rows={10}
                      responsiveLayout="scroll"
                      header={header}
                    >
                      <Column field="srNo" header="Sr. No" sortable />
                      <Column
                        field="admission_date"
                        header="Admission Date"
                        sortable
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                      />
                      <Column
                        field="surgery_date"
                        header="Surgery Date"
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
                        field="plan"
                        header="Diagnosis"
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
                        field="opd_feedback"
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
                        field="opd_feedback"
                        header="Comments"
                        style={{
                          border: "1px solid #90caf9",
                          textAlign: "center",
                          padding: "0.75rem",
                        }}
                        body={(rowData) => (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShowModal(rowData.patient_id)}
                          >
                            <i className="fa fa-envelope"></i>
                          </Button>
                        )}
                      />
                    </DataTable>

                    {/* Modal Popup */}
                    <Modal
                      show={showModal}
                      onHide={() => setShowModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Patient Feedback Call Description
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={handleSaveComments}>
                          {[
                            "3 Days",
                            "15 Days",
                            "1 Month",
                            "2 Months",
                            "3 Months",
                            "6 Months",
                            "1 Year",
                          ].map((title, index) => (
                            <Form.Group key={index} className="mb-3">
                              <Form.Label>{title}:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={comments[title] || ""}
                                onChange={(e) =>
                                  handleCommentChange(title, e.target.value)
                                }
                                placeholder={`Enter feedback for ${title}`}
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
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
