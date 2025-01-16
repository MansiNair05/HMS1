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
} from "react-bootstrap";
import PageBreadcrumb from "/Medflex/medflex/src/components/PageBreadcrumb";

const BASE_URL = "http://192.168.90.147:5000/api";

export default function EnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch enquiries data
  const fetchEnquiriesData = async (withFilters = false) => {
    setLoading(true);
    try {
      const url = new URL(`${BASE_URL}/V1/enquiry/listEnquiry`);
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
        const result = Array.isArray(data.data) ? data.data : [];
        setEnquiries(result);
        setFilteredEnquiries(result); // Initialize filtered data
      } else {
        console.error(
          "Error fetching enquiries:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load default data on component mount
  useEffect(() => {
    fetchEnquiriesData(); // Fetch data for current date by default
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = enquiries.filter((enquiry) =>
      Object.values(enquiry).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(value)
      )
    );

    setFilteredEnquiries(filteredData); // Update filtered data
  };

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center">
      {/* Left Section */}
      <div className="d-flex align-items-center" style={{ gap: "30px" }}>
        <Form.Group className="d-flex align-items-center pe-3 mb-0">
          <Form.Label>Search</Form.Label>
          <InputGroup>
            <Form.Control
              type="search"
              value={searchTerm}
              onChange={handleSearchChange} // Handle live search
              placeholder="Global Search"
            />
          </InputGroup>
        </Form.Group>
      </div>

      {/* Right Section */}
      <div className="d-flex align-items-center" style={{ gap: "15px" }}>
        <Form.Group className="pe-3 mb-0">
          <Form.Label>From Date</Form.Label>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="pe-3 mb-0">
          <Form.Label>To Date</Form.Label>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => fetchEnquiriesData(true)} // Fetch data with filters
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );

  const header = renderHeader();

  return (
    <div className="themebody-wrap">
      <PageBreadcrumb pagename="Enquiry List" />
      <div className="theme-body">
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  {loading ? (
                    <div className="d-flex justify-content-center py-5">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <DataTable
                      value={filteredEnquiries} // Use filtered data
                      paginator
                      rows={10}
                      header={header}
                      responsiveLayout="scroll"
                    >
                      <Column field="srNo" header="Sr. No" sortable />
                      <Column field="date" header="Date" sortable />
                      <Column field="patient_name" header="Patient Name" sortable />
                      <Column field="patient_phone" header="Contact No" sortable />
                      <Column field="patient_location" header="Address" sortable />
                      <Column field="enquirytype" header="Enquiry Type" sortable />
                      <Column field="FDE_Name" header="FDE Name" sortable />
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
