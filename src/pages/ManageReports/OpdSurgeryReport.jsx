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
    console.log("Opening modal for patient ID:", patientId);
    setCurrentPatientId(patientId);
    setShowModal(true);
  };
  const feedbackBodyTemplate = (rowData) => {
    return rowData.opd_feedback && rowData.opd_feedback.trim() !== ""
      ? rowData.opd_feedback
      : "No feedback";
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
      .filter(([_, value]) => value)
      .map(([title, comment]) => `${title}: ${comment}`)
      .join(" | ");

    const payload = {
      opd_feedback: combinedFeedback,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/V1/surgeryDetails/addPatientComment/${currentPatientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Update the opd_feedback in local storage
        const updatedReports = reports.map((report) =>
          report.patient_id === currentPatientId
            ? { ...report, opd_feedback: combinedFeedback }
            : report
        );
        setReports(updatedReports);
        setFilteredReports(updatedReports);
        localStorage.setItem("OPDreports", JSON.stringify(updatedReports));

        setShowModal(false);
        setComments({}); // Reset comments
      } else {
        console.error("Failed to save opd_feedback:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving opd_feedback:", error);
    }
  };

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const storedReports = localStorage.getItem("OPDreports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
      setFilteredReports(JSON.parse(storedReports));
      console.log("Stored Reports:", JSON.parse(storedReports)); // Log stored reports
    } else {
      fetchReportsData();
    }
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Handle both formats: dd/mm/yyyy and yyyy-mm-dd
    let day, month, year;
    if (dateStr.includes("/")) {
      [day, month, year] = dateStr.split("/").map((num) => parseInt(num, 10));
    } else {
      [year, month, day] = dateStr.split("-").map((num) => parseInt(num, 10));
    }
    return new Date(year, month - 1, day);
  };

  const filterRecords = (search, from, to) => {
    console.log("Filtering with dates:", from, to); // Debug log
    let filtered = [...reports];

    // Filter by date range if both dates are selected
    if (from && to) {
      const fromDate = parseDate(from);
      const toDate = parseDate(to);

      if (fromDate && toDate) {
        // Set time to start and end of days
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        console.log("Date range:", fromDate, "to", toDate); // Debug log

        filtered = filtered.filter((report) => {
          const recordDate = parseDate(report.surgery_date);
          if (!recordDate) return false;

          console.log(
            "Comparing date:",
            report.surgery_date,
            recordDate >= fromDate && recordDate <= toDate
          ); // Debug log
          return recordDate >= fromDate && recordDate <= toDate;
        });
      }
    }

    // Filter by search term if present
    if (search) {
      filtered = filtered.filter((report) =>
        Object.values(report).some(
          (field) =>
            typeof field === "string" && field.toLowerCase().includes(search)
        )
      );
    }

    // Sort by surgery date
    filtered.sort((a, b) => {
      const dateA = parseDate(a.surgery_date);
      const dateB = parseDate(b.surgery_date);
      if (!dateA || !dateB) return 0;
      return dateA - dateB;
    });

    console.log("Filtered records:", filtered); // Debug log
    setFilteredReports(filtered);
  };

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    console.log("New from date:", newFromDate); // Debug log
    setFromDate(newFromDate);
    filterRecords(searchTerm, newFromDate, toDate);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    console.log("New to date:", newToDate); // Debug log
    setToDate(newToDate);
    filterRecords(searchTerm, fromDate, newToDate);
  };

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const url = new URL(
        `${BASE_URL}/V1/surgeryDetails/listAllSurgeryDetails`
      );

      if (fromDate && toDate) {
        const formatDateForApi = (dateStr) => {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const params = {
          from: formatDateForApi(fromDate),
          to: formatDateForApi(toDate),
        };

        console.log("API date params:", params); // Debug log
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      }

      const response = await fetch(url.toString(), {
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
              diagnosis: item.plan || "",
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
        localStorage.setItem("OPDreports", JSON.stringify(result));
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
    filterRecords(value, fromDate, toDate);
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
            onChange={handleFromDateChange}
          />
        </Form.Group>
        <Form.Group className="pe-3 mb-0">
          To Date
          <Form.Control
            type="date"
            value={toDate}
            onChange={handleToDateChange}
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
                            onClick={() => {
                              console.log("Opening comments for:", rowData);
                              handleShowModal(rowData.patient_id);
                            }}
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
