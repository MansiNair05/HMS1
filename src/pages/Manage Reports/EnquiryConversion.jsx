import React, { useState } from "react";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import {
  Row,
  Col,
  Card,
  Container,
  Table,
  Form,
  Button,
} from "react-bootstrap";
import SimpleBar from "simplebar-react";

const EnquiryConversion = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Placeholder data for enquiry conversations
  const enquiryConversionData = [
    { date: "2025-01-01", customer: "Jane Doe", topic: "Product Details" },
    { date: "2025-01-03", customer: "John Smith", topic: "Billing Inquiry" },
  ];

  // Filter data based on selected dates
  const filteredData = enquiryConversionData.filter((entry) => {
    const isDateValid =
      (!fromDate || new Date(entry.date) >= new Date(fromDate)) &&
      (!toDate || new Date(entry.date) <= new Date(toDate));
    return isDateValid;
  });

  // Handle Find button click
  const handleFindClick = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      console.error(
        "Invalid date range: From Date should not be after To Date."
      );
      return;
    }
    console.log(`Filtering EnquiryConversion from ${fromDate} to ${toDate}`);
  };

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
      <PageBreadcrumb pagename="Enquiry Conversion Report" />

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
                  border: "1px solid #00bcd4",
                }}
              >
                <Card.Header
                  className="text-center"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#e3f2fd",
                    borderBottom: "2px solid #0288d1",
                    padding: "1rem",
                    background: "linear-gradient(to right, #00acc1, #007c91)",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  <h4>Enquiry Conversion Report</h4>
                </Card.Header>
                <Card.Body style={{ padding: "25px" }}>
                  {/* Filters */}
                  <Form onSubmit={handleFindClick}>
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
                    </Row>
                  </Form>
                  <br />
                  <br />
                  {/* Enquiry Conversation Table */}
                  <Table
                    bordered
                    responsive
                    className="table-striped"
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
                        textAlign: "center",
                      }}
                    >
                      <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th style={{ textAlign: "center" }}>Topic</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                      {filteredData.length > 0 ? (
                        filteredData.map((entry, index) => (
                          <tr key={index}>
                            <td>{entry.date}</td>
                            <td>{entry.customer}</td>
                            <td style={{ textAlign: "center" }}>
                              {entry.topic}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No records found for the selected date range.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </SimpleBar>
    </div>
  );
};

export default EnquiryConversion;
