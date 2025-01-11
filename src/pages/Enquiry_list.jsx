import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
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

const BASE_URL = "http://192.168.90.116:5000/api";

export default function EnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [filters1, setFilters1] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchEnquiriesData = async () => {
    setLoading(true);
    try {
      const url = new URL(`${BASE_URL}/V1/enquiry/listEnquiry`);
      const params = {
        from: fromDate.split("-").reverse().join("/"), // Convert yyyy-mm-dd to dd/mm/yyyy
        to: toDate.split("-").reverse().join("/"), // Convert yyyy-mm-dd to dd/mm/yyyy
      };

      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Ensure data is an array
        setEnquiries(Array.isArray(data.data) ? data.data : []);
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

  useEffect(() => {
    fetchEnquiriesData();
  }, [fromDate, toDate]);
  
  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center">
      {/* Left Section */}
      <div className="d-flex align-items-center" style={{ gap: '30px' }}>
        <Form.Group className="d-flex align-items-center pe-3 mb-0">
          <Form.Label>Search</Form.Label>
          <InputGroup>
            <Form.Control
              type="search"
              value={filters1.global.value || ""}
              onChange={(e) =>
                setFilters1({
                  global: {
                    value: e.target.value,
                    matchMode: FilterMatchMode.CONTAINS,
                  },
                })
              }
              placeholder="Global Search"
            />
          </InputGroup>
        </Form.Group>
      </div>
  
      {/* Right Section */}
      <div className="d-flex align-items-center" style={{ gap: '15px' }}>
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
        <Button variant="primary" onClick={fetchEnquiriesData}>
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
                      value={enquiries}
                      paginator
                      rows={10}
                      header={header}
                      globalFilterFields={[
                        "srNo",
                        "date",
                        "patient_name",
                        "patient_phone",
                        "patient_location",
                        "enquirytype",
                        "FDE_Name",
                      ]}
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
