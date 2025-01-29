import React, { useState } from "react";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import SimpleBar from "simplebar-react";
import { Row, Col, Card, Container, Form } from "react-bootstrap";

const OPDReceiptsReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [consultation, setConsultation] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const handleFind = () => {
    // Placeholder for API call or filtering logic
    console.log({
      fromDate,
      toDate,
      consultation,
      patientStatus,
      paymentMode,
    });
  };

  return (
    <div
      className="themebody-wrap"
      style={{
        padding: "20px",
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        fontFamily: "'Poppins', Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      <PageBreadcrumb pagename="OPD Receipts Report" />

      {/* Card for the report filters */}
      <SimpleBar className="theme-body common-dash">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                  borderColor: "#00bcd4",
                  background: "white",
                }}
              >
                <Card.Header
                  className="text-center"
                  style={{
                    fontWeight: "bold",
                    fontSize: "22px",
                    color: "#006064",
                    background: "linear-gradient(to right, #4dd0e1, #00acc1)",
                    borderBottom: "3px solid #00bcd4",
                    padding: "1rem",
                    backgroundColor: "white",
                  }}
                >
                  <h4>OPD Receipts Report</h4>
                </Card.Header>
                <Card.Body style={{ padding: "25px" }}>
                  <Row className="align-items-end">
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontWeight: "bold", color: "#006064" }}
                        >
                          From Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          style={{
                            border: "2px solid #4dd0e1",
                            textAlign: "center",
                            borderRadius: "8px",
                            padding: "10px",
                            backgroundColor: "#e0f7fa",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontWeight: "bold", color: "#006064" }}
                        >
                          To Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          style={{
                            border: "2px solid #4dd0e1",
                            textAlign: "center",
                            borderRadius: "8px",
                            padding: "10px",
                            backgroundColor: "#e0f7fa",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <div className="form-group col-md-3">
                      <label htmlFor="consultation">Consultation</label>
                      <select
                        id="consultation"
                        className="form-control"
                        value={consultation}
                        onChange={(e) => setConsultation(e.target.value)}
                      >
                        <option value="">Select Consultation</option>
                        <option value="General">General</option>
                        <option value="Specialist">Specialist</option>
                      </select>
                    </div>
                    <div className="form-group col-md-3">
                      <label htmlFor="patientStatus">Patient Status</label>
                      <select
                        id="patientStatus"
                        className="form-control"
                        value={patientStatus}
                        onChange={(e) => setPatientStatus(e.target.value)}
                      >
                        <option value="">Select Patient Status</option>
                        <option value="New">New</option>
                        <option value="Follow-Up">Follow-Up</option>
                      </select>
                    </div>
                    <br />
                    <div className="form-group col-md-3">
                      <label htmlFor="paymentMode">Payment Mode</label>
                      <select
                        id="paymentMode"
                        className="form-control"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      >
                        <option value="">Select Payment Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>
                  </Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        style={{
                          marginTop: "20px",
                          height: "40px",
                          width: "100px",
                          backgroundColor: "#00acc1",
                          borderColor: "#00bcd4",
                          color: "white",
                          cursor: "pointer",
                          borderRadius: "8px",
                          transition: "0.3s all",
                          fontWeight: "bold",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#007c91";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#00acc1";
                        }}
                      >
                        Find
                      </button>
                    </Form.Group>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Table Section */}
          <div className="card mt-4">
            <div className="card-body">
          <Row>
            <Col>
              <div className="entries">
                <label htmlFor="entries">
                  Show
                  <select
                    id="entries"
                    className="form-control ml-2"
                    style={{ width: "80px" }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                      </select>
                      entries
                </label>
              </div>
            </Col>
            <Col className="d-flex justify-content-end">
              <div className="search">
                <label htmlFor="search">
                  Search:{" "}
                  <input
                    id="search"
                    type="text"
                    className="form-control"
                    style={{ width: "250px", marginLeft: "10px" }}
                  />
                </label>
              </div>
            </Col>
              </Row>
              <br />
              <div className="table-container">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Date</th>
                      <th>Patient Name</th>
                      <th>Consultation</th>
                      <th>Patient Status</th>
                      <th>Spray Qty</th>
                      <th>Payment Mode</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="8" className="text-center">
                        No data available in table
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </SimpleBar>
    </div>
  );
};

export default OPDReceiptsReport;