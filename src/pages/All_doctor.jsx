import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import FeatherIcon from "feather-icons-react";

import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  // Spinner,
} from "react-bootstrap";

// import IMAGE_URLS from "/src/pages/api/Imgconfig.js";
import PageBreadcrumb from "../components/PageBreadcrumb";

const BASE_URL = "http://192.168.1.139:5000/api"; // Corrected API base URL

export default function All_doctor() {
  const [doctors, setDoctors] = useState([]);
  const [filters1, setFilters1] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [loading, setLoading] = useState(false);

  // Fetch SuperAdmin Data
  const fetchDoctorData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/V1/admin/listDoctor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Fetched Data:", data.data); // Debug: Inspect the response
        setDoctors(data.data || []); // Update state with fetched doctors data
      } else {
        console.error(
          "Error fetching profile:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchDoctorData(); // Fetch data on component mount
  }, []);

  // // Image and status templates for the DataTable
  // const imageBodyTemplate = ({ image, title }) => (
  //   <div className="d-flex align-items-center">
  //     <img
  //       src={IMAGE_URLS[image]}
  //       alt={title}
  //       className="product-image rounded-50 w-40"
  //     />
  //     <span className="ml-10">{title}</span>
  //   </div>
  // );

  const statusBodyTemplate = (rowData) => (
    <span className={`badge status-${rowData.inventoryStatus?.toLowerCase()}`}>
      {rowData.inventoryStatus}
    </span>
  );

  const actionBodyTemplate = (rowData) => (
    <div className="cart-action">
      <Link className="appoinment" to={`/add-appointment/${rowData.id}`}>
        <FeatherIcon icon="plus-square" className="w-18" />
      </Link>
      <Link className="edit" to={`/edit-doctor/${rowData.id}`}>
        <FeatherIcon icon="edit" className="w-18" />
      </Link>
      <Link className="print" to="">
        <FeatherIcon icon="printer" className="w-18" />
      </Link>
    </div>
  );

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters1({
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const renderHeader = () => (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <Button variant="primary" onClick={() => fetchDoctorData()}>
          Check Data
        </Button>
      </div>
      <Form.Group className="d-flex align-items-center">
        <Form.Label className="pe-3 mb-0">Search</Form.Label>
        <InputGroup>
          <Form.Control
            type="search"
            value={filters1.global.value || ""}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
          />
        </InputGroup>
      </Form.Group>
    </div>
  );

  const header = renderHeader();

  return (
    <div className="themebody-wrap">
      {/* Breadcrumb */}
      <PageBreadcrumb pagename="All Doctors" />

      {/* Theme body */}
      <div className="theme-body">
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <DataTable
                    value={doctors}
                    paginator
                    rows={10}
                    header={header}
                    filters={filters1}
                    globalFilterFields={[
                      "name",
                      "age",
                      "gender",
                      "phone",
                      "email",
                      "inventoryStatus",
                    ]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    responsiveLayout="scroll"
                    className="p-datatable-customers"
                  >
                    {/* <Column header="Name" body={imageBodyTemplate} /> */}
                    <Column field="name" header="Name" sortable />
                    <Column field="age" header="Age" sortable />
                    <Column field="gender" header="Gender" sortable />
                    <Column field="phone" header="Phone No" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column header="Status" body={statusBodyTemplate} sortable />
                    <Column
                      field="action"
                      header="Action"
                      body={actionBodyTemplate}
                      exportable={false}
                      style={{ minWidth: "8rem" }}
                    />
                  </DataTable>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
