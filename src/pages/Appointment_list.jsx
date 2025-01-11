import React, { useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import FeatherIcon from 'feather-icons-react';

import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, InputGroup, Modal, Button } from 'react-bootstrap';

import PageBreadcrumb from '../components/PageBreadcrumb';

export default function Appointment_list() {
  const [show, setShow] = useState(false);

  const Close_btn = () => setShow(false);
  const emailcreat = () => setShow(true);
  //  Inuut value start 
  const [formData, setFormData] = useState({
    Srno: '',
    Date: '',
    AppointmentTime: '',
    ConfirmTime: '',
    Type: '',
    PatientName: '',
    ContactNo: '',
    DoctorName: '',
    FDEName: '',
    Note: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Data Table 
  const sales = [
    {
      Srno: 1,
      Date: "05/21/2023",
      AppointmentTime: "9:00 AM",
      ConfirmTime: "9:15 AM",
      Type: "Checkup",
      Patient: "Brielle Williamson",
      ContactNo: "+1 25 962689",
      DoctorName: "Dr. Smith",
      FDEName: "John Doe",
      Note: "Follow-up required",
    },
    {
      Srno: 2,
      Date: "05/21/2023",
      AppointmentTime: "10:00 AM",
      ConfirmTime: "10:10 AM",
      Type: "Consultation",
      Patient: "Cedric Kelly",
      ContactNo: "+1 25 962689",
      DoctorName: "Dr. Lee",
      FDEName: "Jane Smith",
      Note: "New patient",
    }
  ];
  const PatientTemplate = ({ title }) => {
    return (
        <span className="ml-10">{title}</span>
    )
  }
  const statusBodyTemplate = (rowData) => {
    return <span className={`badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }
  //  SearchFilter 
  const [filters1, setFilters1] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'representative': { value: null, matchMode: FilterMatchMode.IN },
    'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  });
  const filtersMap = {
    'filters1': { value: filters1, callback: setFilters1 },
  };
  const onGlobalFilterChange = (event, filtersKey) => {
    const value = event.target.value;
    let filters = { ...filtersMap[filtersKey].value };
    filters['global'].value = value;
    filtersMap[filtersKey].callback(filters);
  }

  const renderHeader = (filtersKey) => {
    const filters = filtersMap[`${filtersKey}`].value;
    const value = filters['global'] ? filters['global'].value : '';

    return (
      <div className="d-flex justify-content-end align-align-items-baseline">
        <Form.Group className="d-flex align-items-center">
          <Form.Label className="pe-3 mb-0"> Search</Form.Label>
          <InputGroup className=" px-2">
            <Form.Control type="search" className="form-control px-2" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Global Search" />
          </InputGroup>
        </Form.Group>
      </div>
    );
  }
  const header1 = renderHeader('filters1');


  const actionBodyTemplate = () => {
    return (
      <React.Fragment>
        <div className="cart-action">
          <Link className="edit" to="/edit-patient">
            <FeatherIcon icon="edit" className="w-18" />
          </Link>
          <Link className="delete text-danger" to="">
            <FeatherIcon icon="trash-2" className="w-18" />
          </Link>
        </div>
      </React.Fragment>
    );
  }
  return (
    <>
      <div className="themebody-wrap">
        {/* Breadcrumb Start */}
        <PageBreadcrumb pagename="view all appointment" />
        {/* Breadcrumb End */}
        {/* theme body start */}
        <div className="theme-body">
          <Container fluid>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Row className="Product_list">
                      <Col md={12}>
                        <Link className="btn btn-primary float-end mb-15" onClick={emailcreat}>
                        Add new Appoitment
                        </Link>
                      </Col>
                      <DataTable value={sales} rows={10} header={header1} filters={filters1} onFilter={(e) => setFilters1(filters1)}
                        stateStorage="session" paginator rowsPerPageOptions={[5, 10, 50]}
                        paginatorTemplate="CurrentPageReport  FirstPageLink  PageLinks LastPageLink  RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" className="p-datatable-customers" >
                        <div field="Srno" header="Sr No" sortable></div>
                        <div field="Date" header="Date" sortable></div>
                        <div field="AppointmentTime" header="Appointment Time" sortable></div>
                        <div field="ConfirmTime" header="Confirm Time" sortable></div>
                        <div field="Type" header="Type" sortable></div>
                        <div field="Patient" header="Patient" sortable></div>
                        <div field="ContactNo" header="Contact No" sortable></div>
                        <div field="DoctorName" header="Doctor Name" sortable></div>
                        <div field="FDEName" header="FDE Name" sortable></div>
                        <div field="Note" header="Note" sortable></div>
                        <div field="Action" header="Action" sortable body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></div>
                      </DataTable>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        {/* theme body end */}
      </div>
      {/* Modal Start  */}
      <Modal show={show} onHide={Close_btn}>
        <Modal.Header>
          <Modal.Title>
            <h5 className="modal-title">Add New Appointment</h5>
          </Modal.Title>
          <span className="close-modal" onClick={Close_btn}>
            <FeatherIcon icon="x" />
          </span>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-20">
                  <Form.Label>Frist Name</Form.Label>
                  <Form.Control type="text" name="fristname" placeholder="Patient First Name" value={formData.fristname} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-20">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastname" placeholder="Patient Last Name" value={formData.lastname} onChange={handleInputChange} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-20">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" name="Phone"  placeholder="Phone Number" value={formData.Phone} onChange={handleInputChange} />
                </Form.Group>
              </Col>

              

              <Col md={6}>
                <Form.Group className="mb-20">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" name="email"  placeholder="Email Id" value={formData.email} onChange={handleInputChange} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-20">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="text" name="date"  placeholder="DD/MM/YYYY"  value={formData.date} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-20">
                  <Form.Label>Appointment Time</Form.Label>
                  <Form.Control type="email" name="time"  placeholder="Email Id" value={formData.time} onChange={handleInputChange} />
                </Form.Group>
              </Col>


            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button className="btn btn-primary">Save</Button>
          <Button className="btn btn-danger" onClick={Close_btn}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal End  */}
    </>
  )
}
