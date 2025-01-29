import React, { useState } from "react";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import { Row, Col, Card, Container, Form, CardBody } from "react-bootstrap";
import SimpleBar from "simplebar-react";

// Sample data for appointment report
const appointmentTypes = ["Consultation", "Follow-up", "Check-up"];
const appointmentStatuses = ["Scheduled", "Completed", "Cancelled"];

const AppointmentReport = () => {
  // State for form inputs
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");

  // Sample report data (could be dynamic based on real data)
  const appointmentData = [
    {
      date: "2025-01-01",
      type: "Consultation",
      status: "Scheduled",
      patient: "John Doe",
    },
  ];

  // Filter data based on selected inputs
  const filteredData = appointmentData.filter((appointment) => {
    const isDateValid =
      (!fromDate || new Date(appointment.date) >= new Date(fromDate)) &&
      (!toDate || new Date(appointment.date) <= new Date(toDate));
    const isTypeValid =
      !appointmentType || appointment.type === appointmentType;
    const isStatusValid =
      !appointmentStatus || appointment.status === appointmentStatus;

    return isDateValid && isTypeValid && isStatusValid;
  });
  const handleFindClick = (e) => {
    e.preventDefault();
    console.log(`Filtering Billing Report from ${fromDate} to ${toDate}`);
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
      <PageBreadcrumb pagename="Appointment Conversion" />

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
                  <h4>Manage Appointment Report</h4>
                </Card.Header>
                <Card.Body style={{ padding: "25px" }}>
                  {/* Form for selecting filters */}
                  <Form onSubmit={handleFindClick}>
                    <Row className="align-items-end">
                      <Col md={2}>
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
                      <Col md={2}>
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
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontWeight: "bold", color: "#006064" }}
                          >
                            Appointment Type
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={appointmentType}
                            onChange={(e) => setAppointmentType(e.target.value)}
                          >
                            <option value="">All</option>
                            {appointmentTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontWeight: "bold", color: "#006064" }}
                          >
                            Appointment Status
                          </Form.Label>
                          <Form.Control
                            as="select"
                            value={appointmentStatus}
                            onChange={(e) =>
                              setAppointmentStatus(e.target.value)
                            }
                          >
                            <option value="">All</option>
                            {appointmentStatuses.map((status, index) => (
                              <option key={index} value={status}>
                                {status}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <button
                            className="btn btn-primary"
                            type="submit"
                            style={{
                              marginTop: "30px",
                              height: "40px",
                              width: "100%",
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
                    </Row>
                  </Form>
                  <br />
                  <br />
                  <h4>Appointment Details</h4>
                  <table
                    className="table table-bordered"
                    style={{
                      border: "1px solid #90caf9",
                      textAlign: "center",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#0288d1",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      <tr>
                        <th style={{ padding: "10px" }}>Date</th>
                        <th style={{ padding: "10px" }}>Patient</th>
                        <th style={{ padding: "10px" }}>Appointment Type</th>
                        <th style={{ padding: "10px", textAlign: "center" }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((appointment, index) => (
                          <tr key={index} style={{ textAlign: "center" }}>
                            <td style={{ padding: "10px" }}>
                              {appointment.date}
                            </td>
                            <td style={{ padding: "10px" }}>
                              {appointment.patient}
                            </td>
                            <td style={{ padding: "10px" }}>
                              {appointment.type}
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                textAlign: "center",
                                color:
                                  appointment.status === "Scheduled"
                                    ? "#00796b"
                                    : appointment.status === "Completed"
                                    ? "#388e3c"
                                    : "#d32f2f",
                              }}
                            >
                              {appointment.status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            style={{ textAlign: "center", padding: "10px" }}
                          >
                            No appointments found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </SimpleBar>
    </div>
  );
};

export default AppointmentReport;
